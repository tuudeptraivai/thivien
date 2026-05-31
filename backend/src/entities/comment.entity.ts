import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Poem } from './poem.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'entity_type', length: 20 })
  entityType: string;

  @Column({ name: 'entity_id' })
  entityId: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number;

  @Column({ name: 'guest_name', length: 100, nullable: true })
  guestName: string;

  @Column({ name: 'guest_email', length: 100, nullable: true })
  guestEmail: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ length: 20, default: 'approved' })
  status: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.replies, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  replies: Comment[];

  @ManyToOne(() => Poem, (poem) => poem.comments, { nullable: true })
  @JoinColumn({ name: 'entity_id' })
  poem: Poem;
}
