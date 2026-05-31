import { HttpException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import * as cheerio from 'cheerio';

export interface ParsedAuthor {
  name: string;
  realName?: string;
  birthYear?: string;
  deathYear?: string;
  countryName?: string;
  eraName?: string;
  biography?: string;
  portraitUrl?: string;
  sourceUrl: string;
}

export interface ParsedPoemVersion {
  versionName?: string;
  content: string;
  transcription?: string;
  explanation?: string;
}

export interface ParsedTranslation {
  translatorName?: string;
  translationTitle?: string;
  translationType?: string;
  content: string;
}

export interface ParsedPoem {
  title: string;
  authorName?: string;
  authorSourceUrl?: string;
  categoryName?: string;
  eraName?: string;
  sourceInfo?: string;
  versions: ParsedPoemVersion[];
  translations: ParsedTranslation[];
  sourceUrl: string;
}

/**
 * Lightweight wrapper around axios + cheerio with retry, rate-limit and a
 * browser-like User-Agent. Selector logic is centralised here so the rest of
 * the scraper module only deals with strongly-typed shapes.
 *
 * Note: selectors target the public HTML structure of thivien.net and may
 * need tuning if the site layout changes.
 */
@Injectable()
export class ThivienCrawler {
  private readonly logger = new Logger(ThivienCrawler.name);
  private readonly http: AxiosInstance;
  private readonly baseUrl: string;
  private readonly delayMs: number;
  private readonly maxRetries = 3;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>('SCRAPER_BASE_URL', 'https://www.thivien.net');
    this.delayMs = parseInt(this.config.get<string>('SCRAPER_DELAY_MS', '1500'), 10);

    this.http = axios.create({
      baseURL: this.baseUrl,
      timeout: 20_000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
        'Accept-Language': 'vi,en;q=0.8',
      },
    });
  }

  async fetch(path: string, opts: AxiosRequestConfig = {}): Promise<string> {
    let attempt = 0;
    let lastErr: unknown;

    while (attempt < this.maxRetries) {
      try {
        await this.sleep(this.delayMs);
        const res = await this.http.get<string>(path, { responseType: 'text', ...opts });
        return res.data;
      } catch (err: any) {
        attempt++;
        const status = err?.response?.status;
        const isRetryable = !status || status >= 500 || err.code === 'ECONNABORTED';

        if (!isRetryable || attempt >= this.maxRetries) {
          this.logger.warn(`GET ${path} thất bại sau ${attempt} lần: ${err.message}`);
          lastErr = err;
          break;
        }

        const backoff = this.delayMs * Math.pow(2, attempt);
        this.logger.debug(`GET ${path} lỗi ${status ?? err.code}, retry sau ${backoff}ms`);
        await this.sleep(backoff);
      }
    }

    throw new HttpException(
      `Không thể tải ${path}: ${(lastErr as Error)?.message ?? 'unknown'}`,
      502,
    );
  }

  /**
   * Returns absolute URLs of author detail pages discovered from the listing.
   * Adjust the selector if the listing markup changes.
   */
  async listAuthorUrls(): Promise<string[]> {
    const html = await this.fetch('/Author/AuthorList.aspx');
    const $ = cheerio.load(html);
    const urls = new Set<string>();

    $('a[href*="Author/Author.aspx"], a[href*="/sites/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) urls.add(this.absolutize(href));
    });

    return [...urls];
  }

  async listPoemUrls(): Promise<string[]> {
    const html = await this.fetch('/Poem/PoemList.aspx');
    const $ = cheerio.load(html);
    const urls = new Set<string>();

    $('a[href*="Poem/poem.aspx"], a[href*="/poem/"]').each((_, el) => {
      const href = $(el).attr('href');
      if (href) urls.add(this.absolutize(href));
    });

    return [...urls];
  }

  async parseAuthor(url: string): Promise<ParsedAuthor | null> {
    const html = await this.fetch(this.relativize(url));
    const $ = cheerio.load(html);

    const name = this.text($('h1').first());
    if (!name) {
      this.logger.warn(`Không tìm thấy tên tác giả tại ${url}`);
      return null;
    }

    const portraitUrl = $('img.author-portrait, .author-image img').first().attr('src');
    const lifeText = this.text($('.author-life, .author-meta').first());
    const { birthYear, deathYear } = this.extractYears(lifeText);

    return {
      name,
      birthYear,
      deathYear,
      countryName: this.text($('.author-country, [data-field="country"]').first()) || undefined,
      eraName: this.text($('.author-era, [data-field="era"]').first()) || undefined,
      biography: this.text($('.author-bio, .biography, #ctl00_MainContent_lbAuthorBio').first()) || undefined,
      portraitUrl: portraitUrl ? this.absolutize(portraitUrl) : undefined,
      sourceUrl: url,
    };
  }

  async parsePoem(url: string): Promise<ParsedPoem | null> {
    const html = await this.fetch(this.relativize(url));
    const $ = cheerio.load(html);

    const title = this.text($('h1, .poem-title').first());
    if (!title) {
      this.logger.warn(`Không tìm thấy tiêu đề bài thơ tại ${url}`);
      return null;
    }

    const authorAnchor = $('a[href*="Author/Author.aspx"], a[href*="/sites/"]').first();
    const authorName = this.text(authorAnchor) || undefined;
    const authorHref = authorAnchor.attr('href');
    const authorSourceUrl = authorHref ? this.absolutize(authorHref) : undefined;

    const versions: ParsedPoemVersion[] = [];
    $('.poem-content, .poem-original').each((idx, el) => {
      const $el = $(el);
      versions.push({
        versionName: this.text($el.find('.version-name').first()) || (idx === 0 ? 'Bản chuẩn' : `Bản ${idx + 1}`),
        content: this.text($el.find('.content, p').first()) || this.text($el),
        transcription: this.text($el.find('.transcription, .phien-am').first()) || undefined,
        explanation: this.text($el.find('.explanation, .dich-nghia').first()) || undefined,
      });
    });

    if (versions.length === 0) {
      const fallback = this.text($('.poem-body, .poem-text').first());
      if (fallback) versions.push({ versionName: 'Bản chuẩn', content: fallback });
    }

    const translations: ParsedTranslation[] = [];
    $('.translation, .translation-item').each((_, el) => {
      const $el = $(el);
      const tname = this.text($el.find('.translator-name, .translator').first()) || undefined;
      const ttitle = this.text($el.find('.translation-title').first()) || undefined;
      const ttype = this.text($el.find('.translation-type').first()) || undefined;
      const tcontent = this.text($el.find('.translation-content, .content, p').first()) || this.text($el);
      if (tcontent) {
        translations.push({
          translatorName: tname,
          translationTitle: ttitle,
          translationType: ttype,
          content: tcontent,
        });
      }
    });

    return {
      title,
      authorName,
      authorSourceUrl,
      categoryName: this.text($('.poem-category, [data-field="category"]').first()) || undefined,
      eraName: this.text($('.poem-era, [data-field="era"]').first()) || undefined,
      sourceInfo: this.text($('.poem-source, [data-field="source"]').first()) || undefined,
      versions,
      translations,
      sourceUrl: url,
    };
  }

  private text($el: any): string {
    return ($el?.text?.() || '').replace(/\s+/g, ' ').trim();
  }

  private extractYears(text: string): { birthYear?: string; deathYear?: string } {
    if (!text) return {};
    const match = text.match(/(\d{3,4})\s*[-–—]\s*(\d{3,4})?/);
    if (!match) return {};
    return { birthYear: match[1], deathYear: match[2] };
  }

  private absolutize(href: string): string {
    if (/^https?:\/\//i.test(href)) return href;
    if (href.startsWith('//')) return `https:${href}`;
    return `${this.baseUrl.replace(/\/$/, '')}${href.startsWith('/') ? '' : '/'}${href}`;
  }

  private relativize(url: string): string {
    if (url.startsWith(this.baseUrl)) return url.slice(this.baseUrl.length) || '/';
    return url;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
