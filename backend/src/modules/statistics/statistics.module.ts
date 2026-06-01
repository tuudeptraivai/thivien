import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { Poem } from '../../entities/poem.entity';
import { Author } from '../../entities/author.entity';
import { Translation } from '../../entities/translation.entity';
import { User } from '../../entities/user.entity';
import { Country } from '../../entities/country.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poem, Author, Translation, User, Country])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
