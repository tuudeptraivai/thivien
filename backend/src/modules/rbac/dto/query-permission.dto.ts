import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { SystemModule } from '../../../entities/permission.entity';

export class QueryPermissionDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Tìm theo tên / apiPath / module' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: SystemModule, description: 'Lọc theo System Module' })
  @IsOptional()
  @IsEnum(SystemModule)
  system_module?: SystemModule;

  @ApiPropertyOptional({ description: 'Lọc theo module (label)' })
  @IsOptional()
  @IsString()
  module?: string;
}
