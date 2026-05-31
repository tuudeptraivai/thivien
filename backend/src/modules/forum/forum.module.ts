import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
import { ForumCategory } from '../../entities/forum-category.entity';
import { ForumTopic } from '../../entities/forum-topic.entity';
import { ForumPost } from '../../entities/forum-post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumCategory, ForumTopic, ForumPost])],
  providers: [ForumService],
  controllers: [ForumController],
})
export class ForumModule {}
