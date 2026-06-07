import { ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreatePoemDto } from './create-poem.dto';

export class UpdatePoemDto extends PartialType(OmitType(CreatePoemDto, ['versions'] as const)) {
  @ApiPropertyOptional({ description: 'Cập nhật nội dung bản chính (dùng khi sửa bản thảo)' })
  @IsOptional()
  @IsString()
  content?: string;
}
