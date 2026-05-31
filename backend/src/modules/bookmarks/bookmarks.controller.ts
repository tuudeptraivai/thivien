import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách bài thơ đã lưu' })
  getMyBookmarks(
    @CurrentUser() user: User,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.bookmarksService.getMyBookmarks(user.id, +page, +limit);
  }

  @Post(':poem_id')
  @ApiOperation({ summary: 'Toggle lưu/bỏ lưu bài thơ' })
  toggle(@Param('poem_id') poemId: string, @CurrentUser() user: User) {
    return this.bookmarksService.toggle(user.id, +poemId);
  }
}
