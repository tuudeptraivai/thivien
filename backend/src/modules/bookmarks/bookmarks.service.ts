import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from '../../entities/bookmark.entity';
import { Poem } from '../../entities/poem.entity';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark) private bookmarkRepo: Repository<Bookmark>,
    @InjectRepository(Poem) private poemRepo: Repository<Poem>,
  ) {}

  async getMyBookmarks(userId: number, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [data, total] = await this.bookmarkRepo.findAndCount({
      where: { userId },
      relations: ['poem', 'poem.author'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      success: true,
      meta: { total_records: total, total_pages: Math.ceil(total / limit), current_page: page, limit },
      data: data.map((b) => ({
        poem_id: b.poemId,
        title: b.poem.title,
        slug: b.poem.slug,
        author: b.poem.author ? { name: b.poem.author.name } : null,
        bookmarked_at: b.createdAt,
      })),
    };
  }

  async toggle(userId: number, poemId: number) {
    const poem = await this.poemRepo.findOne({ where: { id: poemId } });
    if (!poem) throw new NotFoundException('Không tìm thấy bài thơ');

    const existing = await this.bookmarkRepo.findOne({ where: { userId, poemId } });
    if (existing) {
      await this.bookmarkRepo.remove(existing);
      return { success: true, bookmarked: false, message: 'Đã xóa khỏi tủ sách' };
    }

    await this.bookmarkRepo.save(this.bookmarkRepo.create({ userId, poemId }));
    return { success: true, bookmarked: true, message: 'Đã thêm vào tủ sách' };
  }
}
