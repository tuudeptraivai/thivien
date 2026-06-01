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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PoemsService } from './poems.service';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { QueryPoemDto } from './dto/query-poem.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('Poems')
@Controller('poems')
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Danh sách bài thơ (phân trang + lọc)' })
  findAll(@Query() query: QueryPoemDto) {
    return this.poemsService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Chi tiết bài thơ (tăng view)' })
  findOne(@Param('slug') slug: string) {
    return this.poemsService.findBySlug(slug);
  }

  @Get(':id/liked')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kiểm tra đã yêu thích bài thơ chưa' })
  checkLiked(@Param('id') id: string, @CurrentUser() user: User) {
    return this.poemsService.checkLiked(+id, user.id);
  }

  @Post(':id/like')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle yêu thích / bỏ yêu thích bài thơ' })
  toggleLike(@Param('id') id: string, @CurrentUser() user: User) {
    return this.poemsService.toggleLike(+id, user.id);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Đăng bài thơ mới' })
  create(@Body() dto: CreatePoemDto, @CurrentUser() user: User) {
    return this.poemsService.create(dto, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Chỉnh sửa bài thơ' })
  update(@Param('id') id: string, @Body() dto: UpdatePoemDto, @CurrentUser() user: User) {
    return this.poemsService.update(+id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Xóa bài thơ' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.poemsService.remove(+id, user);
  }
}
