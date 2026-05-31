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
import { ForumTopic } from './forum-topic.entity';
import { User } from './user.entity';

@Entity('forum_posts')
export class ForumPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'topic_id' })
  topicId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => ForumTopic, (topic) => topic.posts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topic_id' })
  topic: ForumTopic;

  @ManyToOne(() => User, (user) => user.forumPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ForumPost, (post) => post.replies, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: ForumPost;

  @OneToMany(() => ForumPost, (post) => post.parent)
  replies: ForumPost[];
}
