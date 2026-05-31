import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { Bookmark } from '../../entities/bookmark.entity';
import { Poem } from '../../entities/poem.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookmark, Poem])],
  providers: [BookmarksService],
  controllers: [BookmarksController],
})
export class BookmarksModule {}
