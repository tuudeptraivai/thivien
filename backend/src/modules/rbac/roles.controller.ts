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
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User, UserRole } from '../../entities/user.entity';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';

@ApiTags('RBAC - Roles')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('rbac/roles')
export class RolesController {
  constructor(private readonly service: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách vai trò (admin)' })
  findAll(@Query() query: QueryRoleDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết vai trò + quyền (admin)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo vai trò mới (admin)' })
  create(@Body() dto: CreateRoleDto, @CurrentUser() user: User) {
    return this.service.create(dto, user?.displayName ?? user?.username);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật vai trò (admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: User,
  ) {
    return this.service.update(+id, dto, user?.displayName ?? user?.username);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa vai trò (admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
