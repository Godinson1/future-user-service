import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { HashingAlgorithm } from '../entities/hashing_algorithm.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
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

export interface IFileDto {
  key: string;
  buffer: Buffer;
  mimetype: string;
}
