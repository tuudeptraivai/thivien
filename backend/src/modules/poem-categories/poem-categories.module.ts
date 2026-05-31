import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PoemCategoriesService } from './poem-categories.service';
import { PoemCategoriesController } from './poem-categories.controller';
import { PoemCategory } from '../../entities/poem-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PoemCategory])],
  providers: [PoemCategoriesService],
  controllers: [PoemCategoriesController],
})
export class PoemCategoriesModule {}
