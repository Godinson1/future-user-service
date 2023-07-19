import { IsEmpty, IsUUID, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user.entity';

@Entity({ name: 'user_login_data_external' })
export class UserLoginDataExternal {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id: string;

  @Column({ name: 'user_id', nullable: false, type: 'text' })
  userId?: UserProfile;

  @IsDate()
  @CreateDateColumn({ name: 'created_date' })
  createdDate?: Date;

  @IsDate()
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate?: Date;

  @Column({ name: 'external_provider_token', nullable: true, type: 'text' })
  externalProviderToken?: string;
}
