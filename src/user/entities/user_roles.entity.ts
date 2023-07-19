import { IsEmpty, IsUUID, MaxLength } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user_roles' })
export class UserRoles {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id: string;

  @MaxLength(10)
  @Column({ name: 'role_description', nullable: false, type: 'text' })
  roleDescription?: string;
}
