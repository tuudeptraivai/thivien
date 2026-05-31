import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
import { ForumTopic } from './forum-topic.entity';
import { ForumPost } from './forum-post.entity';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  POET = 'poet',
  MEMBER = 'member',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255 })
  @Exclude()
  passwordHash: string;

  @Column({ name: 'display_name', length: 100 })
  displayName: string;

  @Column({ name: 'avatar_url', length: 255, nullable: true })
  avatarUrl: string;

  @Column({ type: 'varchar', length: 20, default: UserRole.MEMBER })
  role: UserRole;

  @Column({ name: 'vn_typing_mode', type: 'int', default: 3 })
  vnTypingMode: number;

  @Column({ name: 'theme_preference', length: 20, default: 'system' })
  themePreference: string;

  @Column({ name: 'font_preference', length: 50, default: 'Lora' })
  fontPreference: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user)
  bookmarks: Bookmark[];

  @OneToMany(() => ForumTopic, (topic) => topic.user)
  forumTopics: ForumTopic[];

  @OneToMany(() => ForumPost, (post) => post.user)
  forumPosts: ForumPost[];
}
