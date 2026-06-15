import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Permission, SystemModule } from '../../entities/permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { QueryPermissionDto } from './dto/query-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,
  ) {}

  async findAll(query: QueryPermissionDto) {
    const { page = 1, limit = 10, search, system_module, module } = query;
    const skip = (page - 1) * limit;

    const qb = this.repo.createQueryBuilder('p');

    if (search) {
      qb.andWhere(
        new Brackets((w) => {
          w.where('p.name LIKE :s', { s: `%${search}%` })
            .orWhere('p.apiPath LIKE :s', { s: `%${search}%` })
            .orWhere('p.module LIKE :s', { s: `%${search}%` });
        }),
      );
    }
    if (system_module) qb.andWhere('p.systemModule = :sm', { sm: system_module });
    if (module) qb.andWhere('p.module = :m', { m: module });

    qb.orderBy('p.systemModule', 'ASC')
      .addOrderBy('p.module', 'ASC')
      .addOrderBy('p.id', 'ASC')
      .skip(skip)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: data.map((p) => this.format(p)),
    };
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Không tìm thấy quyền');
    return { success: true, data: this.format(p) };
  }

  async create(dto: CreatePermissionDto) {
    await this.ensureUnique(dto.method, dto.api_path);
    const p = this.repo.create({
      name: dto.name,
      apiPath: dto.api_path,
      method: dto.method.toUpperCase(),
      module: dto.module,
      systemModule: dto.system_module ?? SystemModule.BUSINESS,
    });
    const saved = await this.repo.save(p);
    return {
      success: true,
      data: this.format(saved),
      message: 'Tạo quyền thành công',
    };
  }

  async update(id: number, dto: UpdatePermissionDto) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Không tìm thấy quyền');

    const nextMethod = (dto.method ?? p.method).toUpperCase();
    const nextPath = dto.api_path ?? p.apiPath;
    if (nextMethod !== p.method || nextPath !== p.apiPath) {
      await this.ensureUnique(nextMethod, nextPath, id);
    }

    if (dto.name !== undefined) p.name = dto.name;
    if (dto.api_path !== undefined) p.apiPath = dto.api_path;
    if (dto.method !== undefined) p.method = dto.method.toUpperCase();
    if (dto.module !== undefined) p.module = dto.module;
    if (dto.system_module !== undefined) p.systemModule = dto.system_module;

    const saved = await this.repo.save(p);
    return { success: true, data: this.format(saved) };
  }

  async remove(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Không tìm thấy quyền');
    await this.repo.remove(p);
    return { success: true, message: 'Xóa quyền thành công' };
  }

  private async ensureUnique(
    method: string,
    apiPath: string,
    excludeId?: number,
  ) {
    const existing = await this.repo
      .createQueryBuilder('p')
      .where('p.method = :method AND p.apiPath = :apiPath', {
        method: method.toUpperCase(),
        apiPath,
      })
      .andWhere(excludeId ? 'p.id != :id' : '1=1', { id: excludeId })
      .getOne();
    if (existing) {
      throw new ConflictException(
        `Quyền ${method.toUpperCase()} ${apiPath} đã tồn tại`,
      );
    }
  }

  private format(p: Permission) {
    return {
      id: p.id,
      name: p.name,
      api_path: p.apiPath,
      method: p.method,
      module: p.module,
      system_module: p.systemModule,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    };
  }
}
