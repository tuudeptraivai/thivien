import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@gmail.com', default: 'admin@gmail.com' })
  @IsString()
  @IsNotEmpty()
  username_or_email: string = 'admin@gmail.com';

  @ApiProperty({ example: 'admin@123', default: 'admin@123' })
  @IsString()
  @IsNotEmpty()
  password: string = 'admin@123';
}
