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
import { PoemAnnotation } from './poem-annotation.entity';

@Entity('annotations')
export class Annotation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  keyword: string;

  @Column({ type: 'text' })
  explanation: string;

  @Column({ length: 50, default: 'vocabulary' })
  type: string;

  @Column({ length: 255, nullable: true })
  source: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => PoemAnnotation, (pa) => pa.annotation)
  poemAnnotations: PoemAnnotation[];
}
