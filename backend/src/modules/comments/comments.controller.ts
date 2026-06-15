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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from '../../common/decorators/public.decorator';
import { OptionalAuth } from '../../common/decorators/optional-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User, UserRole } from '../../entities/user.entity';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lấy bình luận theo thực thể (poem/author)' })
  @ApiQuery({ name: 'entity_type', enum: ['poem', 'author', 'forum_topic'] })
  @ApiQuery({ name: 'entity_id', type: Number })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @Query('entity_type') entityType: string,
    @Query('entity_id') entityId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '20',
  ) {
    return this.commentsService.findAll(entityType, +entityId, +page, +limit);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Danh sách toàn bộ bình luận để kiểm duyệt (Admin/Mod)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'entity_type', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  adminFindAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('entity_type') entityType?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.commentsService.adminFindAll({
      page: +page,
      limit: +limit,
      entity_type: entityType,
      status,
      search,
    });
  }

  @OptionalAuth()
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng bình luận (hỗ trợ khách vãng lai)' })
  create(@Body() dto: CreateCommentDto, @CurrentUser() user?: User) {
    return this.commentsService.create(dto, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Cập nhật nội dung / trạng thái bình luận (Admin/Mod)' })
  update(
    @Param('id') id: string,
    @Body() dto: { content?: string; status?: string },
  ) {
    return this.commentsService.update(+id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Xóa bình luận (Admin/Mod)' })
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
