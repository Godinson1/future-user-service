import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserProfile } from './entities/user.entity';
import { UserLoginData } from './entities/user_login_data.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { UserLoginRepository } from './repositories/user-login.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserProfile, UserLoginData])],
  controllers: [UserController],
  providers: [UserService, UserRepository, UserLoginRepository],
  exports: [UserService, UserRepository, UserLoginRepository],
})
export class UserModule {}
