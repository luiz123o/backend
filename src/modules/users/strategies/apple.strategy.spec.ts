import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole, UserStatus } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AppleStrategy } from './apple.strategy';

describe('AppleStrategy', () => {
  let strategy: AppleStrategy;
  let configService: ConfigService;
  let userRepository: UserRepository;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'oauth.apple.clientId':
          return 'apple-client-id';
        case 'oauth.apple.teamId':
          return 'apple-team-id';
        case 'oauth.apple.keyId':
          return 'apple-key-id';
        case 'oauth.apple.privateKeyPath':
          return './apple-key.p8';
        case 'oauth.apple.callbackUrl':
          return 'http://localhost:3000/auth/apple/callback';
        default:
          return null;
      }
    }),
  };

  const mockUserRepository = {
    findAll: jest.fn(),
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  const mockAppleProfile = {
    id: 'apple-id-123',
    name: {
      firstName: 'Test',
      lastName: 'User',
    },
    email: 'testuser@icloud.com',
  };

  const mockReq = {
    body: {
      user: {
        name: {
          firstName: 'Test',
          lastName: 'User',
        },
        email: 'testuser@icloud.com',
      },
    },
  };

  // Criar um mock do objeto User para satisfazer o TypeScript
  class MockUser {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    status?: UserStatus;
    role?: UserRole;
    appleId?: string;
    emailVerified?: boolean;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppleStrategy,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    strategy = module.get<AppleStrategy>(AppleStrategy);
    configService = module.get<ConfigService>(ConfigService);
    userRepository = module.get<UserRepository>(UserRepository);

    // Mock do método User para que a estratégia possa criar um novo usuário
    (global as any).User = MockUser;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should find existing user by Apple ID', async () => {
      const existingUser = {
        id: 'user-id-123',
        email: 'testuser@icloud.com',
        appleId: 'apple-id-123',
      };

      mockUserRepository.findAll.mockResolvedValue([[existingUser], 1]);
      
      const done = jest.fn();

      await strategy.validate(
        mockReq,
        'access-token-123',
        'refresh-token-123',
        'id-token-123',
        mockAppleProfile,
        done,
      );

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({ search: 'apple-id-123' });
      expect(done).toHaveBeenCalledWith(null, existingUser);
    });

    it('should find existing user by email if not found by Apple ID', async () => {
      const existingUser = {
        id: 'user-id-123',
        email: 'testuser@icloud.com',
        appleId: null,
      };

      mockUserRepository.findAll.mockResolvedValue([[], 0]);
      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        appleId: 'apple-id-123',
      });
      
      const done = jest.fn();

      await strategy.validate(
        mockReq,
        'access-token-123',
        'refresh-token-123',
        'id-token-123',
        mockAppleProfile,
        done,
      );

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({ search: 'apple-id-123' });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('testuser@icloud.com');
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(done).toHaveBeenCalledWith(null, { ...existingUser, appleId: 'apple-id-123' });
    });

    it('should create new user if not found by Apple ID or email', async () => {
      mockUserRepository.findAll.mockResolvedValue([[], 0]);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      const newUser = {
        id: 'new-user-id',
        email: 'testuser@icloud.com',
        firstName: 'Test',
        lastName: 'User',
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
        appleId: 'apple-id-123',
        emailVerified: true,
      };
      
      mockUserRepository.save.mockImplementation((user) => {
        return {
          ...user,
          id: 'new-user-id',
        };
      });
      
      const done = jest.fn();

      await strategy.validate(
        mockReq,
        'access-token-123',
        'refresh-token-123',
        'id-token-123',
        mockAppleProfile,
        done,
      );

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({ search: 'apple-id-123' });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('testuser@icloud.com');
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(done).toHaveBeenCalled();
      expect(done.mock.calls[0][0]).toBeNull();
      expect(done.mock.calls[0][1]).toHaveProperty('email', 'testuser@icloud.com');
      expect(done.mock.calls[0][1]).toHaveProperty('appleId', 'apple-id-123');
    });

    it('should handle case when Apple profile lacks email info', async () => {
      const profileWithoutEmail = {
        id: 'apple-id-123',
      };
      
      mockUserRepository.findAll.mockResolvedValue([[], 0]);
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      const done = jest.fn();

      await strategy.validate(
        { body: {} },
        'access-token-123',
        'refresh-token-123',
        'id-token-123',
        profileWithoutEmail,
        done,
      );

      expect(mockUserRepository.findAll).toHaveBeenCalledWith({ search: 'apple-id-123' });
      expect(done).toHaveBeenCalledWith(new Error('Email não encontrado no perfil da Apple'), null);
    });

    it('should handle error when Apple ID is missing', async () => {
      const profileWithoutId = {};
      
      const done = jest.fn();

      await strategy.validate(
        mockReq,
        'access-token-123',
        'refresh-token-123',
        'id-token-123',
        profileWithoutId,
        done,
      );

      expect(done).toHaveBeenCalledWith(new Error('ID da Apple não encontrado'), null);
    });

    it('should handle exception during processing', async () => {
      mockUserRepository.findAll.mockRejectedValue(new Error('Database error'));
      
      const done = jest.fn();

      await strategy.validate(
        mockReq,
        'access-token-123',
        'refresh-token-123',
        'id-token-123',
        mockAppleProfile,
        done,
      );

      expect(done).toHaveBeenCalledWith(new Error('Database error'), null);
    });
  });
}); 