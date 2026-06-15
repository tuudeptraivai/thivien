import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class CreatePoemVersionDto {
  @ApiPropertyOptional({ default: 'Bản chuẩn' })
  @IsOptional()
  @IsString()
  version_name?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transcription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  is_primary?: boolean;
}

export class CreatePoemDto {
  @ApiProperty({ example: 'Đoạn trường tân thanh' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ example: 101, description: 'ID tác giả có sẵn. Bỏ trống cho thơ sáng tác của chính thành viên.' })
  @IsOptional()
  @IsNumber()
  author_id?: number;

  @ApiPropertyOptional({ description: 'Tên tác giả tự điền — nếu chưa có trong hệ thống sẽ tạo tác giả mới.' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  author_name?: string;

  @ApiPropertyOptional({ example: 9 })
  @IsOptional()
  @IsNumber()
  category_id?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  era_id?: number;

  @ApiPropertyOptional({ example: 'Thanh Hiên thi tập' })
  @IsOptional()
  @IsString()
  source_info?: string;

  @ApiPropertyOptional({ description: 'Nội dung bài thơ — tạo nhanh bản chính. Bỏ qua nếu đã truyền versions.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  is_member_poem?: boolean;

  @ApiPropertyOptional({ example: 'published' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ type: [CreatePoemVersionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePoemVersionDto)
  versions?: CreatePoemVersionDto[];
}
