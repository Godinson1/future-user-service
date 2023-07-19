import { IsEmpty, IsUUID, MaxLength, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserProfile } from './user.entity';
import { HashingAlgorithm } from './hashing_algorithm.entity';

@Entity({ name: 'user_login_data' })
export class UserLoginData {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id?: string;

  @OneToOne(() => UserProfile)
  @JoinColumn()
  user?: UserProfile;

  @IsDate()
  @CreateDateColumn({ name: 'created_date' })
  createdDate?: Date;

  @IsDate()
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate?: Date;

  @IsDate()
  @CreateDateColumn({ name: 'token_generation_time' })
  tokenGenerationTime?: Date;

  @Column({ name: 'confirmation_token', nullable: true, type: 'text' })
  confirmationToken?: string;

  @Column({ name: 'password_hash', nullable: true, type: 'text' })
  passwordHash?: string;

  @Column({ name: 'password_salt', nullable: true, type: 'text' })
  passwordSalt?: string;

  @ManyToOne(() => HashingAlgorithm)
  hashAlgorithm?: HashingAlgorithm;

  @Column({ name: 'username', nullable: true, type: 'text' })
  username?: string;

  @MaxLength(100)
  @Column({ name: 'email', nullable: true, unique: true, type: 'text' })
  email?: string;

  @Column({ name: 'phone_number', nullable: true, unique: true })
  phoneNumber?: string;

  @Column({ name: 'email_validation_status_id', nullable: true, type: 'text' })
  emailValidationStatusId?: string;

  @Column({ name: 'password_recovery_token', nullable: true, type: 'text' })
  passwordRecoveryToken?: string;

  @Column({ name: 'recovery_token_time', nullable: true, type: 'text' })
  recoveryTokenTime?: string;
}
