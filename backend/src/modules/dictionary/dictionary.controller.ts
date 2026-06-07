import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { DictionaryService } from './dictionary.service';
import { LookupDictionaryDto, LookupResponseDto } from './dto/lookup-dictionary.dto';

@ApiTags('Dictionary')
@Controller('dictionary')
export class DictionaryController {
  constructor(private readonly service: DictionaryService) {}

  @Public()
  @Post('lookup')
  @ApiOperation({
    summary:
      'Tra cứu chữ Hán / Hán–Việt / Pinyin / nghĩa tiếng Việt qua Claude AI (fallback offline)',
  })
  async lookup(@Body() dto: LookupDictionaryDto): Promise<LookupResponseDto> {
    return this.service.lookup(dto.query);
  }

  @Public()
  @Get('popular')
  @ApiOperation({ summary: 'Danh sách chữ Hán phổ biến dùng cho sidebar' })
  popular() {
    return this.service.popular();
  }
}
