import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserProfile } from '../../user/entities/user.entity';

import { HashingAlgorithm } from 'src/user/entities/hashing_algorithm.entity';
import { CreateUserDto, PasswordInfo } from 'src/user/dto/create-user.dto';
import { UserLoginData } from 'src/user/entities/user_login_data.entity';
import { UserService } from 'src/user/services/user.service';
import { UserCreatedDto } from '../dto/auth.dto';
import { UserDto } from 'future-connectors';

export interface TokenPayload {
  userId: string;
}

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private datasource: DataSource,
  ) {}

  async login(user: UserProfile, response: Response): Promise<Response> {
    const tokenPayload: TokenPayload = { userId: user.id };
    const token = this.jwtService.sign(tokenPayload);

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this.configService.get('JWT_EXPIRATION'));

    response.status(200);
    return response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  logout(response: Response): Response {
    return response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  async createUser(request: CreateUserDto, response: Response): Promise<UserProfile> {
    await this.userService.validateCreateUserRequest(request);
    const userAccount = await this.userService.generateUserAccount(request);
    const user = await this.userService.createUser(userAccount);
    await this.generateLoginData(request, user);
    await this.login(user, response);
    return user;
  }

  private async generateLoginData(
    request: CreateUserDto,
    user: UserProfile,
  ): Promise<UserLoginData> {
    const { email, phoneNumber, password } = request;
    const { passwordHash, salt, hashingAlgorithm } = await this.generatePasswordInfo(password);
    const userLoginData = new UserLoginData({
      email: email,
      phoneNumber: phoneNumber,
      passwordHash: passwordHash,
      passwordSalt: salt,
      hashAlgorithm: hashingAlgorithm,
      user,
    });
    const loginData = await this.userService.createUserLoginData(userLoginData);
    return loginData;
  }

  private async generatePasswordInfo(password: string): Promise<PasswordInfo> {
    const salt = await bcrypt.genSaltSync(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const hashingAlgorithm = await this.getHashingAlgorithm('SHA-12');
    return { salt, passwordHash, hashingAlgorithm };
  }

  setHashingAlgorithm(algorithmName: string): Promise<HashingAlgorithm> {
    const hashingAlgorithm = new HashingAlgorithm();
    hashingAlgorithm.algorithmName = algorithmName;
    return this.datasource.manager.save(hashingAlgorithm);
  }

  getHashingAlgorithm(algorithmName: string): Promise<HashingAlgorithm> {
    return this.datasource.manager.findOne(HashingAlgorithm, {
      where: { algorithmName },
    });
  }

  generateUserCreatedNotificationArg(user: UserProfile): UserCreatedDto {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      futureId: user.futureId,
    };
  }

  authUserResponse(user: UserProfile): UserDto {
    const { id, futureId, email, phoneNumber, firstName, lastName, username, active } = user;
    return {
      id,
      futureId,
      email,
      phoneNumber,
      firstName,
      lastName,
      username,
      active,
    };
  }
}
