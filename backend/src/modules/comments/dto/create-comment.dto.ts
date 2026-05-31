import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ enum: ['poem', 'author', 'forum_topic'] })
  @IsIn(['poem', 'author', 'forum_topic'])
  entity_type: string;

  @ApiProperty()
  @IsNumber()
  entity_id: number;

  @ApiPropertyOptional({ description: 'ID bình luận cha (reply)' })
  @IsOptional()
  @IsNumber()
  parent_id?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ description: 'Tên khách vãng lai (nếu chưa đăng nhập)' })
  @IsOptional()
  @IsString()
  guest_name?: string;

  @ApiPropertyOptional({ description: 'Email khách vãng lai' })
  @IsOptional()
  @IsEmail()
  guest_email?: string;
}
