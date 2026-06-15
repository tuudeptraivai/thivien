import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private commentRepo: Repository<Comment>) {}

  async findAll(entityType: string, entityId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const rootComments = await this.commentRepo.find({
      where: { entityType, entityId, parentId: null, status: 'approved' },
      relations: ['user', 'replies', 'replies.user'],
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });

    const total = await this.commentRepo.count({
      where: { entityType, entityId, parentId: null, status: 'approved' },
    });

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: rootComments.map((c) => this.formatComment(c)),
    };
  }

  async adminFindAll(params: {
    page?: number;
    limit?: number;
    entity_type?: string;
    status?: string;
    search?: string;
  }) {
    const { page = 1, limit = 20, entity_type, status, search } = params;
    const skip = (page - 1) * limit;

    const qb = this.commentRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.user', 'user');

    if (entity_type) qb.andWhere('c.entityType = :entity_type', { entity_type });
    if (status) qb.andWhere('c.status = :status', { status });
    if (search) qb.andWhere('c.content LIKE :s', { s: `%${search}%` });

    qb.orderBy('c.createdAt', 'DESC').skip(skip).take(limit);

    const [rows, total] = await qb.getManyAndCount();

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: rows.map((c) => ({
        id: c.id,
        entity_type: c.entityType,
        entity_id: c.entityId,
        content: c.content,
        status: c.status,
        parent_id: c.parentId,
        author: c.user
          ? { id: c.user.id, display_name: c.user.displayName }
          : { display_name: c.guestName ?? 'Khách', is_guest: true },
        created_at: c.createdAt,
      })),
    };
  }

  async update(id: number, dto: { content?: string; status?: string }) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Không tìm thấy bình luận');
    if (dto.content !== undefined) comment.content = dto.content;
    if (dto.status !== undefined) comment.status = dto.status;
    const saved = await this.commentRepo.save(comment);
    return { success: true, data: saved };
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Không tìm thấy bình luận');
    await this.commentRepo.remove(comment);
    return { success: true, message: 'Xóa bình luận thành công' };
  }

  async create(dto: CreateCommentDto, user?: User) {
    if (!user && (!dto.guest_name || !dto.guest_email)) {
      throw new BadRequestException('Khách vãng lai phải cung cấp tên và email');
    }

    const comment = this.commentRepo.create({
      entityType: dto.entity_type,
      entityId: dto.entity_id,
      parentId: dto.parent_id ?? null,
      content: dto.content,
      userId: user?.id ?? null,
      guestName: user ? null : dto.guest_name,
      guestEmail: user ? null : dto.guest_email,
      status: 'approved',
    });

    const saved = await this.commentRepo.save(comment);
    return { success: true, data: saved, message: 'Đăng bình luận thành công' };
  }

  private formatComment(c: Comment) {
    return {
      id: c.id,
      content: c.content,
      author: c.user
        ? { id: c.user.id, display_name: c.user.displayName, avatar_url: c.user.avatarUrl }
        : { display_name: c.guestName, is_guest: true },
      created_at: c.createdAt,
      replies: (c.replies ?? []).filter((r) => r.status === 'approved').map((r) => this.formatComment(r)),
    };
  }
}
