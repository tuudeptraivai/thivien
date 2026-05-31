import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnnotationDto {
  @ApiProperty({ example: 'Tố Như' })
  @IsString()
  @IsNotEmpty()
  keyword: string;

  @ApiProperty({ example: 'Tức Nguyễn Du, tác giả Truyện Kiều' })
  @IsString()
  @IsNotEmpty()
  explanation: string;

  @ApiPropertyOptional({ enum: ['vocabulary', 'allusion', 'location'], default: 'vocabulary' })
  @IsOptional()
  @IsIn(['vocabulary', 'allusion', 'location'])
  type?: string;

  @ApiPropertyOptional({ example: 'Từ điển Hán Việt Thiều Chửu' })
  @IsOptional()
  @IsString()
  source?: string;
}

export class UpdateAnnotationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  explanation?: string;

  @ApiPropertyOptional({ enum: ['vocabulary', 'allusion', 'location'] })
  @IsOptional()
  @IsIn(['vocabulary', 'allusion', 'location'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  source?: string;
}
