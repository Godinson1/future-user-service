import { IsEmpty, IsUUID, MaxLength, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user_profile_details' })
export class UserProfileDetails {
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

  @Column({ name: 'address', nullable: true, type: 'text' })
  address?: string;

  @Column({ name: 'next_of_kin_name', nullable: true, type: 'text' })
  nextOfKinName?: string;

  @Column({ name: 'next_of_kin_phone_number', nullable: true, type: 'text' })
  nextOfKinPhoneNumber?: string;

  @MaxLength(100)
  @Column({ name: 'next_of_kin_email', nullable: true, type: 'text' })
  nextOfKinEmail?: string;
}
