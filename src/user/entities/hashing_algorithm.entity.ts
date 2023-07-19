import { IsEmpty, IsUUID } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'hashing_algorithm' })
export class HashingAlgorithm {
  @PrimaryGeneratedColumn('uuid')
  @IsEmpty()
  @IsUUID('4')
  id: string;

  @Column({ name: 'algorithm_name', nullable: false, type: 'text' })
  algorithmName?: string;
}
