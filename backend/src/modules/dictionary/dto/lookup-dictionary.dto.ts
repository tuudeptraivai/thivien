import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { DictionaryEntry } from './dictionary-entry.dto';

export class LookupDictionaryDto {
  @ApiProperty({
    example: '詩',
    description: 'Chữ Hán, phiên âm Hán-Việt, pinyin hoặc nghĩa tiếng Việt cần tra',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  query!: string;
}

export class LookupResponseDto {
  @ApiProperty({ enum: ['ai', 'offline'], description: 'Nguồn kết quả' })
  source!: 'ai' | 'offline';

  @ApiProperty({ type: [DictionaryEntry] })
  results!: DictionaryEntry[];

  @ApiProperty({ type: [String], description: 'Gợi ý truy vấn tiếp theo' })
  suggestedQueries!: string[];

  @ApiProperty({ required: false, description: 'Thông báo bổ sung (vd: khi fallback offline)' })
  message?: string;
}
