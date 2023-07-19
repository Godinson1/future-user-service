import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserProfile } from '../entities/user.entity';

@Injectable()
export class UserRepository extends Repository<UserProfile> {
  constructor(private dataSource: DataSource) {
    super(UserProfile, dataSource.createEntityManager());
  }

  async getById(id: string) {
    return this.findOne({ where: { id } });
  }
}
