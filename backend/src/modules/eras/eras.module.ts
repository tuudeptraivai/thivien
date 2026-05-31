import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErasService } from './eras.service';
import { ErasController } from './eras.controller';
import { Era } from '../../entities/era.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Era])],
  providers: [ErasService],
  controllers: [ErasController],
})
export class ErasModule {}
