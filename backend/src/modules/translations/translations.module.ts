import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TranslationsService } from './translations.service';
import { TranslationsController } from './translations.controller';
import { Translation } from '../../entities/translation.entity';
import { PoemVersion } from '../../entities/poem-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Translation, PoemVersion])],
  providers: [TranslationsService],
  controllers: [TranslationsController],
})
export class TranslationsModule {}
