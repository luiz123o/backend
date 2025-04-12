import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Profile } from 'passport-google-oauth20';
import { UserRole, UserStatus } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { GoogleStrategy } from './google.strategy';

describe('GoogleStrategy', () => {
  let strategy: GoogleStrategy;
  let configService: ConfigService;
  let userRepository: UserRepository;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'oauth.google.clientId':
          return 'google-client-id';
        case 'oauth.google.clientSecret':
          return 'google-client-secret';
        case 'oauth.google.callbackUrl':
          return 'http://localhost:3000/auth/google/callback';
        default:
          return null;
      }
    }),
  };

  const mockUserRepository = {
    findByEmail: jest.fn(),
    save: jest.fn(),
  };

  const mockGoogleProfile = {
    id: 'google-id-123',
    displayName: 'Test User',
    name: {
      givenName: 'Test',
      familyName: 'User',
    },
    emails: [{ value: 'testuser@gmail.com', verified: true }],
    photos: [{ value: 'https://lh3.googleusercontent.com/photo.jpg' }],
    provider: 'google',
    _raw: '{}',
    _json: {},
    profileUrl: 'https://plus.google.com/123456789',
  } as Profile;

  class MockUser {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string | null;
    status?: UserStatus;
    role?: UserRole;
    googleId?: string;
    emailVerified?: boolean;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleStrategy,
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

    strategy = module.get<GoogleStrategy>(GoogleStrategy);
    configService = module.get<ConfigService>(ConfigService);
    userRepository = module.get<UserRepository>(UserRepository);

    (global as any).User = MockUser;

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return existing user if found by email', async () => {
      const existingUser = {
        id: 'user-id-123',
        email: 'testuser@gmail.com',
        googleId: null,
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      mockUserRepository.save.mockResolvedValue({
        ...existingUser,
        googleId: 'google-id-123',
      });

      const result = await strategy.validate(
        'access-token-123',
        'refresh-token-123',
        mockGoogleProfile,
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('testuser@gmail.com');
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        ...existingUser,
        googleId: 'google-id-123',
      });
    });

    it('should create new user if not found by email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      
      const newUser = {
        id: 'new-user-id',
        email: 'testuser@gmail.com',
        firstName: 'Test',
        lastName: 'User',
        profilePicture: 'https://lh3.googleusercontent.com/photo.jpg',
        status: UserStatus.ACTIVE,
        role: UserRole.USER,
        googleId: 'google-id-123',
        emailVerified: true,
      };
      
      mockUserRepository.save.mockImplementation((user) => {
        return {
          ...user,
          id: 'new-user-id',
        };
      });

      const result = await strategy.validate(
        'access-token-123',
        'refresh-token-123',
        mockGoogleProfile,
      );

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('testuser@gmail.com');
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('email', 'testuser@gmail.com');
      expect(result).toHaveProperty('firstName', 'Test');
      expect(result).toHaveProperty('lastName', 'User');
      expect(result).toHaveProperty('googleId', 'google-id-123');
    });

    it('should update existing user with googleId if not already set', async () => {
      const existingUser = {
        id: 'user-id-123',
        email: 'testuser@gmail.com',
        googleId: null,
      };

      mockUserRepository.findByEmail.mockResolvedValue(existingUser);
      const updatedUser = {
        ...existingUser,
        googleId: 'google-id-123',
      };
      mockUserRepository.save.mockResolvedValue(updatedUser);

      const result = await strategy.validate(
        'access-token-123',
        'refresh-token-123',
        mockGoogleProfile,
      );

      expect(existingUser.googleId).toBe('google-id-123');
      expect(mockUserRepository.save).toHaveBeenCalled();
      expect(result!.googleId).toBe('google-id-123');
    });

    it('should throw error if no email is found in the profile', async () => {
      const profileWithoutEmail = {
        ...mockGoogleProfile,
        emails: [],
      };

      await expect(
        strategy.validate('access-token-123', 'refresh-token-123', profileWithoutEmail),
      ).rejects.toThrow('Email não encontrado no perfil do Google');
    });
  });
}); 