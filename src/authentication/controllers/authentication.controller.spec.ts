import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { mockEventEmitter } from '../../shared/tests';
import { AuthController } from './authentication.controller';
import { AuthenticationService } from '../services/authentication.service';
import { userFactory } from 'src/__mocks__/factories';

const user = userFactory.build();
const hashMessage = { message: 'Hash Algorithm set successfully!' };
const authServiceMock = {
  createUser: jest.fn(() => user),
  login: jest.fn(() => user),
  logout: jest.fn(() => ({ message: 'Logged out successfully!' })),
  authUserResponse: jest.fn(() => user),
  generateUserCreatedNotificationArg: jest.fn(() => ({ email: user.email })),
  setHashingAlgorithm: jest.fn(() => hashMessage),
  getHashingAlgorithm: jest.fn(() => hashMessage),
};

const response: any = {
  send: jest.fn().mockImplementation().mockReturnValue(user),
  json: jest.fn().mockImplementation().mockReturnValue(user),
};

describe('Authentication Controller', () => {
  let authController: AuthController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthenticationService, useValue: authServiceMock },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('register(): should register user', async () => {
      const input = {
        email: 'test@gmail.com',
        password: 'dvhve',
        firstName: 'Joe',
        lastName: 'King',
        phoneNumber: '090588499393',
      };
      const res = await authController.register(input, response);
      expect(authServiceMock.createUser).toHaveBeenCalledWith(input, response);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('user.created', { email: user.email });
      expect(authServiceMock.generateUserCreatedNotificationArg).toHaveBeenCalled();
      expect(res).toEqual(user);
    });

    it('login(): should login user', async () => {
      const res = await authController.login(user, response);
      expect(authServiceMock.login).toHaveBeenCalledWith(user, response);
      expect(res).toEqual(user);
    });

    it('logout(): should logout user', async () => {
      const res = await authController.logout(response);
      expect(authServiceMock.logout).toHaveBeenCalledWith(response);
      expect(res).toEqual(user);
    });

    it('sethashingAlgorithm(): should set hashing algorithm for user data', async () => {
      const input = { name: 'SHA123' };
      const res = await authController.sethashingAlgorithm(input);
      expect(authServiceMock.setHashingAlgorithm).toHaveBeenCalledWith(input.name);
      expect(res).toEqual(hashMessage);
    });

    it('gethashingAlgorithm(): should get hashing algorithm for user data', async () => {
      const input = { name: 'SHA123' };
      const res = await authController.gethashingAlgorithm(input);
      expect(authServiceMock.getHashingAlgorithm).toHaveBeenCalledWith(input.name);
      expect(res).toEqual(hashMessage);
    });

    it('validateUser(): should validate user data', async () => {
      const res = await authController.validateUser(user);
      expect(authServiceMock.authUserResponse).toHaveBeenCalledWith(user);
      expect(res).toEqual(user);
    });
  });
});
