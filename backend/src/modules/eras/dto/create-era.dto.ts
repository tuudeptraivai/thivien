import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateEraDto {
  @ApiProperty({ example: 'Đường triều' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 618 })
  @IsOptional()
  @IsNumber()
  start_year?: number;

  @ApiPropertyOptional({ example: 907 })
  @IsOptional()
  @IsNumber()
  end_year?: number;
}
