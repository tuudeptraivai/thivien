import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../../entities/author.entity';
import { Poem } from '../../entities/poem.entity';
import { PoemVersion } from '../../entities/poem-version.entity';
import { Translation } from '../../entities/translation.entity';
import { Country } from '../../entities/country.entity';
import { Era } from '../../entities/era.entity';
import { PoemCategory } from '../../entities/poem-category.entity';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';
import { ScraperCronService } from './scraper.cron.service';
import { ScraperMapper } from './scraper.mapper';
import { ThivienCrawler } from './thivien.crawler';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Author, Poem, PoemVersion, Translation, Country, Era, PoemCategory]),
  ],
  controllers: [ScraperController],
  providers: [ScraperService, ScraperCronService, ScraperMapper, ThivienCrawler],
  exports: [ScraperService],
})
export class ScraperModule {}
