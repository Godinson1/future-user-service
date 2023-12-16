import { Test, TestingModule } from '@nestjs/testing';
import { userFactory } from 'src/__mocks__/factories';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { ConfigService } from '@nestjs/config';
import { UserLoginRepository } from '../repositories/user-login.repository';
import { DataSource } from 'typeorm';

const user = userFactory.build();
const mockUserRepo = { save: jest.fn(() => user) };
const datasourceMock = { createEntityManager: jest.fn() };

describe('User Service', () => {
  let userService: UserService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        UserLoginRepository,
        { provide: ConfigService, useValue: { getOrThrow: jest.fn() } },
        { provide: UserRepository, useValue: mockUserRepo },
        { provide: DataSource, useValue: datasourceMock },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('create(): should create user', async () => {
      const input = {
        email: 'test@gmail.com',
        password: 'dvhve',
        firstName: 'Joe',
        lastName: 'King',
        phoneNumber: '090588499393',
      };
      const res = await userService.createUser(input);
      expect(mockUserRepo.save).toHaveBeenCalledWith(input);
      expect(res).toEqual(user);
    });
  });
});
