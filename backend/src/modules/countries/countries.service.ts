import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../../entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';

@Injectable()
export class CountriesService {
  constructor(@InjectRepository(Country) private repo: Repository<Country>) {}

  async findAll() {
    return { success: true, data: await this.repo.find({ order: { name: 'ASC' } }) };
  }

  async create(dto: CreateCountryDto) {
    const c = await this.repo.save(this.repo.create({ name: dto.name, isoCode: dto.iso_code, flagUrl: dto.flag_url }));
    return { success: true, data: c };
  }

  async update(id: number, dto: Partial<CreateCountryDto>) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Không tìm thấy quốc gia');
    Object.assign(c, { name: dto.name ?? c.name, isoCode: dto.iso_code ?? c.isoCode, flagUrl: dto.flag_url ?? c.flagUrl });
    return { success: true, data: await this.repo.save(c) };
  }

  async remove(id: number) {
    const c = await this.repo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Không tìm thấy quốc gia');
    await this.repo.remove(c);
    return { success: true, message: 'Xóa thành công' };
  }
}
