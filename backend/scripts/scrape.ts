/**
 * Scraper: cào dữ liệu thơ từ Wikisource & Wikipedia (không captcha, miễn phí)
 *
 * Nguồn:
 *  - vi.wikisource.org  → nội dung bài thơ (MediaWiki API)
 *  - vi.wikipedia.org   → tiểu sử tác giả  (MediaWiki API)
 *
 * Chạy:
 *   cd backend
 *   npx ts-node scripts/scrape.ts [--limit=100] [--delay=600]
 *
 * Flags:
 *   --limit=N     số bài thơ tối đa (mặc định 200)
 *   --delay=N     ms giữa 2 request (mặc định 600)
 *   --dry-run     chỉ in ra, không lưu DB
 */

import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { join } from 'path';
import axios from 'axios';
import { Repository } from 'typeorm';

dotenv.config({ path: join(__dirname, '..', '.env') });

import { AppDataSource } from '../src/data-source';
import { Author } from '../src/entities/author.entity';
import { Poem, PoemStatus } from '../src/entities/poem.entity';
import { PoemVersion } from '../src/entities/poem-version.entity';
import { Country } from '../src/entities/country.entity';
import { Era } from '../src/entities/era.entity';
import { PoemCategory } from '../src/entities/poem-category.entity';
import slugify from 'slugify';

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, v] = a.slice(2).split('=');
      return [k, v ?? 'true'];
    }),
);

const LIMIT = parseInt(args['limit'] ?? '200', 10);
const DELAY_MS = parseInt(args['delay'] ?? '600', 10);
const DRY_RUN = args['dry-run'] === 'true';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function log(msg: string) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

function makeSlug(text: string, suffix?: string | number): string {
  const base = slugify(text, { lower: true, strict: true });
  return suffix != null ? `${base}-${suffix}` : base;
}

/** Xoá markup wikitext còn lại trong text */
function cleanWikitext(text: string): string {
  return text
    .replace(/\{\{[^}]*\}\}/g, '')     // {{template}}
    .replace(/\[\[(?:[^|\]]*\|)?([^\]]*)\]\]/g, '$1') // [[Link|text]] → text
    .replace(/<ref[^>]*>.*?<\/ref>/gs, '') // <ref>...</ref>
    .replace(/<[^>]+>/g, '')            // HTML tags còn lại
    .replace(/'{2,}/g, '')              // '' bold/italic
    .replace(/^[;:]+/gm, '')           // wikitext indentation
    .replace(/^\*+\s*/gm, '')          // bullet list
    .replace(/\n{3,}/g, '\n\n')        // nhiều dòng trắng
    .trim();
}

/** Trích nội dung <poem>...</poem> - lấy block đầu tiên có nghĩa */
function extractPoemContent(wikitext: string): string {
  const matches = [...wikitext.matchAll(/<poem>([\s\S]*?)<\/poem>/gi)];
  if (!matches.length) return '';

  // Ưu tiên block cuối cùng nếu có nhiều (thường là bản phiên âm tiếng Việt)
  const raw = matches[matches.length - 1][1];
  return cleanWikitext(raw);
}

/** Trích transcription (phiên âm) nếu bài có 2 block poem */
function extractTranscription(wikitext: string): string | undefined {
  const matches = [...wikitext.matchAll(/<poem>([\s\S]*?)<\/poem>/gi)];
  if (matches.length < 2) return undefined;
  return cleanWikitext(matches[0][1]);
}

/** Parse template {{đầu đề | tựa đề = ... | tác giả = ... | ... }} */
function parseTemplate(wikitext: string): Record<string, string> {
  const result: Record<string, string> = {};
  const block = wikitext.match(/\{\{đầu đề([\s\S]*?)\}\}/i)?.[1] ?? '';
  for (const line of block.split('\n')) {
    const m = line.match(/^\s*\|\s*(.+?)\s*=\s*(.*?)\s*$/);
    if (m) {
      const key = m[1].trim().toLowerCase().replace(/\s+/g, '_');
      const val = m[2].replace(/<ref[^>]*>.*?<\/ref>/gs, '').replace(/<[^>]+>/g, '').trim();
      if (val) result[key] = val;
    }
  }
  return result;
}

/** Tách năm sinh/mất từ tiểu sử Wikipedia */
function parseBirthDeath(extract: string): { birth?: string; death?: string } {
  // Dạng "3 tháng 1 năm 1766 – 16 tháng 9 năm 1820"
  const m1 = extract.match(/(\d{4})\s*[–\-]\s*(\d{4})/);
  if (m1) return { birth: m1[1], death: m1[2] };

  // Dạng "sinh năm 1942"
  const birth = extract.match(/sinh\s+(?:\d+\s+tháng\s+\d+\s+năm\s+)?(\d{4})/i)?.[1];
  const death = extract.match(/mất\s+(?:\d+\s+tháng\s+\d+\s+năm\s+)?(\d{4})/i)?.[1];
  return { birth, death };
}

// ─── API calls ────────────────────────────────────────────────────────────────

const http = axios.create({
  timeout: 15_000,
  headers: {
    'User-Agent': 'ThiVienScraper/1.0 (educational poetry archive; https://github.com/thivien)',
  },
});

async function wikisourceGetCategoryPages(
  category: string,
  continueToken?: string,
): Promise<{ members: Array<{ pageid: number; title: string }>; continueToken?: string }> {
  const params: Record<string, string> = {
    action: 'query',
    list: 'categorymembers',
    cmtitle: `Thể_loại:${category}`,
    cmlimit: '50',
    cmtype: 'page',
    format: 'json',
  };
  if (continueToken) params['cmcontinue'] = continueToken;

  const { data } = await http.get('https://vi.wikisource.org/w/api.php', { params });
  return {
    members: data.query?.categorymembers ?? [],
    continueToken: data.continue?.cmcontinue,
  };
}

async function wikisourceGetPageWikitext(title: string): Promise<string | null> {
  const { data } = await http.get('https://vi.wikisource.org/w/api.php', {
    params: {
      action: 'query',
      titles: title,
      prop: 'revisions',
      rvprop: 'content',
      rvslots: 'main',
      format: 'json',
    },
  });
  const pages = data.query?.pages ?? {};
  const page = Object.values(pages)[0] as any;
  return page?.revisions?.[0]?.slots?.main?.['*'] ?? null;
}

async function wikipediaGetAuthorInfo(name: string): Promise<{
  extract: string;
  birth?: string;
  death?: string;
} | null> {
  try {
    const { data } = await http.get('https://vi.wikipedia.org/w/api.php', {
      params: {
        action: 'query',
        titles: name,
        prop: 'extracts',
        exintro: 'true',
        explaintext: 'true',
        format: 'json',
      },
    });
    const pages = data.query?.pages ?? {};
    const page = Object.values(pages)[0] as any;
    if (page?.missing !== undefined) return null;
    const extract: string = page?.extract ?? '';
    if (!extract) return null;
    const { birth, death } = parseBirthDeath(extract);
    return { extract: extract.slice(0, 3000), birth, death };
  } catch {
    return null;
  }
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

/** Map tên thể loại Wikisource → slug trong DB */
const CATEGORY_MAP: Record<string, string> = {
  'lục bát': 'tho-luc-bat',
  'thơ đường luật': 'tho-duong-luat',
  'song thất lục bát': 'song-that-luc-bat',
  'thơ haiku': 'tho-haiku',
  'thơ tự do': 'tho-tu-do',
  'cổ phong': 'tho-duong-luat',
  'truyện thơ': 'truyen-tho-nom',
  'phú': 'phu',
};

/** Tìm era phù hợp theo năm sinh */
function matchEra(eras: Era[], birthYear?: string): Era | undefined {
  if (!birthYear) return undefined;
  const year = parseInt(birthYear, 10);
  if (isNaN(year)) return undefined;
  return eras.find(e => {
    const start = e.startYear ?? -9999;
    const end = e.endYear ?? 9999;
    return year >= start && year <= end;
  });
}

async function getOrCreateAuthorSlug(
  repo: Repository<Author>,
  name: string,
): Promise<string> {
  const base = makeSlug(name);
  let slug = base;
  let i = 1;
  while (await repo.findOne({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

async function getOrCreatePoemSlug(
  repo: Repository<Poem>,
  title: string,
  authorSlug: string,
): Promise<string> {
  const base = makeSlug(`${title}-${authorSlug}`);
  let slug = base;
  let i = 1;
  while (await repo.findOne({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  log(`Bắt đầu scrape — limit=${LIMIT}, delay=${DELAY_MS}ms, dry-run=${DRY_RUN}`);

  if (!DRY_RUN) {
    // Tắt SQL logging khi scrape để output gọn
    AppDataSource.setOptions({ logging: false });
    await AppDataSource.initialize();
    log('Kết nối DB thành công');
  }

  // Load lookups
  const countryRepo = DRY_RUN ? null : AppDataSource.getRepository(Country);
  const eraRepo = DRY_RUN ? null : AppDataSource.getRepository(Era);
  const categoryRepo = DRY_RUN ? null : AppDataSource.getRepository(PoemCategory);
  const authorRepo = DRY_RUN ? null : AppDataSource.getRepository(Author);
  const poemRepo = DRY_RUN ? null : AppDataSource.getRepository(Poem);
  const versionRepo = DRY_RUN ? null : AppDataSource.getRepository(PoemVersion);

  const countries: Country[] = DRY_RUN ? [] : await countryRepo!.find();
  const eras: Era[] = DRY_RUN ? [] : await eraRepo!.find();
  const categories: PoemCategory[] = DRY_RUN ? [] : await categoryRepo!.find();

  const countryVN = countries.find(c => c.isoCode === 'VN');
  const categorySlugs = new Map(categories.map(c => [c.slug, c]));

  // Cache tác giả đã xử lý trong session này
  const authorCache = new Map<string, number>(); // name → DB id

  let totalPoems = 0;
  let totalAuthors = 0;
  let skipped = 0;

  // ─── Các thể loại cần cào ────────────────────────────────────────────────
  const SCRAPE_CATEGORIES = [
    'Thơ Việt Nam',
    'Lục bát',
    'Thơ Đường luật',
    'Song thất lục bát',
    'Cổ phong',
  ];

  outer: for (const catName of SCRAPE_CATEGORIES) {
    log(`\nĐang cào thể loại: "${catName}"`);
    let continueToken: string | undefined;

    do {
      const { members, continueToken: next } = await wikisourceGetCategoryPages(catName, continueToken);
      continueToken = next;
      await sleep(DELAY_MS);

      for (const member of members) {
        if (totalPoems >= LIMIT) break outer;

        const title = member.title;

        // Bỏ qua subpages (VD: Bích Câu kỳ ngộ/I)
        if (title.includes('/')) { skipped++; continue; }

        log(`  Bài: ${title}`);

        // Lấy wikitext
        const wikitext = await wikisourceGetPageWikitext(title);
        await sleep(DELAY_MS);

        if (!wikitext) { skipped++; continue; }

        // Parse template
        const tmpl = parseTemplate(wikitext);
        const poemTitle = (tmpl['tựa_đề'] || tmpl['tua_de'] || title)
          .replace(/\s*-\s*[一-鿿㐀-䶿]+\s*$/u, '') // bỏ chữ Hán sau dấu "-"
          .trim();

        const authorName = (tmpl['tác_giả'] || tmpl['tac_gia'] || '').trim();
        if (!authorName) { skipped++; log('    Bỏ qua: không có tác giả'); continue; }

        const content = extractPoemContent(wikitext);
        if (!content) { skipped++; log('    Bỏ qua: không có nội dung'); continue; }

        const transcription = extractTranscription(wikitext);
        const sourceYear = tmpl['năm'] || tmpl['nam'] || undefined;

        // Trích thể loại từ wikitext categories
        const wikicats = [...wikitext.matchAll(/\[\[Thể loại:([^\]]+)\]\]/gi)].map(m => m[1].toLowerCase());
        let dbCategory: PoemCategory | undefined;
        for (const [key, slug] of Object.entries(CATEGORY_MAP)) {
          if (wikicats.some(c => c.includes(key))) {
            dbCategory = categorySlugs.get(slug);
            break;
          }
        }

        if (DRY_RUN) {
          log(`    [DRY] Tác giả: ${authorName} | Bài: ${poemTitle}`);
          log(`    [DRY] Nội dung (50 ký tự): ${content.slice(0, 50).replace(/\n/g, '↵')}...`);
          totalPoems++;
          continue;
        }

        // ─── Xử lý tác giả ──────────────────────────────────────────────
        let authorId = authorCache.get(authorName);

        if (!authorId) {
          const existing = await authorRepo!.findOne({
            where: { name: authorName },
          });

          if (existing) {
            authorId = existing.id;
          } else {
            // Lấy thông tin từ Wikipedia
            log(`    Đang lấy thông tin tác giả "${authorName}" từ Wikipedia...`);
            const wikiInfo = await wikipediaGetAuthorInfo(authorName);
            await sleep(DELAY_MS);

            const era = matchEra(eras, wikiInfo?.birth);
            const slug = await getOrCreateAuthorSlug(authorRepo!, authorName);

            const author = authorRepo!.create({
              name: authorName,
              slug,
              birthYear: wikiInfo?.birth,
              deathYear: wikiInfo?.death,
              biography: wikiInfo?.extract,
              countryId: countryVN?.id,
              eraId: era?.id,
              isVerified: false,
            });

            const saved = await authorRepo!.save(author);
            authorId = saved.id;
            totalAuthors++;
            log(`    Tác giả mới: ${authorName} (id=${authorId})`);
          }

          authorCache.set(authorName, authorId!);
        }

        // ─── Kiểm tra bài thơ đã tồn tại chưa ──────────────────────────
        const existingPoem = await poemRepo!.findOne({
          where: { title: poemTitle, authorId },
        });
        if (existingPoem) {
          log(`    Bỏ qua (đã có): ${poemTitle}`);
          skipped++;
          continue;
        }

        // ─── Lưu bài thơ ────────────────────────────────────────────────
        const author = await authorRepo!.findOne({ where: { id: authorId } });
        const poemSlug = await getOrCreatePoemSlug(poemRepo!, poemTitle, author!.slug);

        const poem = poemRepo!.create({
          title: poemTitle,
          slug: poemSlug,
          authorId,
          categoryId: dbCategory?.id,
          sourceInfo: `Wikisource: ${title}${sourceYear ? ` (${sourceYear})` : ''}`,
          status: PoemStatus.PUBLISHED,
          isMemberPoem: false,
        });

        const savedPoem = await poemRepo!.save(poem);

        const version = versionRepo!.create({
          poemId: savedPoem.id,
          versionName: 'Bản chuẩn',
          content,
          transcription,
          isPrimary: true,
        });

        await versionRepo!.save(version);
        totalPoems++;
        log(`    Đã lưu: "${poemTitle}" (id=${savedPoem.id})`);
      }
    } while (continueToken && totalPoems < LIMIT);
  }

  log('\n─────────────────────────────────────');
  log(`Hoàn thành!`);
  log(`  Tác giả mới: ${totalAuthors}`);
  log(`  Bài thơ mới: ${totalPoems}`);
  log(`  Bỏ qua: ${skipped}`);

  if (!DRY_RUN) await AppDataSource.destroy();
}

main().catch(err => {
  console.error('Lỗi:', err.message);
  process.exit(1);
});
