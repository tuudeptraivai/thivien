import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PoemCategoriesService } from './poem-categories.service';
import { CreatePoemCategoryDto } from './dto/create-poem-category.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';

@ApiTags('Poem Categories')
@Controller('poem-categories')
export class PoemCategoriesController {
  constructor(private readonly service: PoemCategoriesService) {}

  @Public() @Get() findAll() { return this.service.findAll(); }

  @Post() @ApiBearerAuth() @UseGuards(RolesGuard) @Roles(UserRole.ADMIN)
  create(@Body() dto: CreatePoemCategoryDto) { return this.service.create(dto); }

  @Put(':id') @ApiBearerAuth() @UseGuards(RolesGuard) @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: Partial<CreatePoemCategoryDto>) { return this.service.update(+id, dto); }

  @Delete(':id') @ApiBearerAuth() @UseGuards(RolesGuard) @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
