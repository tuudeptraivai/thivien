import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import { PoemCategory } from '../../entities/poem-category.entity';
import { CreatePoemCategoryDto } from './dto/create-poem-category.dto';

@Injectable()
export class PoemCategoriesService {
  constructor(@InjectRepository(PoemCategory) private repo: Repository<PoemCategory>) {}

  async findAll() {
    return { success: true, data: await this.repo.find({ order: { name: 'ASC' } }) };
  }

  async create(dto: CreatePoemCategoryDto) {
    const slug = dto.slug ?? slugify(dto.name, { lower: true, locale: 'vi', strict: true });
    const c = await this.repo.save(this.repo.create({ name: dto.name, slug, description: dto.description }));
    return { success: true, data: c };
  }

  async update(id: number, dto: Partial<CreatePoemCategoryDto>) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Không tìm thấy thể loại');
    Object.assign(c, { name: dto.name ?? c.name, description: dto.description ?? c.description });
    return { success: true, data: await this.repo.save(c) };
  }

  async remove(id: number) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Không tìm thấy thể loại');
    await this.repo.remove(c);
    return { success: true, message: 'Xóa thành công' };
  }
}
