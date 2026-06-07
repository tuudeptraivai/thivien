import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from './dictionary.service';

@Module({
  imports: [ConfigModule],
  controllers: [DictionaryController],
  providers: [DictionaryService],
})
export class DictionaryModule {}
