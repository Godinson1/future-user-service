import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, IFileDto } from '../dto/create-user.dto';
import { UserRepository } from '../repositories/user.repository';
import { UserLoginRepository } from '../repositories/user-login.repository';
import { UserProfile } from '../entities/user.entity';
import { UserLoginData } from '../entities/user_login_data.entity';
import { UserProfileDetails } from '../entities/user_profile_details.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getS3Url } from 'src/shared/utils';

@Injectable()
export class UserService {
  private readonly s3Region = this.configService.getOrThrow('AWS_S3_REGION');
  private readonly s3Client = new S3Client({ region: this.s3Region });

  constructor(
    private readonly userRepository: UserRepository,
    private readonly userLoginRepository: UserLoginRepository,
    private readonly configService: ConfigService,
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

  async updateProfilePhoto(user: UserProfile, fileArg: IFileDto): Promise<UserProfile> {
    const { key, buffer, mimetype } = fileArg;
    const Bucket = this.configService.get('AWS_S3_PROFILE_BUCKET');
    const foundUser = await this.getById(user.id);
    await this.s3Client.send(
      new PutObjectCommand({ Key: key, Bucket, Body: buffer, ContentType: mimetype }),
    );
    foundUser.profilePhoto = getS3Url(Bucket, key);
    return this.userRepository.save(foundUser);
  }

  async generateUserAccount(request: CreateUserDto): Promise<UserProfile> {
    const { firstName, lastName, email, phoneNumber } = request;
    const userDetails = new UserProfileDetails({});
    const futureId = this.generateFutureId();
    const user = new UserProfile({
      firstName: firstName,
      lastName: lastName,
      email: email,
      futureId: futureId,
      phoneNumber: phoneNumber,
      details: userDetails,
    });
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
