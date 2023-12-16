import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEmpty, IsDate, IsUUID } from 'class-validator';

export class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id?: string;

  @IsDate()
  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date;

  @IsDate()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  constructor(entity: Partial<T>) {
    Object.assign(this, entity);
  }
}
