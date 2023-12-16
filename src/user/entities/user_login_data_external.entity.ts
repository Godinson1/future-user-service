import { Column, Entity } from 'typeorm';
import { UserProfile } from './user.entity';
import { AbstractEntity } from './abstract.entity';

@Entity({ name: 'user_login_data_external' })
export class UserLoginDataExternal extends AbstractEntity<UserLoginDataExternal> {
  @Column({ name: 'user_id', nullable: false, type: 'text' })
  userId?: UserProfile;

  @Column({ name: 'external_provider_token', nullable: true, type: 'text' })
  externalProviderToken?: string;
}
