import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { ForumCategory } from '../../entities/forum-category.entity';
import { ForumTopic } from '../../entities/forum-topic.entity';
import { ForumPost } from '../../entities/forum-post.entity';
import { CreateTopicDto, CreateForumPostDto, QueryForumDto } from './dto/create-topic.dto';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class ForumService {
  constructor(
    @InjectRepository(ForumCategory) private categoryRepo: Repository<ForumCategory>,
    @InjectRepository(ForumTopic) private topicRepo: Repository<ForumTopic>,
    @InjectRepository(ForumPost) private postRepo: Repository<ForumPost>,
  ) {}

  async getCategories() {
    const cats = await this.categoryRepo.find({ order: { displayOrder: 'ASC' } });
    return { success: true, data: cats };
  }

  async getTopics(query: QueryForumDto) {
    const { page = 1, limit = 20, category_id } = query;
    const skip = (page - 1) * limit;

    const qb = this.topicRepo.createQueryBuilder('t')
      .leftJoinAndSelect('t.user', 'user')
      .leftJoinAndSelect('t.category', 'category')
      .orderBy('t.isPinned', 'DESC')
      .addOrderBy('t.updatedAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (category_id) qb.where('t.categoryId = :category_id', { category_id });

    const [data, total] = await qb.getManyAndCount();
    return {
      success: true,
      meta: { total_records: total, total_pages: Math.ceil(total / limit), current_page: page, limit },
      data,
    };
  }

  async getTopicBySlug(slug: string) {
    const topic = await this.topicRepo.findOne({
      where: { slug },
      relations: ['user', 'category', 'posts', 'posts.user', 'posts.replies', 'posts.replies.user'],
    });
    if (!topic) throw new NotFoundException('Không tìm thấy chủ đề');
    topic.viewCount++;
    await this.topicRepo.save(topic);
    return { success: true, data: topic };
  }

  async createTopic(dto: CreateTopicDto, user: User) {
    const category = await this.categoryRepo.findOne({ where: { id: dto.category_id } });
    if (!category) throw new NotFoundException('Không tìm thấy chuyên mục');

    const slug = await this.generateTopicSlug(dto.title);
    const topic = await this.topicRepo.save(
      this.topicRepo.create({ categoryId: dto.category_id, userId: user.id, title: dto.title, slug }),
    );

    const firstPost = await this.postRepo.save(
      this.postRepo.create({ topicId: topic.id, userId: user.id, content: dto.content }),
    );

    return { success: true, data: { topic, first_post: firstPost } };
  }

  async createPost(topicId: number, dto: CreateForumPostDto, user: User) {
    const topic = await this.topicRepo.findOne({ where: { id: topicId } });
    if (!topic) throw new NotFoundException('Không tìm thấy chủ đề');
    if (topic.isLocked) throw new ForbiddenException('Chủ đề này đã bị khóa bình luận');

    const post = await this.postRepo.save(
      this.postRepo.create({
        topicId,
        userId: user.id,
        content: dto.content,
        parentId: dto.parent_id ?? null,
      }),
    );

    topic.updatedAt = new Date();
    await this.topicRepo.save(topic);

    return { success: true, data: post };
  }

  async pinTopic(id: number, user: User) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MODERATOR) {
      throw new ForbiddenException('Chỉ Admin/Mod mới có thể ghim chủ đề');
    }
    const topic = await this.topicRepo.findOne({ where: { id } });
    if (!topic) throw new NotFoundException('Không tìm thấy chủ đề');
    topic.isPinned = !topic.isPinned;
    await this.topicRepo.save(topic);
    return { success: true, message: topic.isPinned ? 'Đã ghim chủ đề' : 'Đã bỏ ghim chủ đề' };
  }

  async lockTopic(id: number, user: User) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MODERATOR) {
      throw new ForbiddenException('Chỉ Admin/Mod mới có thể khóa chủ đề');
    }
    const topic = await this.topicRepo.findOne({ where: { id } });
    if (!topic) throw new NotFoundException('Không tìm thấy chủ đề');
    topic.isLocked = !topic.isLocked;
    await this.topicRepo.save(topic);
    return { success: true, message: topic.isLocked ? 'Đã khóa chủ đề' : 'Đã mở khóa chủ đề' };
  }

  private async generateTopicSlug(title: string): Promise<string> {
    let slug = slugify(title, { lower: true, locale: 'vi', strict: true });
    let count = 0;
    while (await this.topicRepo.findOne({ where: { slug: count ? `${slug}-${count}` : slug } })) count++;
    return count ? `${slug}-${count}` : slug;
  }
}
