import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Translation } from '../../entities/translation.entity';
import { PoemVersion } from '../../entities/poem-version.entity';
import { CreateTranslationDto, UpdateTranslationDto } from './dto/create-translation.dto';
import { User, UserRole } from '../../entities/user.entity';

@Injectable()
export class TranslationsService {
  constructor(
    @InjectRepository(Translation) private translationRepo: Repository<Translation>,
    @InjectRepository(PoemVersion) private versionRepo: Repository<PoemVersion>,
  ) {}

  async findMemberTranslations(page = 1, limit = 18) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.translationRepo
      .createQueryBuilder('t')
      .innerJoinAndSelect('t.translatorUser', 'tu')
      .innerJoinAndSelect('t.poemVersion', 'pv')
      .innerJoinAndSelect('pv.poem', 'poem')
      .leftJoinAndSelect('poem.author', 'author')
      .where('t.translatorUserId IS NOT NULL')
      .orderBy('t.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data: data.map((t) => ({
        id: t.id,
        translation_title: t.translationTitle,
        translation_type: t.translationType,
        excerpt: t.content ? t.content.split('\n').slice(0, 4).join('\n') : undefined,
        translator: { name: t.translatorUser.displayName },
        poem: {
          title: t.poemVersion.poem.title,
          slug: t.poemVersion.poem.slug,
          author_name: t.poemVersion.poem.author?.name ?? null,
        },
        created_at: t.createdAt,
      })),
    };
  }

  async create(poemId: number, versionId: number, dto: CreateTranslationDto, user: User) {
    const version = await this.versionRepo.findOne({ where: { id: versionId, poemId } });
    if (!version) throw new NotFoundException('Không tìm thấy dị bản bài thơ');

    const translation = this.translationRepo.create({
      poemVersionId: versionId,
      translatorUserId: user.id,
      translationTitle: dto.translation_title,
      content: dto.content,
      translationType: dto.translation_type ?? 'Thơ',
    });

    const saved = await this.translationRepo.save(translation);
    return { success: true, data: saved, message: 'Đóng góp bản dịch thành công' };
  }

  async update(id: number, dto: UpdateTranslationDto, user: User) {
    const translation = await this.translationRepo.findOne({ where: { id } });
    if (!translation) throw new NotFoundException('Không tìm thấy bản dịch');

    const canEdit =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.MODERATOR ||
      translation.translatorUserId === user.id;
    if (!canEdit) throw new ForbiddenException('Bạn không có quyền chỉnh sửa bản dịch này');

    Object.assign(translation, {
      translationTitle: dto.translation_title ?? translation.translationTitle,
      content: dto.content ?? translation.content,
      translationType: dto.translation_type ?? translation.translationType,
    });

    const saved = await this.translationRepo.save(translation);
    return { success: true, data: saved };
  }

  async remove(id: number, user: User) {
    const translation = await this.translationRepo.findOne({ where: { id } });
    if (!translation) throw new NotFoundException('Không tìm thấy bản dịch');

    const canDelete =
      user.role === UserRole.ADMIN ||
      user.role === UserRole.MODERATOR ||
      translation.translatorUserId === user.id;
    if (!canDelete) throw new ForbiddenException('Bạn không có quyền xóa bản dịch này');

    await this.translationRepo.remove(translation);
    return { success: true, message: 'Xóa bản dịch thành công' };
  }

  async setFavorite(id: number, user: User) {
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.MODERATOR) {
      throw new ForbiddenException('Chỉ Admin/Moderator mới có thể đặt bản dịch yêu thích');
    }
    const translation = await this.translationRepo.findOne({ where: { id } });
    if (!translation) throw new NotFoundException('Không tìm thấy bản dịch');

    await this.translationRepo.update(
      { poemVersionId: translation.poemVersionId },
      { isFavorite: false },
    );
    translation.isFavorite = true;
    await this.translationRepo.save(translation);
    return { success: true, message: 'Đặt bản dịch yêu thích thành công' };
  }
}
