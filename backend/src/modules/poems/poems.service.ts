import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { Poem, PoemStatus } from '../../entities/poem.entity';
import { PoemVersion } from '../../entities/poem-version.entity';
import { PoemLike } from '../../entities/poem-like.entity';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { QueryPoemDto } from './dto/query-poem.dto';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class PoemsService {
  constructor(
    @InjectRepository(Poem) private poemRepo: Repository<Poem>,
    @InjectRepository(PoemVersion) private versionRepo: Repository<PoemVersion>,
    @InjectRepository(PoemLike) private likeRepo: Repository<PoemLike>,
  ) {}

  async findAll(query: QueryPoemDto) {
    const { page = 1, limit = 20, search, author_id, category_id, era_id, is_member_poem, sort = 'newest' } = query;
    const skip = (page - 1) * limit;

    const qb = this.poemRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.author', 'author')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.era', 'era')
      .leftJoinAndSelect('p.versions', 'v', 'v.isPrimary = true')
      .where('p.status = :status', { status: PoemStatus.PUBLISHED });

    if (search) {
      qb.andWhere('(p.title ILIKE :s OR EXISTS (SELECT 1 FROM poem_versions pv WHERE pv.poem_id = p.id AND (pv.content ILIKE :s OR pv.transcription ILIKE :s)))', { s: `%${search}%` });
    }
    if (author_id) qb.andWhere('p.authorId = :author_id', { author_id });
    if (category_id) qb.andWhere('p.categoryId = :category_id', { category_id });
    if (era_id) qb.andWhere('p.eraId = :era_id', { era_id });
    if (is_member_poem !== undefined) qb.andWhere('p.isMemberPoem = :is_member_poem', { is_member_poem });

    if (sort === 'views') qb.orderBy('p.viewCount', 'DESC');
    else if (sort === 'abc') qb.orderBy('p.title', 'ASC');
    else qb.orderBy('p.createdAt', 'DESC');

    qb.skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: data.map((p) => this.formatPoemList(p)),
    };
  }

  async findBySlug(slug: string) {
    const poem = await this.poemRepo.findOne({
      where: { slug },
      relations: [
        'author',
        'category',
        'era',
        'versions',
        'versions.translations',
        'versions.translations.translator',
        'versions.translations.translatorUser',
        'poemAnnotations',
        'poemAnnotations.annotation',
      ],
    });

    if (!poem) throw new NotFoundException('Không tìm thấy bài thơ');

    poem.viewCount++;
    await this.poemRepo.save(poem);

    const primaryVersion = poem.versions.find((v) => v.isPrimary) || poem.versions[0];

    return {
      success: true,
      data: {
        id: poem.id,
        title: poem.title,
        slug: poem.slug,
        author: { id: poem.author.id, name: poem.author.name, slug: poem.author.slug },
        category: poem.category ? { id: poem.category.id, name: poem.category.name } : null,
        view_count: poem.viewCount,
        like_count: poem.likeCount,
        source_info: poem.sourceInfo,
        is_member_poem: poem.isMemberPoem,
        versions: poem.versions.map((v) => ({
          id: v.id,
          version_name: v.versionName,
          is_primary: v.isPrimary,
          content: v.content,
          transcription: v.transcription,
          explanation: v.explanation,
        })),
        translations: (primaryVersion?.translations ?? []).map((t) => ({
          id: t.id,
          translator: t.translator
            ? { id: t.translator.id, name: t.translator.name, slug: t.translator.slug }
            : t.translatorUser
            ? { id: t.translatorUser.id, name: t.translatorUser.displayName }
            : null,
          translation_title: t.translationTitle,
          content: t.content,
          translation_type: t.translationType,
          is_favorite: t.isFavorite,
        })),
        annotations: poem.poemAnnotations.map((pa) => ({
          keyword: pa.annotation.keyword,
          explanation: pa.annotation.explanation,
          type: pa.annotation.type,
        })),
      },
    };
  }

  async create(dto: CreatePoemDto, user: User) {
    const slug = await this.generateSlug(dto.title);
    const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.MODERATOR;

    const poem = this.poemRepo.create({
      title: dto.title,
      slug,
      authorId: dto.author_id,
      categoryId: dto.category_id,
      eraId: dto.era_id,
      sourceInfo: dto.source_info,
      isMemberPoem: dto.is_member_poem ?? !isAdmin,
      status: (dto.status as PoemStatus) ?? (isAdmin ? PoemStatus.PUBLISHED : PoemStatus.PENDING),
      createdBy: user.id,
    });

    const saved = await this.poemRepo.save(poem);

    if (dto.versions?.length) {
      const versions = dto.versions.map((v, i) =>
        this.versionRepo.create({
          poemId: saved.id,
          versionName: v.version_name ?? 'Bản chuẩn',
          content: v.content,
          transcription: v.transcription,
          explanation: v.explanation,
          isPrimary: v.is_primary ?? i === 0,
        }),
      );
      await this.versionRepo.save(versions);
    }

    return { success: true, data: saved, message: 'Đăng bài thơ thành công' };
  }

  async update(id: number, dto: UpdatePoemDto, user: User) {
    const poem = await this.poemRepo.findOne({ where: { id } });
    if (!poem) throw new NotFoundException('Không tìm thấy bài thơ');

    const canEdit =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.MODERATOR ||
      poem.createdBy === user.id;
    if (!canEdit) throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài thơ này');

    Object.assign(poem, {
      title: dto.title ?? poem.title,
      authorId: dto.author_id ?? poem.authorId,
      categoryId: dto.category_id ?? poem.categoryId,
      eraId: dto.era_id ?? poem.eraId,
      sourceInfo: dto.source_info ?? poem.sourceInfo,
      isMemberPoem: dto.is_member_poem ?? poem.isMemberPoem,
      status: dto.status ?? poem.status,
    });

    const saved = await this.poemRepo.save(poem);
    return { success: true, data: saved };
  }

  async remove(id: number, user: User) {
    const poem = await this.poemRepo.findOne({ where: { id } });
    if (!poem) throw new NotFoundException('Không tìm thấy bài thơ');

    const canDelete =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.MODERATOR ||
      poem.createdBy === user.id;
    if (!canDelete) throw new ForbiddenException('Bạn không có quyền xóa bài thơ này');

    await this.poemRepo.remove(poem);
    return { success: true, message: 'Xóa bài thơ thành công' };
  }

  async checkLiked(poemId: number, userId: number) {
    const existing = await this.likeRepo.findOne({ where: { poemId, userId } });
    return { success: true, data: { liked: Boolean(existing) } };
  }

  async toggleLike(poemId: number, userId: number) {
    const poem = await this.poemRepo.findOne({ where: { id: poemId } });
    if (!poem) throw new NotFoundException('Không tìm thấy bài thơ');

    const existing = await this.likeRepo.findOne({ where: { poemId, userId } });
    if (existing) {
      await this.likeRepo.remove(existing);
      poem.likeCount = Math.max(0, poem.likeCount - 1);
      await this.poemRepo.save(poem);
      return { success: true, liked: false, like_count: poem.likeCount, message: 'Đã bỏ yêu thích' };
    }

    await this.likeRepo.save(this.likeRepo.create({ poemId, userId }));
    poem.likeCount++;
    await this.poemRepo.save(poem);
    return { success: true, liked: true, like_count: poem.likeCount, message: 'Đã thêm vào yêu thích' };
  }

  private formatPoemList(p: Poem) {
    const primaryVersion = p.versions?.find((v) => v.isPrimary) ?? p.versions?.[0];
    const excerpt = primaryVersion?.content
      ? primaryVersion.content.split('\n').slice(0, 4).join('\n')
      : undefined;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      author: p.author ? { id: p.author.id, name: p.author.name, slug: p.author.slug } : null,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      view_count: p.viewCount,
      like_count: p.likeCount,
      is_member_poem: p.isMemberPoem,
      created_at: p.createdAt,
      excerpt,
    };
  }

  private async generateSlug(title: string): Promise<string> {
    let slug = slugify(title, { lower: true, locale: 'vi', strict: true });
    let count = 0;
    while (await this.poemRepo.findOne({ where: { slug: count ? `${slug}-${count}` : slug } })) {
      count++;
    }
    return count ? `${slug}-${count}` : slug;
  }
}
