import { MaxLength } from 'class-validator';
import { Column, Entity } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'user_profile_details' })
export class UserProfileDetails extends AbstractEntity<UserProfileDetails> {
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
