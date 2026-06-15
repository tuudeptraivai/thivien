import {
  BadRequestException,
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
import { Author } from '../../entities/author.entity';
import { PoemCategory } from '../../entities/poem-category.entity';
import { Era } from '../../entities/era.entity';
import { CreatePoemDto } from './dto/create-poem.dto';
import { UpdatePoemDto } from './dto/update-poem.dto';
import { QueryPoemDto } from './dto/query-poem.dto';
import { ImportPoemRowDto } from './dto/import-poems.dto';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class PoemsService {
  constructor(
    @InjectRepository(Poem) private poemRepo: Repository<Poem>,
    @InjectRepository(PoemVersion) private versionRepo: Repository<PoemVersion>,
    @InjectRepository(PoemLike) private likeRepo: Repository<PoemLike>,
    @InjectRepository(Author) private authorRepo: Repository<Author>,
    @InjectRepository(PoemCategory)
    private categoryRepo: Repository<PoemCategory>,
    @InjectRepository(Era) private eraRepo: Repository<Era>,
  ) {}

  /**
   * Chuẩn hoá & kiểm tra các khoá ngoại tuỳ chọn. Trả về giá trị đã làm sạch
   * (0/NaN → null) và ném BadRequest nếu id được cung cấp nhưng không tồn tại —
   * thay cho lỗi 500 do ràng buộc khoá ngoại của MySQL.
   */
  private async validateRef<T>(
    repo: Repository<T>,
    id: number | null | undefined,
    label: string,
  ): Promise<number | null> {
    if (id === undefined || id === null || (id as number) <= 0) return null;
    const exists = await repo.findOne({ where: { id } as any });
    if (!exists) throw new BadRequestException(`${label} không tồn tại`);
    return id;
  }

  /**
   * Phân giải author_id. Tác giả là tuỳ chọn: thơ do thành viên tự sáng tác thì
   * không có tác giả. Vì vậy id rỗng/không hợp lệ/không tồn tại đều coi như
   * "không có tác giả" (null) — bài thơ trở thành thơ sáng tác của thành viên,
   * không ném lỗi.
   */
  private async resolveAuthorId(
    id: number | null | undefined,
  ): Promise<number | null> {
    if (id === undefined || id === null || id <= 0) return null;
    const exists = await this.authorRepo.findOne({ where: { id } });
    return exists ? id : null;
  }

  async findAll(query: QueryPoemDto) {
    const { page = 1, limit = 20, search, author_id, category_id, era_id, is_member_poem, sort = 'newest', status } = query;
    const skip = (page - 1) * limit;

    const qb = this.poemRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.author', 'author')
      .leftJoinAndSelect('p.creator', 'creator')
      .leftJoinAndSelect('p.category', 'category')
      .leftJoinAndSelect('p.era', 'era')
      .leftJoinAndSelect('p.versions', 'v', 'v.isPrimary = true');

    // Mặc định chỉ hiển thị thơ đã xuất bản; admin có thể truyền status để
    // xem draft/pending hoặc 'all' để xem tất cả.
    if (status && status !== 'all') {
      qb.where('p.status = :status', { status });
    } else if (!status) {
      qb.where('p.status = :status', { status: PoemStatus.PUBLISHED });
    }

    if (search) {
      qb.andWhere('(p.title LIKE :s OR EXISTS (SELECT 1 FROM poem_versions pv WHERE pv.poem_id = p.id AND (pv.content LIKE :s OR pv.transcription LIKE :s)))', { s: `%${search}%` });
    }
    if (author_id) qb.andWhere('p.authorId = :author_id', { author_id });
    if (category_id) qb.andWhere('p.categoryId = :category_id', { category_id });
    if (era_id) qb.andWhere('p.eraId = :era_id', { era_id });
    if (is_member_poem !== undefined) {
      if (is_member_poem) {
        // Thơ do thành viên sáng tác: không có tác giả gốc, gắn với 1 user.
        qb.andWhere('p.authorId IS NULL').andWhere('p.createdBy IS NOT NULL');
      } else {
        // Thơ của tác giả: có author_id.
        qb.andWhere('p.authorId IS NOT NULL');
      }
    }

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
        'creator',
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
        author: poem.author
          ? { id: poem.author.id, name: poem.author.name, slug: poem.author.slug }
          : poem.creator
          ? { id: 0, name: poem.creator.displayName, slug: '' }
          : null,
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

    // Phân giải tác giả: ưu tiên author_id; nếu chỉ có tên thì tìm hoặc tạo tác giả mới.
    // Không có author_id hợp lệ ⇒ thơ tự sáng tác của thành viên (không tác giả).
    let authorId = await this.resolveAuthorId(dto.author_id);
    if (!authorId && dto.author_name?.trim()) {
      authorId = await this.findOrCreateAuthor(dto.author_name.trim(), user.id);
    }
    const categoryId = await this.validateRef(this.categoryRepo, dto.category_id, 'Thể loại');
    const eraId = await this.validateRef(this.eraRepo, dto.era_id, 'Thời kỳ');

    const poem = this.poemRepo.create({
      title: dto.title,
      slug,
      authorId,
      categoryId: categoryId ?? undefined,
      eraId: eraId ?? undefined,
      sourceInfo: dto.source_info,
      // Không gắn tác giả nào = thơ do chính thành viên sáng tác.
      isMemberPoem: dto.is_member_poem ?? !authorId,
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
    } else if (dto.content?.trim()) {
      // Tạo nhanh: chỉ truyền nội dung → tạo bản chính.
      await this.versionRepo.save(
        this.versionRepo.create({
          poemId: saved.id,
          versionName: 'Bản chuẩn',
          content: dto.content,
          isPrimary: true,
        }),
      );
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

    // Chỉ kiểm tra khoá ngoại khi client gửi giá trị mới.
    const authorId =
      dto.author_id !== undefined
        ? await this.resolveAuthorId(dto.author_id)
        : poem.authorId;
    const categoryId =
      dto.category_id !== undefined
        ? await this.validateRef(this.categoryRepo, dto.category_id, 'Thể loại')
        : poem.categoryId;
    const eraId =
      dto.era_id !== undefined
        ? await this.validateRef(this.eraRepo, dto.era_id, 'Thời kỳ')
        : poem.eraId;

    Object.assign(poem, {
      title: dto.title ?? poem.title,
      authorId,
      categoryId,
      eraId,
      sourceInfo: dto.source_info ?? poem.sourceInfo,
      isMemberPoem: dto.is_member_poem ?? poem.isMemberPoem,
      status: (dto.status as PoemStatus) ?? poem.status,
    });

    const saved = await this.poemRepo.save(poem);

    if (dto.content !== undefined) {
      let version = await this.versionRepo.findOne({
        where: { poemId: poem.id, isPrimary: true },
      });
      if (version) {
        version.content = dto.content;
      } else {
        version = this.versionRepo.create({
          poemId: poem.id,
          versionName: 'Bản chuẩn',
          content: dto.content,
          isPrimary: true,
        });
      }
      await this.versionRepo.save(version);
    }

    return { success: true, data: saved };
  }

  async findMine(user: User, status?: string) {
    const where: { createdBy: number; status?: PoemStatus } = { createdBy: user.id };
    if (status) where.status = status as PoemStatus;

    const poems = await this.poemRepo.find({
      where,
      relations: ['versions'],
      order: { updatedAt: 'DESC' },
    });

    return {
      success: true,
      data: poems.map((p) => {
        const primary = p.versions?.find((v) => v.isPrimary) ?? p.versions?.[0];
        return {
          id: p.id,
          title: p.title,
          slug: p.slug,
          status: p.status,
          source_info: p.sourceInfo,
          content: primary?.content ?? '',
          updated_at: p.updatedAt,
        };
      }),
    };
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

  /**
   * Nhập hàng loạt bài thơ từ CSV (đã được parse thành mảng dòng ở client).
   * Mỗi dòng độc lập: lỗi dòng nào bỏ qua dòng đó và ghi lại, không chặn cả lô.
   */
  async importPoems(rows: ImportPoemRowDto[], user: User) {
    let created = 0;
    const errors: { row: number; title: string; message: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] ?? ({} as ImportPoemRowDto);
      try {
        const title = (r.title ?? '').trim();
        if (!title) throw new Error('Thiếu tiêu đề');

        const slug = await this.generateSlug(title);

        const authorId = r.author_name?.trim()
          ? await this.findOrCreateAuthor(r.author_name.trim(), user.id)
          : null;
        const categoryId = await this.findByName(this.categoryRepo, r.category);
        const eraId = await this.findByName(this.eraRepo, r.era);

        const status = (['draft', 'pending', 'published'] as string[]).includes(
          (r.status ?? '').trim(),
        )
          ? ((r.status as string).trim() as PoemStatus)
          : PoemStatus.PUBLISHED;

        const poem = await this.poemRepo.save(
          this.poemRepo.create({
            title,
            slug,
            authorId,
            categoryId: categoryId ?? undefined,
            eraId: eraId ?? undefined,
            sourceInfo: r.source_info?.trim() || undefined,
            isMemberPoem: !authorId,
            status,
            createdBy: user.id,
          }),
        );

        if (r.content?.trim()) {
          await this.versionRepo.save(
            this.versionRepo.create({
              poemId: poem.id,
              versionName: 'Bản chuẩn',
              content: r.content,
              isPrimary: true,
            }),
          );
        }
        created += 1;
      } catch (e) {
        errors.push({
          row: i + 1,
          title: (r.title ?? '').trim(),
          message: (e as Error)?.message ?? 'Lỗi không xác định',
        });
      }
    }

    return {
      success: true,
      message: `Đã nhập ${created}/${rows.length} bài thơ`,
      data: { total: rows.length, created, failed: errors.length, errors },
    };
  }

  /** Tìm id bản ghi theo tên (không phân biệt hoa thường). null nếu rỗng/không thấy. */
  private async findByName<T extends { id: number }>(
    repo: Repository<T>,
    name: string | undefined,
  ): Promise<number | null> {
    const n = name?.trim();
    if (!n) return null;
    const found = await repo
      .createQueryBuilder('e')
      .where('LOWER(e.name) = LOWER(:n)', { n })
      .getOne();
    return found ? found.id : null;
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

    const author = p.author
      ? { id: p.author.id, name: p.author.name, slug: p.author.slug }
      : p.creator
      ? { id: 0, name: p.creator.displayName, slug: '' }
      : null;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      author,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      view_count: p.viewCount,
      like_count: p.likeCount,
      is_member_poem: p.isMemberPoem,
      status: p.status,
      created_at: p.createdAt,
      excerpt,
      content: primaryVersion?.content ?? '',
    };
  }

  private async findOrCreateAuthor(name: string, userId: number): Promise<number> {
    const existing = await this.authorRepo.findOne({ where: { name } });
    if (existing) return existing.id;

    let slug = slugify(name, { lower: true, locale: 'vi', strict: true }) || 'tac-gia';
    let count = 0;
    while (await this.authorRepo.findOne({ where: { slug: count ? `${slug}-${count}` : slug } })) {
      count++;
    }
    if (count) slug = `${slug}-${count}`;

    const author = await this.authorRepo.save(
      this.authorRepo.create({ name, slug, createdBy: userId }),
    );
    return author.id;
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
