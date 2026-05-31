import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTranslationDto {
  @ApiPropertyOptional({ description: 'Tên dịch giả (nếu không tự động lấy từ user đăng nhập)' })
  @IsOptional()
  @IsString()
  translator_name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  translation_title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ default: 'Thơ' })
  @IsOptional()
  @IsString()
  translation_type?: string;
}

export class UpdateTranslationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  translation_title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  translation_type?: string;
}
