import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTopicDto {
  @ApiProperty()
  @IsNumber()
  category_id: number;

  @ApiProperty({ example: 'Phân tích bài thơ Đoạn trường tân thanh của Nguyễn Du' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Nội dung bài viết đầu tiên' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class CreateForumPostDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'ID bài viết cha (trả lời)' })
  @IsOptional()
  @IsNumber()
  parent_id?: number;
}

export class QueryForumDto {
  @ApiPropertyOptional()
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional()
  @IsOptional()
  category_id?: number;
}
