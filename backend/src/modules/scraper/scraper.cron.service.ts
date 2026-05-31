import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { ScraperService } from './scraper.service';

/**
 * Cron triggers for the scraper. Each handler short-circuits when
 * SCRAPER_ENABLED is set to anything other than "true" so the schedule can
 * be paused without redeploying.
 */
@Injectable()
export class ScraperCronService {
  private readonly logger = new Logger(ScraperCronService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly scraper: ScraperService,
  ) {}

  @Cron('0 2 * * *', { name: 'scrape-authors', timeZone: 'Asia/Ho_Chi_Minh' })
  async scrapeAuthors(): Promise<void> {
    if (!this.isEnabled()) return;
    this.logger.log('⏰ Cron tác giả (02:00)');
    await this.scraper.run('authors');
  }

  @Cron('0 3 * * *', { name: 'scrape-poems', timeZone: 'Asia/Ho_Chi_Minh' })
  async scrapePoems(): Promise<void> {
    if (!this.isEnabled()) return;
    this.logger.log('⏰ Cron bài thơ (03:00)');
    await this.scraper.run('poems');
  }

  @Cron('0 4 * * *', { name: 'scrape-translations', timeZone: 'Asia/Ho_Chi_Minh' })
  async scrapeTranslations(): Promise<void> {
    if (!this.isEnabled()) return;
    this.logger.log('⏰ Cron bản dịch (04:00)');
    await this.scraper.run('translations');
  }

  private isEnabled(): boolean {
    const flag = this.config.get<string>('SCRAPER_ENABLED', 'true');
    const enabled = String(flag).toLowerCase() === 'true';
    if (!enabled) {
      this.logger.debug('Bỏ qua: SCRAPER_ENABLED=false');
    }
    return enabled;
  }
}

