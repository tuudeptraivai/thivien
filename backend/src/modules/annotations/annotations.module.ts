import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnotationsService } from './annotations.service';
import { AnnotationsController } from './annotations.controller';
import { Annotation } from '../../entities/annotation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Annotation])],
  providers: [AnnotationsService],
  controllers: [AnnotationsController],
})
export class AnnotationsModule {}
