import { IsEmpty, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'permissions' })
export class Permissions {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id: string;

  @Column({ name: 'permission_description', nullable: false, type: 'text' })
  permissionDescription?: string;
}
