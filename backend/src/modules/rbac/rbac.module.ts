import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from '../../entities/permission.entity';
import { Role } from '../../entities/role.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { RbacSyncService } from './rbac-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, Role]), DiscoveryModule],
  providers: [PermissionsService, RolesService, RbacSyncService],
  controllers: [PermissionsController, RolesController],
})
export class RbacModule {}
