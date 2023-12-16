import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';

import { AuthenticationService } from './authentication.service';
import { userFactory } from 'src/__mocks__/factories';
import { UserService } from 'src/user/services/user.service';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

const mockUser = userFactory.build();

const mockJwtService = {
  sign: jest.fn(() => 'mockedAccessToken'),
};

const response: any = {
  send: jest.fn().mockImplementation().mockReturnValue(mockUser),
  status: jest.fn().mockImplementation().mockReturnValue(200),
  cookie: jest.fn().mockImplementation().mockReturnValue(true),
  json: jest.fn().mockImplementation().mockReturnValue(null),
};

const mockUserService = {
  validateCreateUserRequest: jest.fn(() => true),
  generateUserAccount: jest.fn(() => mockUser),
  createUser: jest.fn(() => mockUser),
  generateLoginData: jest.fn(() => mockUser),
  createUserLoginData: jest.fn(() => mockUser),
};

const datasourceMock = {
  manager: {
    findOne: jest.fn(() => true),
    createEntityManager: jest.fn(),
    getRepository: jest.fn().mockReturnValue({
      save: jest.fn((userData) => ({ ...mockUser, ...userData })),
      softDelete: jest.fn(() => Promise.resolve()),
      findOne: jest.fn((query) => {
        if (query.where.id === '12345') {
          return mockUser;
        }
        return undefined;
      }),
      find: jest.fn(() => [mockUser]),
    }),
  },
};

describe('Authentication Service', () => {
  let authService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        ConfigService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
        { provide: DataSource, useValue: datasourceMock },
      ],
    }).compile();

    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(authService).toBeDefined();
    });

    it('should create user', async () => {
      const input = {
        email: 'test@gmail.com',
        password: 'dvhve',
        firstName: 'Joe',
        lastName: 'King',
        phoneNumber: '090588499393',
      };
      const result = await authService.createUser(input, response);
      expect(mockUserService.validateCreateUserRequest).toHaveBeenCalledWith(input);
      expect(mockUserService.generateUserAccount).toHaveBeenCalledWith(input);
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
