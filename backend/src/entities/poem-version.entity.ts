import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Poem } from './poem.entity';
import { Translation } from './translation.entity';

@Entity('poem_versions')
export class PoemVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'poem_id' })
  poemId: number;

  @Column({ name: 'version_name', length: 100, default: 'Bản chuẩn' })
  versionName: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  transcription: string;

  @Column({ type: 'text', nullable: true })
  explanation: string;

  @Column({ name: 'is_primary', default: true })
  isPrimary: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Poem, (poem) => poem.versions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poem_id' })
  poem: Poem;

  @OneToMany(() => Translation, (translation) => translation.poemVersion, { cascade: true })
  translations: Translation[];
}
