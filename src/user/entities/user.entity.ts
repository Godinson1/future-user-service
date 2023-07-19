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
import { UserProfileDetails } from './user_profile_details.entity';
import { UserRoles } from './user_roles.entity';
import { UserType } from 'src/constants';

@Entity({ name: 'user_profiles' })
export class UserProfile {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id?: string;

  @MaxLength(10)
  @Column({ name: 'future_id', nullable: false, unique: true, type: 'text' })
  futureId?: string;

  @IsDate()
  @CreateDateColumn({ name: 'created_date' })
  createdDate?: Date;

  @IsDate()
  @UpdateDateColumn({ name: 'updated_date' })
  updatedDate?: Date;

  @Column({ name: 'first_name', nullable: true, type: 'text' })
  firstName?: string;

  @Column({ name: 'last_name', nullable: true, type: 'text' })
  lastName?: string;

  @Column({ name: 'username', nullable: true, type: 'text' })
  username?: string;

  @MaxLength(100)
  @Column({ name: 'email', nullable: true, unique: true, type: 'text' })
  email?: string;

  @Column({ name: 'phone_number', nullable: true, unique: true })
  phoneNumber?: string;

  @Column({ name: 'profile_photo', nullable: true, type: 'text' })
  profilePhoto?: string;

  @Column({ name: 'country', nullable: true, type: 'text' })
  country?: string;

  @Column({ name: 'gender', nullable: true, type: 'text' })
  gender?: string;

  @Column({ name: 'type', nullable: true, type: 'text', default: UserType.User })
  type?: string;

  @Column({ name: 'date_of_birth', nullable: true, type: 'text' })
  dateOfBirth?: Date;

  @Column({ name: 'active', nullable: true, type: 'text', default: false })
  active?: string;

  @Column({ name: 'is_deleted', nullable: true, type: 'text', default: false })
  isDeleted?: string;

  @ManyToOne(() => UserRoles, (role) => role.id, { nullable: true })
  role?: UserRoles;

  @OneToOne(() => UserProfileDetails, { cascade: true })
  @JoinColumn()
  details?: UserProfileDetails;
}
