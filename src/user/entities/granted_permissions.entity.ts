import { IsEmpty, IsUUID } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Permissions } from './permissions.entity';
import { UserRoles } from './user_roles.entity';

@Entity({ name: 'granted_permissions' })
export class GrantedPermissions {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id: string;

  @ManyToOne(() => Permissions, (permission) => permission.id, {
    nullable: true,
  })
  @Column({ name: 'permission_id', nullable: false, type: 'text' })
  permissionId?: string;

  @ManyToOne(() => UserRoles, (role) => role.id, { nullable: true })
  @Column({ name: 'role_id', nullable: false, type: 'text' })
  roleId?: string;
}
