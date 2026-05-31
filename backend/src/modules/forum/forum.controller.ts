import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { CreateTopicDto, CreateForumPostDto, QueryForumDto } from './dto/create-topic.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('Forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Danh sách chuyên mục diễn đàn' })
  getCategories() {
    return this.forumService.getCategories();
  }

  @Public()
  @Get('topics')
  @ApiOperation({ summary: 'Danh sách chủ đề diễn đàn' })
  getTopics(@Query() query: QueryForumDto) {
    return this.forumService.getTopics(query);
  }

  @Public()
  @Get('topics/:slug')
  @ApiOperation({ summary: 'Chi tiết chủ đề diễn đàn' })
  getTopicBySlug(@Param('slug') slug: string) {
    return this.forumService.getTopicBySlug(slug);
  }

  @Post('topics')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo chủ đề diễn đàn mới' })
  createTopic(@Body() dto: CreateTopicDto, @CurrentUser() user: User) {
    return this.forumService.createTopic(dto, user);
  }

  @Post('topics/:id/posts')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng bài viết trong chủ đề' })
  createPost(@Param('id') id: string, @Body() dto: CreateForumPostDto, @CurrentUser() user: User) {
    return this.forumService.createPost(+id, dto, user);
  }

  @Put('topics/:id/pin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ghim/bỏ ghim chủ đề (Admin/Mod)' })
  pinTopic(@Param('id') id: string, @CurrentUser() user: User) {
    return this.forumService.pinTopic(+id, user);
  }

  @Put('topics/:id/lock')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khóa/mở khóa chủ đề (Admin/Mod)' })
  lockTopic(@Param('id') id: string, @CurrentUser() user: User) {
    return this.forumService.lockTopic(+id, user);
  }
}
