import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Poem } from './poem.entity';
import { Annotation } from './annotation.entity';

@Entity('poem_annotations')
export class PoemAnnotation {
  @PrimaryColumn({ name: 'poem_id' })
  poemId: number;

  @PrimaryColumn({ name: 'annotation_id' })
  annotationId: number;

  @ManyToOne(() => Poem, (poem) => poem.poemAnnotations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poem_id' })
  poem: Poem;

  @ManyToOne(() => Annotation, (annotation) => annotation.poemAnnotations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'annotation_id' })
  annotation: Annotation;
}
