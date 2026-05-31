import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Country } from '../../entities/country.entity';
import { Era } from '../../entities/era.entity';
import { PoemCategory } from '../../entities/poem-category.entity';

/**
 * Resolves human-readable taxonomy strings scraped from thivien.net into
 * existing FK ids. Missing taxonomy entries are created on the fly so the
 * scraper never blocks waiting for an admin to seed them.
 */
@Injectable()
export class ScraperMapper {
  constructor(
    @InjectRepository(Country) private readonly countryRepo: Repository<Country>,
    @InjectRepository(Era) private readonly eraRepo: Repository<Era>,
    @InjectRepository(PoemCategory) private readonly categoryRepo: Repository<PoemCategory>,
  ) {}

  toSlug(text: string): string {
    return slugify(text, { lower: true, locale: 'vi', strict: true });
  }

  async resolveCountryId(name?: string): Promise<number | undefined> {
    if (!name) return undefined;
    const existing = await this.countryRepo.findOne({ where: { name } });
    if (existing) return existing.id;
    const created = await this.countryRepo.save(this.countryRepo.create({ name }));
    return created.id;
  }

  async resolveEraId(name?: string): Promise<number | undefined> {
    if (!name) return undefined;
    const existing = await this.eraRepo.findOne({ where: { name } });
    if (existing) return existing.id;
    const created = await this.eraRepo.save(this.eraRepo.create({ name }));
    return created.id;
  }

  async resolveCategoryId(name?: string): Promise<number | undefined> {
    if (!name) return undefined;
    const existing = await this.categoryRepo.findOne({ where: { name } });
    if (existing) return existing.id;
    const slug = this.toSlug(name);
    const created = await this.categoryRepo.save(this.categoryRepo.create({ name, slug }));
    return created.id;
  }
}
