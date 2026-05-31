import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Era } from '../../entities/era.entity';
import { CreateEraDto } from './dto/create-era.dto';

@Injectable()
export class ErasService {
  constructor(@InjectRepository(Era) private repo: Repository<Era>) {}

  async findAll() {
    return { success: true, data: await this.repo.find({ order: { startYear: 'ASC' } }) };
  }

  async create(dto: CreateEraDto) {
    const e = await this.repo.save(this.repo.create({ name: dto.name, description: dto.description, startYear: dto.start_year, endYear: dto.end_year }));
    return { success: true, data: e };
  }

  async update(id: number, dto: Partial<CreateEraDto>) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Không tìm thấy thời kỳ');
    Object.assign(e, { name: dto.name ?? e.name, description: dto.description ?? e.description, startYear: dto.start_year ?? e.startYear, endYear: dto.end_year ?? e.endYear });
    return { success: true, data: await this.repo.save(e) };
  }

  async remove(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Không tìm thấy thời kỳ');
    await this.repo.remove(e);
    return { success: true, message: 'Xóa thành công' };
  }
}
