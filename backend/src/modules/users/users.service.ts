import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../entities/user.entity';
import { QueryUserDto } from './dto/query-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 20, search, role } = query;
    const skip = (page - 1) * limit;

    const qb = this.userRepo.createQueryBuilder('u');

    if (search) {
      qb.andWhere(
        new Brackets((w) => {
          w.where('u.username LIKE :s', { s: `%${search}%` })
            .orWhere('u.email LIKE :s', { s: `%${search}%` })
            .orWhere('u.displayName LIKE :s', { s: `%${search}%` });
        }),
      );
    }
    if (role) qb.andWhere('u.role = :role', { role });

    qb.orderBy('u.createdAt', 'DESC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: data.map((u) => this.format(u)),
    };
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    return { success: true, data: this.format(user) };
  }

  async create(dto: CreateUserDto) {
    await this.ensureUnique(dto.username, dto.email);

    const user = this.userRepo.create({
      username: dto.username,
      email: dto.email,
      passwordHash: await bcrypt.hash(dto.password, 12),
      displayName: dto.display_name,
      role: (dto.role as UserRole) ?? UserRole.MEMBER,
      avatarUrl: dto.avatar_url,
      isActive: dto.is_active ?? true,
    });
    const saved = await this.userRepo.save(user);
    return {
      success: true,
      data: this.format(saved),
      message: 'Tạo người dùng thành công',
    };
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    if (
      (dto.username && dto.username !== user.username) ||
      (dto.email && dto.email !== user.email)
    ) {
      await this.ensureUnique(
        dto.username ?? user.username,
        dto.email ?? user.email,
        id,
      );
    }

    if (dto.username !== undefined) user.username = dto.username;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.display_name !== undefined) user.displayName = dto.display_name;
    if (dto.role !== undefined) user.role = dto.role as UserRole;
    if (dto.avatar_url !== undefined) user.avatarUrl = dto.avatar_url;
    if (dto.is_active !== undefined) user.isActive = dto.is_active;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 12);

    const saved = await this.userRepo.save(user);
    return { success: true, data: this.format(saved) };
  }

  async remove(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');
    await this.userRepo.remove(user);
    return { success: true, message: 'Xóa người dùng thành công' };
  }

  private async ensureUnique(username: string, email: string, excludeId?: number) {
    const existing = await this.userRepo
      .createQueryBuilder('u')
      .where('(u.username = :username OR u.email = :email)', { username, email })
      .andWhere(excludeId ? 'u.id != :id' : '1=1', { id: excludeId })
      .getOne();
    if (existing) {
      throw new ConflictException('Username hoặc email đã tồn tại');
    }
  }

  private format(u: User) {
    return {
      id: u.id,
      username: u.username,
      email: u.email,
      display_name: u.displayName,
      avatar_url: u.avatarUrl ?? null,
      role: u.role,
      is_active: u.isActive,
      created_at: u.createdAt,
      updated_at: u.updatedAt,
    };
  }
}
