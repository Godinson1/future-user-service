import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserLoginData } from '../entities/user_login_data.entity';

@Injectable()
export class UserLoginRepository extends Repository<UserLoginData> {
  constructor(private dataSource: DataSource) {
    super(UserLoginData, dataSource.createEntityManager());
  }

  async getById(id: string) {
    return this.findOne({ where: { id } });
  }
}
