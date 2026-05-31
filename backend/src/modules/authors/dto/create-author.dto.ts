import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class CreateAuthorDto {
  @ApiProperty({ example: 'Lý Bạch' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ example: 'Lý Thái Bạch' })
  @IsOptional()
  @IsString()
  real_name?: string;

  @ApiPropertyOptional({ example: '701' })
  @IsOptional()
  @IsString()
  birth_year?: string;

  @ApiPropertyOptional({ example: '762' })
  @IsOptional()
  @IsString()
  death_year?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsNumber()
  country_id?: number;

  @ApiPropertyOptional({ example: 11 })
  @IsOptional()
  @IsNumber()
  era_id?: number;

  @ApiPropertyOptional({ example: '# Lý Bạch\nLý Bạch là một trong những nhà thơ lớn...' })
  @IsOptional()
  @IsString()
  biography?: string;

  @ApiPropertyOptional({ example: 'https://url.to/portrait.jpg' })
  @IsOptional()
  @IsString()
  portrait_url?: string;
}
