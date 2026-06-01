import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Public()
  @Get('summary')
  @ApiOperation({ summary: 'Thống kê tổng quan hệ thống' })
  getSummary() {
    return this.statisticsService.getSummary();
  }
}
