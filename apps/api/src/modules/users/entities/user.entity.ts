import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { DocumentType } from '@sao-lourenco/shared';
import { Service } from '../../services/entities/service.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 14, unique: true })
  document: string;

  @Column({ name: 'document_type', type: 'varchar', length: 4 })
  documentType: DocumentType;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  whatsapp: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @OneToMany(() => Service, (service) => service.user)
  services: Service[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
