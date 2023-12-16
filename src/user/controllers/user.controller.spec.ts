import { Test, TestingModule } from '@nestjs/testing';
import { userFactory } from 'src/__mocks__/factories';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';

const user = userFactory.build();

const mockUserService = {
  validateCreateUserRequest: jest.fn(() => true),
  generateUserAccount: jest.fn(() => user),
  createUser: jest.fn(() => user),
  generateLoginData: jest.fn(() => user),
  createUserLoginData: jest.fn(() => user),
};

describe('User Controller', () => {
  let userController: UserController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = app.get<UserController>(UserController);
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
      const res = await userController.create(input);
      expect(mockUserService.createUser).toHaveBeenCalledWith(input);
      expect(res).toEqual(user);
    });
  });
});
