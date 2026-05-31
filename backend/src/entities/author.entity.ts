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
import { Country } from './country.entity';
import { Era } from './era.entity';
import { Poem } from './poem.entity';
import { User } from './user.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 150, unique: true })
  slug: string;

  @Column({ name: 'real_name', length: 150, nullable: true })
  realName: string;

  @Column({ name: 'birth_year', length: 50, nullable: true })
  birthYear: string;

  @Column({ name: 'death_year', length: 50, nullable: true })
  deathYear: string;

  @Column({ name: 'country_id', nullable: true })
  countryId: number;

  @Column({ name: 'era_id', nullable: true })
  eraId: number;

  @Column({ type: 'text', nullable: true })
  biography: string;

  @Column({ name: 'portrait_url', length: 255, nullable: true })
  portraitUrl: string;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Country, (country) => country.authors, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Era, (era) => era.authors, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'era_id' })
  era: Era;

  @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'created_by' })
  creator: User;

  @OneToMany(() => Poem, (poem) => poem.author)
  poems: Poem[];
}
