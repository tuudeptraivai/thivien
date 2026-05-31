import { BadRequestException, Controller, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '../../entities/user.entity';
import { ScraperService, ScraperTarget } from './scraper.service';

@ApiTags('Admin - Scraper')
@ApiBearerAuth()
@Controller('admin/scraper')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class ScraperController {
  constructor(private readonly scraper: ScraperService) {}

  @Post('run')
  @ApiOperation({ summary: 'Chạy thủ công job cào dữ liệu (Admin)' })
  @ApiQuery({ name: 'target', enum: ['authors', 'poems', 'translations', 'all'] })
  async run(@Query('target') target: ScraperTarget = 'all') {
    const allowed: ScraperTarget[] = ['authors', 'poems', 'translations', 'all'];
    if (!allowed.includes(target)) {
      throw new BadRequestException(
        `target không hợp lệ: ${target}. Cho phép: ${allowed.join(', ')}`,
      );
    }
    const results = await this.scraper.run(target);
    return { success: true, data: results };
  }
}
