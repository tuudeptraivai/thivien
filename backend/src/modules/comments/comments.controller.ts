import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Public } from '../../common/decorators/public.decorator';
import { OptionalAuth } from '../../common/decorators/optional-auth.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

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

  @OptionalAuth()
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng bình luận (hỗ trợ khách vãng lai)' })
  create(@Body() dto: CreateCommentDto, @CurrentUser() user?: User) {
    return this.commentsService.create(dto, user);
  }
}
