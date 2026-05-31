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
