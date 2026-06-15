import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Annotation } from '../../entities/annotation.entity';
import { CreateAnnotationDto, UpdateAnnotationDto } from './dto/create-annotation.dto';
import { User } from '../../entities/user.entity';

@Injectable()
export class AnnotationsService {
  constructor(@InjectRepository(Annotation) private annotationRepo: Repository<Annotation>) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }) {
    const { page = 1, limit = 20, search, type } = params;
    const skip = (page - 1) * limit;

    const qb = this.annotationRepo.createQueryBuilder('a');
    if (search) {
      qb.andWhere('(a.keyword LIKE :s OR a.explanation LIKE :s)', {
        s: `%${search}%`,
      });
    }
    if (type) qb.andWhere('a.type = :type', { type });

    qb.orderBy('a.keyword', 'ASC').skip(skip).take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      success: true,
      meta: {
        total_records: total,
        total_pages: Math.ceil(total / limit),
        current_page: page,
        limit,
      },
      data,
    };
  }

  async lookup(keyword: string) {
    const results = await this.annotationRepo.find({
      where: { keyword: ILike(`%${keyword}%`) },
      take: 20,
    });
    return { success: true, data: results };
  }

  async create(dto: CreateAnnotationDto, user: User) {
    const exists = await this.annotationRepo.findOne({ where: { keyword: dto.keyword } });
    if (exists) throw new ConflictException('Từ khóa này đã tồn tại trong hệ thống');

    const annotation = this.annotationRepo.create({
      keyword: dto.keyword,
      explanation: dto.explanation,
      type: dto.type ?? 'vocabulary',
      source: dto.source,
      createdBy: user.id,
    });
    const saved = await this.annotationRepo.save(annotation);
    return { success: true, data: saved };
  }

  async update(id: number, dto: UpdateAnnotationDto) {
    const annotation = await this.annotationRepo.findOne({ where: { id } });
    if (!annotation) throw new NotFoundException('Không tìm thấy từ khóa chú giải');

    Object.assign(annotation, {
      explanation: dto.explanation ?? annotation.explanation,
      type: dto.type ?? annotation.type,
      source: dto.source ?? annotation.source,
    });

    const saved = await this.annotationRepo.save(annotation);
    return { success: true, data: saved };
  }

  async remove(id: number) {
    const annotation = await this.annotationRepo.findOne({ where: { id } });
    if (!annotation) throw new NotFoundException('Không tìm thấy từ khóa chú giải');
    await this.annotationRepo.remove(annotation);
    return { success: true, message: 'Xóa chú giải thành công' };
  }
}
