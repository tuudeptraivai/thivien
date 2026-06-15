import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permRepo: Repository<Permission>,
  ) {}

  async findAll(query: QueryRoleDto) {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const qb = this.roleRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.permissions', 'p');

    if (search) {
      qb.andWhere('(r.name LIKE :s OR r.description LIKE :s)', {
        s: `%${search}%`,
      });
    }

    qb.orderBy('r.id', 'ASC');

    const all = await qb.getMany();
    const total = all.length;
    const rows = all.slice(skip, skip + limit);

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: rows.map((r) => this.format(r)),
    };
  }

  async findOne(id: number) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');
    return { success: true, data: this.format(role, true) };
  }

  async create(dto: CreateRoleDto, actor?: string) {
    await this.ensureUniqueName(dto.name);
    const role = this.roleRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      createdBy: actor ?? null,
      updatedBy: actor ?? null,
      permissions: await this.resolvePermissions(dto.permission_ids),
    });
    const saved = await this.roleRepo.save(role);
    return {
      success: true,
      data: this.format(saved, true),
      message: 'Tạo vai trò thành công',
    };
  }

  async update(id: number, dto: UpdateRoleDto, actor?: string) {
    const role = await this.roleRepo.findOne({
      where: { id },
      relations: ['permissions'],
    });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');

    if (dto.name !== undefined && dto.name !== role.name) {
      await this.ensureUniqueName(dto.name, id);
      role.name = dto.name;
    }
    if (dto.description !== undefined) role.description = dto.description ?? null;
    if (dto.permission_ids !== undefined) {
      role.permissions = await this.resolvePermissions(dto.permission_ids);
    }
    role.updatedBy = actor ?? role.updatedBy;

    const saved = await this.roleRepo.save(role);
    return { success: true, data: this.format(saved, true) };
  }

  async remove(id: number) {
    const role = await this.roleRepo.findOne({ where: { id } });
    if (!role) throw new NotFoundException('Không tìm thấy vai trò');
    await this.roleRepo.remove(role);
    return { success: true, message: 'Xóa vai trò thành công' };
  }

  private async resolvePermissions(ids?: number[]): Promise<Permission[]> {
    if (!ids || ids.length === 0) return [];
    const perms = await this.permRepo.find({ where: { id: In(ids) } });
    if (perms.length !== ids.length) {
      throw new NotFoundException('Một số quyền không tồn tại');
    }
    return perms;
  }

  private async ensureUniqueName(name: string, excludeId?: number) {
    const existing = await this.roleRepo
      .createQueryBuilder('r')
      .where('r.name = :name', { name })
      .andWhere(excludeId ? 'r.id != :id' : '1=1', { id: excludeId })
      .getOne();
    if (existing) throw new ConflictException('Tên vai trò đã tồn tại');
  }

  private format(r: Role, withPermissions = false) {
    const perms = r.permissions ?? [];
    const modules = Array.from(new Set(perms.map((p) => p.module)));
    const base = {
      id: r.id,
      name: r.name,
      description: r.description ?? null,
      modules,
      permission_count: perms.length,
      created_by: r.createdBy ?? null,
      updated_by: r.updatedBy ?? null,
      created_at: r.createdAt,
      updated_at: r.updatedAt,
    };
    if (!withPermissions) return base;
    return {
      ...base,
      permission_ids: perms.map((p) => p.id),
      permissions: perms.map((p) => ({
        id: p.id,
        name: p.name,
        api_path: p.apiPath,
        method: p.method,
        module: p.module,
        system_module: p.systemModule,
      })),
    };
  }
}
