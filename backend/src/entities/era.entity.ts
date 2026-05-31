import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from './author.entity';
import { Poem } from './poem.entity';

@Entity('eras')
export class Era {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'start_year', type: 'int', nullable: true })
  startYear: number;

  @Column({ name: 'end_year', type: 'int', nullable: true })
  endYear: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Author, (author) => author.era)
  authors: Author[];

  @OneToMany(() => Poem, (poem) => poem.era)
  poems: Poem[];
}
