import { IsEmpty, IsUUID, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'external_providers' })
export class ExternalProviders {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id?: string;

  @IsDate()
  @CreateDateColumn({ name: 'created_date' })
  createdDate?: Date;

  @IsDate()
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate?: Date;

  @Column({ name: 'ws_endpoint', nullable: false, type: 'text' })
  wsEndpoint?: string;

  @Column({ name: 'provider_name', nullable: true, type: 'text' })
  providerName?: string;
}
