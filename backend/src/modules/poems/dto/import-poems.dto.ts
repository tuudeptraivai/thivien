import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

/** Một dòng thơ trong file CSV. Tác giả/thể loại/thời kỳ dùng TÊN, không phải id. */
export class ImportPoemRowDto {
  @ApiProperty({ example: 'Đoạn trường tân thanh' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'Nội dung bài thơ (có thể nhiều dòng)' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ description: 'Tên tác giả — tự tạo nếu chưa có' })
  @IsOptional()
  @IsString()
  author_name?: string;

  @ApiPropertyOptional({ description: 'Tên thể loại (khớp theo tên có sẵn)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Tên thời kỳ / triều đại (khớp theo tên có sẵn)' })
  @IsOptional()
  @IsString()
  era?: string;

  @ApiPropertyOptional({ example: 'Thanh Hiên thi tập' })
  @IsOptional()
  @IsString()
  source_info?: string;

  @ApiPropertyOptional({ description: 'draft | pending | published (mặc định published)' })
  @IsOptional()
  @IsString()
  status?: string;
}

export class ImportPoemsDto {
  @ApiProperty({ type: [ImportPoemRowDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMaxSize(2000)
  @ValidateNested({ each: true })
  @Type(() => ImportPoemRowDto)
  rows: ImportPoemRowDto[];
}
