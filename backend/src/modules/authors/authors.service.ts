import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import slugify from 'slugify';
import { Author } from '../../entities/author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { QueryAuthorDto } from './dto/query-author.dto';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class AuthorsService {
  constructor(@InjectRepository(Author) private authorRepo: Repository<Author>) {}

  async findAll(query: QueryAuthorDto) {
    const { page = 1, limit = 20, search, country_id, era_id, verified, letter, sort } = query;
    const skip = (page - 1) * limit;

    const qb = this.authorRepo.createQueryBuilder('a')
      .leftJoinAndSelect('a.country', 'country')
      .leftJoinAndSelect('a.era', 'era')
      .loadRelationCountAndMap('a.poemCount', 'a.poems');

    if (search) {
      qb.andWhere('a.name LIKE :search', { search: `%${search}%` });
    }
    if (letter) {
      qb.andWhere('a.name LIKE :letter', { letter: `${letter}%` });
    }
    if (country_id) qb.andWhere('a.countryId = :country_id', { country_id });
    if (era_id) qb.andWhere('a.eraId = :era_id', { era_id });
    if (verified !== undefined) qb.andWhere('a.isVerified = :verified', { verified });

    if (sort === 'poems' || sort === 'poem_count') {
      // Sắp xếp theo số tác phẩm giảm dần (dùng cho "Tác giả nhiều tác phẩm").
      // Dùng offset/limit thay vì skip/take: skip/take + join sẽ kích hoạt
      // subquery phân trang DISTINCT khiến TypeORM không parse được biểu thức
      // subquery trong ORDER BY. country/era là ManyToOne nên LIMIT vẫn đúng.
      qb.orderBy('(SELECT COUNT(*) FROM poems p WHERE p.author_id = a.id)', 'DESC')
        .addOrderBy('a.name', 'ASC')
        .offset(skip)
        .limit(limit);
    } else {
      qb.orderBy('a.name', 'ASC').skip(skip).take(limit);
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: data.map((a) => this.formatAuthor(a)),
    };
  }

  async findBySlug(slug: string) {
    const author = await this.authorRepo.findOne({
      where: { slug },
      relations: ['country', 'era'],
    });
    if (!author) throw new NotFoundException('Không tìm thấy tác giả');

    const poemCount = await this.authorRepo
      .createQueryBuilder('a')
      .leftJoin('a.poems', 'p')
      .where('a.id = :id', { id: author.id })
      .select('COUNT(p.id)', 'cnt')
      .getRawOne()
      .then((r) => parseInt(r?.cnt ?? '0'));

    author.viewCount++;
    await this.authorRepo.save(author);

    return {
      success: true,
      data: {
        id: author.id,
        name: author.name,
        slug: author.slug,
        birth_year: author.birthYear,
        death_year: author.deathYear,
        country: author.country?.name ?? null,
        country_id: author.countryId,
        era: author.era?.name ?? null,
        era_id: author.eraId,
        portrait_url: author.portraitUrl,
        biography: author.biography,
        poem_count: poemCount,
        is_verified: author.isVerified,
      },
    };
  }

  async create(dto: CreateAuthorDto, user: User) {
    const slug = await this.generateSlug(dto.name);
    const author = this.authorRepo.create({
      name: dto.name,
      slug,
      realName: dto.real_name,
      birthYear: dto.birth_year,
      deathYear: dto.death_year,
      countryId: dto.country_id,
      eraId: dto.era_id,
      biography: dto.biography,
      portraitUrl: dto.portrait_url,
      createdBy: user.id,
    });
    const saved = await this.authorRepo.save(author);
    return { success: true, data: saved, message: 'Thêm tác giả thành công' };
  }

  async update(id: number, dto: UpdateAuthorDto, user: User) {
    const author = await this.authorRepo.findOne({ where: { id } });
    if (!author) throw new NotFoundException('Không tìm thấy tác giả');

    const canEdit =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.MODERATOR ||
      author.createdBy === user.id;
    if (!canEdit) throw new ForbiddenException('Bạn không có quyền chỉnh sửa tác giả này');

    Object.assign(author, {
      name: dto.name ?? author.name,
      realName: dto.real_name ?? author.realName,
      birthYear: dto.birth_year ?? author.birthYear,
      deathYear: dto.death_year ?? author.deathYear,
      countryId: dto.country_id ?? author.countryId,
      eraId: dto.era_id ?? author.eraId,
      biography: dto.biography ?? author.biography,
      portraitUrl: dto.portrait_url ?? author.portraitUrl,
    });

    const saved = await this.authorRepo.save(author);
    return { success: true, data: saved };
  }

  async remove(id: number, user: User) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Chỉ Admin mới có thể xóa tác giả');
    }
    const author = await this.authorRepo.findOne({ where: { id } });
    if (!author) throw new NotFoundException('Không tìm thấy tác giả');
    await this.authorRepo.remove(author);
    return { success: true, message: 'Xóa tác giả thành công' };
  }

  private formatAuthor(a: Author) {
    return {
      id: a.id,
      name: a.name,
      slug: a.slug,
      birth_year: a.birthYear,
      death_year: a.deathYear,
      country: a.country?.name ?? null,
      country_id: a.countryId ?? null,
      era: a.era?.name ?? null,
      era_id: a.eraId ?? null,
      real_name: a.realName ?? null,
      biography: a.biography ?? null,
      portrait_url: a.portraitUrl,
      poem_count: (a as any).poemCount ?? 0,
      is_verified: a.isVerified,
    };
  }

  private async generateSlug(name: string): Promise<string> {
    let slug = slugify(name, { lower: true, locale: 'vi', strict: true });
    let count = 0;
    while (await this.authorRepo.findOne({ where: { slug: count ? `${slug}-${count}` : slug } })) {
      count++;
    }
    return count ? `${slug}-${count}` : slug;
  }
}
