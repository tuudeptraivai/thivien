import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnnotationsService } from './annotations.service';
import { CreateAnnotationDto, UpdateAnnotationDto } from './dto/create-annotation.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { User, UserRole } from '../../entities/user.entity';

@ApiTags('Annotations & Dictionary')
@Controller('annotations')
export class AnnotationsController {
  constructor(private readonly annotationsService: AnnotationsService) {}

  @Public()
  @Get('lookup')
  @ApiOperation({ summary: 'Tra cứu từ điển Hán Việt / điển tích' })
  lookup(@Query('keyword') keyword: string) {
    return this.annotationsService.lookup(keyword);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Danh sách chú giải (phân trang, Admin/Mod)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'type', required: false })
  findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '20',
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.annotationsService.findAll({
      page: +page,
      limit: +limit,
      search,
      type,
    });
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Thêm từ khóa chú giải mới (Admin/Mod)' })
  create(@Body() dto: CreateAnnotationDto, @CurrentUser() user: User) {
    return this.annotationsService.create(dto, user);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Sửa chú giải (Admin/Mod)' })
  update(@Param('id') id: string, @Body() dto: UpdateAnnotationDto) {
    return this.annotationsService.update(+id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Xóa chú giải (Admin/Mod)' })
  remove(@Param('id') id: string) {
    return this.annotationsService.remove(+id);
  }
}
