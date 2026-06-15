import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ForumService } from './forum.service';
import { CreateTopicDto, CreateForumPostDto, QueryForumDto } from './dto/create-topic.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User, UserRole } from '../../entities/user.entity';

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

  @Get('posts')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Danh sách bài viết diễn đàn (Admin/Mod)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'topic_id', required: false })
  @ApiQuery({ name: 'search', required: false })
  getPosts(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('topic_id') topicId?: string,
    @Query('search') search?: string,
  ) {
    return this.forumService.getPosts({
      page: +page,
      limit: +limit,
      topic_id: topicId ? +topicId : undefined,
      search,
    });
  }

  @Post('topics')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Tạo chủ đề diễn đàn mới' })
  createTopic(@Body() dto: CreateTopicDto, @CurrentUser() user: User) {
    return this.forumService.createTopic(dto, user);
  }

  @Put('topics/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Cập nhật chủ đề (Admin/Mod)' })
  updateTopic(
    @Param('id') id: string,
    @Body()
    dto: {
      title?: string;
      category_id?: number;
      is_pinned?: boolean;
      is_locked?: boolean;
    },
  ) {
    return this.forumService.updateTopic(+id, dto);
  }

  @Delete('topics/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Xóa chủ đề (Admin/Mod)' })
  removeTopic(@Param('id') id: string) {
    return this.forumService.removeTopic(+id);
  }

  @Put('posts/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Cập nhật bài viết (Admin/Mod)' })
  updatePost(@Param('id') id: string, @Body() dto: { content?: string }) {
    return this.forumService.updatePost(+id, dto);
  }

  @Delete('posts/:id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Xóa bài viết (Admin/Mod)' })
  removePost(@Param('id') id: string) {
    return this.forumService.removePost(+id);
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
