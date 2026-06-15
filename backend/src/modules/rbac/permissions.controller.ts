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
import { UserRole } from '../../entities/user.entity';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';

@ApiTags('RBAC - Permissions')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('rbac/permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách quyền hạn (admin)' })
  findAll(@Query() query: QueryPermissionDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Chi tiết quyền hạn (admin)' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Tạo quyền hạn mới (admin)' })
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật quyền hạn (admin)' })
  update(@Param('id') id: string, @Body() dto: UpdatePermissionDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa quyền hạn (admin)' })
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
