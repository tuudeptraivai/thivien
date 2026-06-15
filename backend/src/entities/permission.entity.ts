import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

/** Nhóm hệ thống của một quyền (phân loại cấp cao). */
export enum SystemModule {
  BUSINESS = 'BUSINESS',
  SYSTEM_MANAGEMENT = 'SYSTEM_MANAGEMENT',
  OTHER = 'OTHER',
}

@Entity('permissions')
@Index('UQ_permissions_method_path', ['method', 'apiPath'], { unique: true })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  /** Tên quyền hiển thị, vd: "Xem danh sách thơ" */
  @Column({ length: 150 })
  name: string;

  /** Đường dẫn API, vd: "/poems" hoặc "/poems/:id" */
  @Column({ name: 'api_path', length: 191 })
  apiPath: string;

  /** Phương thức HTTP: GET / POST / PUT / PATCH / DELETE */
  @Column({ length: 10, default: 'GET' })
  method: string;

  /** Nhóm chức năng (label), vd: "Quản lý thơ" */
  @Column({ length: 100 })
  module: string;

  /** Phân loại hệ thống cấp cao */
  @Column({
    name: 'system_module',
    type: 'varchar',
    length: 30,
    default: SystemModule.BUSINESS,
  })
  systemModule: SystemModule;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
