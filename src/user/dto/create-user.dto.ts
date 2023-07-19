import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { HashingAlgorithm } from '../entities/hashing_algorithm.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}

export class PasswordInfo {
  salt: string;
  passwordHash: string;
  hashingAlgorithm: HashingAlgorithm;
}
