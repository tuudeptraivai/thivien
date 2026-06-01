import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poem } from '../../entities/poem.entity';
import { Author } from '../../entities/author.entity';
import { Translation } from '../../entities/translation.entity';
import { User } from '../../entities/user.entity';
import { Country } from '../../entities/country.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Poem) private poemRepo: Repository<Poem>,
    @InjectRepository(Author) private authorRepo: Repository<Author>,
    @InjectRepository(Translation) private translationRepo: Repository<Translation>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Country) private countryRepo: Repository<Country>,
  ) {}

  async getSummary() {
    const [total_poems, total_authors, total_members, total_translations, total_countries] =
      await Promise.all([
        this.poemRepo.count(),
        this.authorRepo.count(),
        this.userRepo.count(),
        this.translationRepo.count(),
        this.countryRepo.count(),
      ]);

    return { total_poems, total_authors, total_members, total_translations, total_countries };
  }
}
