import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { SystemModule } from '../../../entities/permission.entity';

export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export class CreatePermissionDto {
  @ApiProperty({ example: 'Xem danh sách thơ' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '/poems' })
  @IsString()
  @IsNotEmpty()
  api_path: string;

  @ApiProperty({ enum: HTTP_METHODS, example: 'GET' })
  @IsIn(HTTP_METHODS as unknown as string[])
  method: string;

  @ApiProperty({ example: 'Quản lý thơ' })
  @IsString()
  @IsNotEmpty()
  module: string;

  @ApiPropertyOptional({ enum: SystemModule, default: SystemModule.BUSINESS })
  @IsEnum(SystemModule)
  system_module: SystemModule = SystemModule.BUSINESS;
}
