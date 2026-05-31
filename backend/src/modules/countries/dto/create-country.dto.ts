import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'Việt Nam' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'VN' })
  @IsOptional()
  @IsString()
  iso_code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  flag_url?: string;
}
