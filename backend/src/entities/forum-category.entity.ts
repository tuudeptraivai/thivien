import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ForumTopic } from './forum-topic.entity';

@Entity('forum_categories')
export class ForumCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150, unique: true })
  name: string;

  @Column({ length: 150, unique: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => ForumTopic, (topic) => topic.category)
  topics: ForumTopic[];
}
