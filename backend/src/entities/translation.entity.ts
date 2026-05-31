import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PoemVersion } from './poem-version.entity';
import { Author } from './author.entity';
import { User } from './user.entity';

@Entity('translations')
export class Translation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'poem_version_id' })
  poemVersionId: number;

  @Column({ name: 'translator_id', nullable: true })
  translatorId: number;

  @Column({ name: 'translator_user_id', nullable: true })
  translatorUserId: number;

  @Column({ name: 'translation_title', length: 255, nullable: true })
  translationTitle: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'translation_type', length: 50, default: 'Thơ' })
  translationType: string;

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => PoemVersion, (version) => version.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poem_version_id' })
  poemVersion: PoemVersion;

  @ManyToOne(() => Author, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'translator_id' })
  translator: Author;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'translator_user_id' })
  translatorUser: User;
}
