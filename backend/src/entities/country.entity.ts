import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Author } from './author.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ name: 'iso_code', length: 10, unique: true, nullable: true })
  isoCode: string;

  @Column({ name: 'flag_url', length: 255, nullable: true })
  flagUrl: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Author, (author) => author.country)
  authors: Author[];
}
