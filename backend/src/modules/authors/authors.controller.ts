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
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { QueryAuthorDto } from './dto/query-author.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User, UserRole } from '../../entities/user.entity';

@ApiTags('Authors')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Danh sách tác giả (phân trang + bộ lọc)' })
  findAll(@Query() query: QueryAuthorDto) {
    return this.authorsService.findAll(query);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Chi tiết tác giả theo slug' })
  findOne(@Param('slug') slug: string) {
    return this.authorsService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR, UserRole.POET)
  @ApiOperation({ summary: 'Thêm tác giả mới' })
  create(@Body() dto: CreateAuthorDto, @CurrentUser() user: User) {
    return this.authorsService.create(dto, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cập nhật thông tin tác giả' })
  update(@Param('id') id: string, @Body() dto: UpdateAuthorDto, @CurrentUser() user: User) {
    return this.authorsService.update(+id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa tác giả (Admin)' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.authorsService.remove(+id, user);
  }
}
