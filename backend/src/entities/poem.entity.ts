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
import { Author } from './author.entity';
import { PoemCategory } from './poem-category.entity';
import { Era } from './era.entity';
import { PoemVersion } from './poem-version.entity';
import { User } from './user.entity';
import { Comment } from './comment.entity';
import { Bookmark } from './bookmark.entity';
import { PoemAnnotation } from './poem-annotation.entity';

export enum PoemStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PUBLISHED = 'published',
}

@Entity('poems')
export class Poem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

  @Column({ name: 'era_id', nullable: true })
  eraId: number;

  @Column({ name: 'source_info', length: 255, nullable: true })
  sourceInfo: string;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'is_member_poem', default: false })
  isMemberPoem: boolean;

  @Column({ type: 'varchar', length: 20, default: PoemStatus.PUBLISHED })
  status: PoemStatus;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Author, (author) => author.poems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToOne(() => PoemCategory, (cat) => cat.poems, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: PoemCategory;

  @ManyToOne(() => Era, (era) => era.poems, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'era_id' })
  era: Era;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => PoemVersion, (version) => version.poem, { cascade: true })
  versions: PoemVersion[];

  @OneToMany(() => Comment, (comment) => comment.poem)
  comments: Comment[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.poem)
  bookmarks: Bookmark[];

  @OneToMany(() => PoemAnnotation, (pa) => pa.poem)
  poemAnnotations: PoemAnnotation[];
}
