import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ForumCategory } from './forum-category.entity';
import { User } from './user.entity';
import { ForumPost } from './forum-post.entity';

@Entity('forum_topics')
export class ForumTopic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'category_id' })
  categoryId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Column({ name: 'is_locked', default: false })
  isLocked: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => ForumCategory, (cat) => cat.topics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: ForumCategory;

  @ManyToOne(() => User, (user) => user.forumTopics, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => ForumPost, (post) => post.topic)
  posts: ForumPost[];

  // Ảo: số bài viết/trả lời, gán qua loadRelationCountAndMap
  replyCount?: number;
}
