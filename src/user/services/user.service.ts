import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserLoginRepository } from '../repositories/user-login.repository';
import { UserProfile } from '../entities/user.entity';
import { UserLoginData } from '../entities/user_login_data.entity';
import { UserProfileDetails } from '../entities/user_profile_details.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoginRepository: UserLoginRepository,
  ) {}

  async getById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  async createUser(user: UserProfile): Promise<UserProfile> {
    return this.userRepository.save(user);
  }

  async createUserLoginData(user: UserLoginData): Promise<UserProfile> {
    return this.userLoginRepository.save(user);
  }

  async generateUserAccount(request: CreateUserDto): Promise<UserProfile> {
    const { firstName, lastName, email, phoneNumber } = request;
    const user = new UserProfile();
    const userDetails = new UserProfileDetails();
    const futureId = this.generateFutureId();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.futureId = futureId;
    user.phoneNumber = phoneNumber;
    user.details = userDetails;
    return user;
  }

  private generateFutureId(): string {
    return Buffer.from(Math.random().toString()).toString('base64').substring(10, 16).toUpperCase();
  }

  async validateCreateUserRequest(request: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: request.email }, { phoneNumber: request.phoneNumber }],
    });
    if (user) {
      throw new UnprocessableEntityException('Email or Phone Number already exists.');
    }
  }

  async validateUser(email: string, password: string): Promise<UserProfile> {
    const userLoginData = await this.userLoginRepository.findOne({
      where: { email },
      relations: { user: true },
    });
    if (!userLoginData) throw new NotFoundException('User not found!');
    const passwordIsValid = await bcrypt.compare(password, userLoginData.passwordHash);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return this.userRepository.getById(userLoginData.user.id);
  }

  async updateUser(id: string, updateRequest: Partial<UserProfile>) {
    const user = await this.getById(id);
    user.firstName = updateRequest.firstName;
    user.lastName = updateRequest.lastName;
    return this.userRepository.save(user);
  }

  removeUser(id: string) {
    return this.userRepository.remove({ id });
  }
}
