import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from '../../entities/author.entity';
import { Poem, PoemStatus } from '../../entities/poem.entity';
import { PoemVersion } from '../../entities/poem-version.entity';
import { Translation } from '../../entities/translation.entity';
import { ParsedAuthor, ParsedPoem, ThivienCrawler } from './thivien.crawler';
import { ScraperMapper } from './scraper.mapper';

export type ScraperTarget = 'authors' | 'poems' | 'translations' | 'all';

export interface ScraperRunResult {
  target: ScraperTarget;
  processed: number;
  upserted: number;
  skipped: number;
  errors: number;
  durationMs: number;
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);

  constructor(
    @InjectRepository(Author) private readonly authorRepo: Repository<Author>,
    @InjectRepository(Poem) private readonly poemRepo: Repository<Poem>,
    @InjectRepository(PoemVersion) private readonly versionRepo: Repository<PoemVersion>,
    @InjectRepository(Translation) private readonly translationRepo: Repository<Translation>,
    private readonly crawler: ThivienCrawler,
    private readonly mapper: ScraperMapper,
  ) {}

  async run(target: ScraperTarget): Promise<ScraperRunResult[]> {
    const targets: Exclude<ScraperTarget, 'all'>[] =
      target === 'all' ? ['authors', 'poems', 'translations'] : [target];

    const results: ScraperRunResult[] = [];
    for (const t of targets) {
      results.push(await this.runSingle(t));
    }
    return results;
  }

  async runSingle(target: Exclude<ScraperTarget, 'all'>): Promise<ScraperRunResult> {
    const startedAt = Date.now();
    this.logger.log(`▶️  Bắt đầu cào target=${target}`);

    let processed = 0;
    let upserted = 0;
    let skipped = 0;
    let errors = 0;

    try {
      if (target === 'authors') {
        const urls = await this.crawler.listAuthorUrls();
        this.logger.log(`Tìm thấy ${urls.length} tác giả từ listing`);
        for (const url of urls) {
          processed++;
          try {
            const parsed = await this.crawler.parseAuthor(url);
            if (!parsed) {
              skipped++;
              continue;
            }
            await this.upsertAuthor(parsed);
            upserted++;
          } catch (err: any) {
            errors++;
            this.logger.warn(`Bỏ qua ${url}: ${err.message}`);
          }
        }
      } else {
        const urls = await this.crawler.listPoemUrls();
        this.logger.log(`Tìm thấy ${urls.length} bài thơ từ listing`);
        for (const url of urls) {
          processed++;
          try {
            const parsed = await this.crawler.parsePoem(url);
            if (!parsed) {
              skipped++;
              continue;
            }
            const poem = await this.upsertPoem(parsed);
            if (!poem) {
              skipped++;
              continue;
            }
            if (target === 'translations') {
              await this.upsertTranslations(poem.id, parsed);
            }
            upserted++;
          } catch (err: any) {
            errors++;
            this.logger.warn(`Bỏ qua ${url}: ${err.message}`);
          }
        }
      }
    } catch (err: any) {
      errors++;
      this.logger.error(`Cào target=${target} thất bại: ${err.message}`);
    }

    const result: ScraperRunResult = {
      target,
      processed,
      upserted,
      skipped,
      errors,
      durationMs: Date.now() - startedAt,
    };
    this.logger.log(`✅ Kết thúc cào target=${target}: ${JSON.stringify(result)}`);
    return result;
  }

  private async upsertAuthor(parsed: ParsedAuthor): Promise<Author> {
    const slug = this.mapper.toSlug(parsed.name);
    const [countryId, eraId] = await Promise.all([
      this.mapper.resolveCountryId(parsed.countryName),
      this.mapper.resolveEraId(parsed.eraName),
    ]);

    const existing = await this.authorRepo.findOne({
      where: [{ scrapedFromUrl: parsed.sourceUrl }, { slug }],
    });

    const payload: Partial<Author> = {
      name: parsed.name,
      slug: existing?.slug ?? slug,
      realName: parsed.realName,
      birthYear: parsed.birthYear,
      deathYear: parsed.deathYear,
      countryId,
      eraId,
      biography: parsed.biography,
      portraitUrl: parsed.portraitUrl,
      isVerified: false,
      scrapedFromUrl: parsed.sourceUrl,
    };

    if (existing) {
      Object.assign(existing, payload);
      return this.authorRepo.save(existing);
    }
    return this.authorRepo.save(this.authorRepo.create(payload));
  }

  private async upsertPoem(parsed: ParsedPoem): Promise<Poem | null> {
    if (!parsed.authorName) {
      this.logger.warn(`Bỏ qua bài thơ ${parsed.sourceUrl}: thiếu tác giả`);
      return null;
    }

    const author = await this.ensureAuthorPlaceholder(parsed.authorName, parsed.authorSourceUrl);
    const slug = this.mapper.toSlug(parsed.title);

    const [categoryId, eraId] = await Promise.all([
      this.mapper.resolveCategoryId(parsed.categoryName),
      this.mapper.resolveEraId(parsed.eraName),
    ]);

    const existing = await this.poemRepo.findOne({
      where: [{ scrapedFromUrl: parsed.sourceUrl }, { slug }],
    });

    const payload: Partial<Poem> = {
      title: parsed.title,
      slug: existing?.slug ?? slug,
      authorId: author.id,
      categoryId,
      eraId,
      sourceInfo: parsed.sourceInfo,
      status: PoemStatus.PENDING,
      scrapedFromUrl: parsed.sourceUrl,
    };

    const poem = existing
      ? await this.poemRepo.save(Object.assign(existing, payload))
      : await this.poemRepo.save(this.poemRepo.create(payload));

    await this.upsertVersions(poem.id, parsed);
    return poem;
  }

  private async upsertVersions(poemId: number, parsed: ParsedPoem): Promise<void> {
    if (parsed.versions.length === 0) return;

    const existingVersions = await this.versionRepo.find({ where: { poemId } });
    for (let i = 0; i < parsed.versions.length; i++) {
      const v = parsed.versions[i];
      const match = existingVersions.find((e) => e.versionName === v.versionName);
      const payload: Partial<PoemVersion> = {
        poemId,
        versionName: v.versionName ?? (i === 0 ? 'Bản chuẩn' : `Bản ${i + 1}`),
        content: v.content,
        transcription: v.transcription,
        explanation: v.explanation,
        isPrimary: i === 0,
      };
      if (match) {
        Object.assign(match, payload);
        await this.versionRepo.save(match);
      } else {
        await this.versionRepo.save(this.versionRepo.create(payload));
      }
    }
  }

  private async upsertTranslations(poemId: number, parsed: ParsedPoem): Promise<void> {
    if (parsed.translations.length === 0) return;

    const primaryVersion =
      (await this.versionRepo.findOne({ where: { poemId, isPrimary: true } })) ??
      (await this.versionRepo.findOne({ where: { poemId } }));
    if (!primaryVersion) return;

    const existingList = await this.translationRepo.find({
      where: { poemVersionId: primaryVersion.id },
    });

    for (const t of parsed.translations) {
      let translatorId: number | undefined;
      if (t.translatorName) {
        const translator = await this.ensureAuthorPlaceholder(t.translatorName);
        translatorId = translator.id;
      }

      const existing = existingList.find(
        (e) =>
          (e.translatorId ?? null) === (translatorId ?? null) &&
          (e.translationTitle ?? null) === (t.translationTitle ?? null),
      );

      const payload: Partial<Translation> = {
        poemVersionId: primaryVersion.id,
        translatorId,
        translationTitle: t.translationTitle,
        translationType: t.translationType ?? 'Thơ',
        content: t.content,
      };

      if (existing) {
        Object.assign(existing, payload);
        await this.translationRepo.save(existing);
      } else {
        await this.translationRepo.save(this.translationRepo.create(payload));
      }
    }
  }

  private async ensureAuthorPlaceholder(name: string, sourceUrl?: string): Promise<Author> {
    if (sourceUrl) {
      const bySource = await this.authorRepo.findOne({ where: { scrapedFromUrl: sourceUrl } });
      if (bySource) return bySource;
    }
    const slug = this.mapper.toSlug(name);
    const bySlug = await this.authorRepo.findOne({ where: { slug } });
    if (bySlug) return bySlug;

    return this.authorRepo.save(
      this.authorRepo.create({
        name,
        slug,
        isVerified: false,
        scrapedFromUrl: sourceUrl,
      }),
    );
  }
}
