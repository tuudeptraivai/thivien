import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoemsService } from './poems.service';
import { PoemsController } from './poems.controller';
import { Poem } from '../../entities/poem.entity';
import { PoemVersion } from '../../entities/poem-version.entity';
import { PoemLike } from '../../entities/poem-like.entity';
import { Author } from '../../entities/author.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poem, PoemVersion, PoemLike, Author])],
  providers: [PoemsService],
  controllers: [PoemsController],
  exports: [PoemsService],
})
export class PoemsModule {}
