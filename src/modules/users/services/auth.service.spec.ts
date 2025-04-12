import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from '../dtos/auth.dto';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from './auth.service';

// Mock para a entidade User
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: UserRole.USER,
  status: UserStatus.ACTIVE,
  emailVerified: true,
  verificationToken: null,
  passwordResetToken: null,
  passwordResetExpires: null,
  lastLoginAt: null,
  passwordChangedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  validatePassword: jest.fn(),
  isPasswordResetTokenExpired: jest.fn(),
  hashPassword: jest.fn(),
} as unknown as User;

// Mock para UserRepository
const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByVerificationToken: jest.fn(),
  findByPasswordResetToken: jest.fn(),
  save: jest.fn(),
};

// Mock para JwtService
const mockJwtService = {
  signAsync: jest.fn(),
};

// Mock para ConfigService
const mockConfigService = {
  get: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);

    // Reset para os mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return a user if credentials are valid and user is active', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (mockUser.validatePassword as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password123');
      expect(result).toEqual(mockUser);
      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should return null if user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent@example.com', 'password123');
      expect(result).toBeNull();
    });

    it('should return null if password is invalid', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      (mockUser.validatePassword as jest.Mock).mockResolvedValue(false);

      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should throw UnauthorizedException if user is not active', async () => {
      const inactiveUser = { ...mockUser, status: UserStatus.INACTIVE };
      mockUserRepository.findByEmail.mockResolvedValue(inactiveUser);
      (mockUser.validatePassword as jest.Mock).mockResolvedValue(true);

      await expect(service.validateUser('test@example.com', 'password123')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return tokens and user data if login is successful', async () => {
      // Mock validateUser
      const validateUserSpy = jest.spyOn(service, 'validateUser').mockResolvedValue(mockUser);
      
      // Mock generateTokens (privado, então temos que usar qualquer técnica)
      const tokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      };
      (service as any).generateTokens = jest.fn().mockResolvedValue(tokens);

      const result = await service.login(loginDto);

      expect(validateUserSpy).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(userRepository.save).toHaveBeenCalled();
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          status: mockUser.status,
          emailVerified: mockUser.emailVerified,
        },
        tokens,
      });
      expect(mockUser.lastLoginAt).toBeInstanceOf(Date);
    });

    it('should throw UnauthorizedException if validateUser returns null', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshTokens', () => {
    it('should return new tokens if refresh token is valid', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);
      
      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      };
      (service as any).generateTokens = jest.fn().mockResolvedValue(tokens);

      const result = await service.refreshTokens('refresh-token', '1');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(tokens);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.refreshTokens('refresh-token', '999')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not active', async () => {
      const inactiveUser = { ...mockUser, status: UserStatus.INACTIVE };
      mockUserRepository.findById.mockResolvedValue(inactiveUser);

      await expect(service.refreshTokens('refresh-token', '1')).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    it('should set reset token and expiration for a valid user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await service.forgotPassword(forgotPasswordDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(forgotPasswordDto.email);
      expect(userRepository.save).toHaveBeenCalled();
      expect(mockUser.passwordResetToken).toBeTruthy();
      expect(mockUser.passwordResetExpires).toBeTruthy();
    });

    it('should do nothing if user is not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await service.forgotPassword(forgotPasswordDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(forgotPasswordDto.email);
      expect(userRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'reset-token',
      password: 'newPassword123',
      passwordConfirmation: 'newPassword123',
    };

    it('should reset password if token is valid and not expired', async () => {
      mockUserRepository.findByPasswordResetToken.mockResolvedValue(mockUser);
      (mockUser.isPasswordResetTokenExpired as jest.Mock).mockReturnValue(false);

      await service.resetPassword(resetPasswordDto);

      expect(userRepository.findByPasswordResetToken).toHaveBeenCalledWith(resetPasswordDto.token);
      expect(mockUser.isPasswordResetTokenExpired).toHaveBeenCalled();
      expect(mockUser.password).toBe(resetPasswordDto.password);
      expect(mockUser.passwordResetToken).toBeNull();
      expect(mockUser.passwordResetExpires).toBeNull();
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      const invalidDto = {
        ...resetPasswordDto,
        passwordConfirmation: 'differentPassword',
      };

      await expect(service.resetPassword(invalidDto)).rejects.toThrow(BadRequestException);
      expect(userRepository.findByPasswordResetToken).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if token is invalid', async () => {
      mockUserRepository.findByPasswordResetToken.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if token is expired', async () => {
      mockUserRepository.findByPasswordResetToken.mockResolvedValue(mockUser);
      (mockUser.isPasswordResetTokenExpired as jest.Mock).mockReturnValue(true);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('verifyEmail', () => {
    it('should verify email and activate user if pending', async () => {
      const pendingUser = { ...mockUser, status: UserStatus.PENDING, emailVerified: false };
      mockUserRepository.findByVerificationToken.mockResolvedValue(pendingUser);

      await service.verifyEmail('verification-token');

      expect(userRepository.findByVerificationToken).toHaveBeenCalledWith('verification-token');
      expect(pendingUser.emailVerified).toBe(true);
      expect(pendingUser.verificationToken).toBeNull();
      expect(pendingUser.status).toBe(UserStatus.ACTIVE);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should verify email but keep status if already active', async () => {
      const user = { ...mockUser, emailVerified: false };
      mockUserRepository.findByVerificationToken.mockResolvedValue(user);

      await service.verifyEmail('verification-token');

      expect(user.emailVerified).toBe(true);
      expect(user.status).toBe(UserStatus.ACTIVE);
      expect(userRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if token is invalid', async () => {
      mockUserRepository.findByVerificationToken.mockResolvedValue(null);

      await expect(service.verifyEmail('invalid-token')).rejects.toThrow(NotFoundException);
    });
  });

  describe('generateTokens (private method)', () => {
    it('should generate access and refresh tokens', async () => {
      // Mock ConfigService.get
      (mockConfigService.get as jest.Mock).mockImplementation((key: string) => {
        switch (key) {
          case 'jwt.secret':
            return 'jwt-secret';
          case 'jwt.refreshSecret':
            return 'refresh-secret';
          case 'jwt.expiration':
            return '1h';
          case 'jwt.refreshExpiration':
            return '7d';
          default:
            return null;
        }
      });

      // Mock JwtService.signAsync
      (mockJwtService.signAsync as jest.Mock).mockImplementation((payload, options) => {
        if (options.secret === 'jwt-secret') {
          return Promise.resolve('access-token');
        }
        if (options.secret === 'refresh-secret') {
          return Promise.resolve('refresh-token');
        }
        return Promise.resolve('');
      });

      const result = await (service as any).generateTokens(mockUser);

      expect(jwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600,
      });
    });
  });

  describe('parseExpirationToSeconds (private method)', () => {
    it('should parse seconds correctly', () => {
      const result = (service as any).parseExpirationToSeconds('30s');
      expect(result).toBe(30);
    });

    it('should parse minutes correctly', () => {
      const result = (service as any).parseExpirationToSeconds('5m');
      expect(result).toBe(300);
    });

    it('should parse hours correctly', () => {
      const result = (service as any).parseExpirationToSeconds('2h');
      expect(result).toBe(7200);
    });

    it('should parse days correctly', () => {
      const result = (service as any).parseExpirationToSeconds('7d');
      expect(result).toBe(604800);
    });

    it('should return default value for invalid format', () => {
      const result = (service as any).parseExpirationToSeconds('invalid');
      expect(result).toBe(3600);
    });
  });

  describe('buildUserResponse (private method)', () => {
    it('should return user auth DTO with correct properties', () => {
      const result = (service as any).buildUserResponse(mockUser);
      
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        status: mockUser.status,
        emailVerified: mockUser.emailVerified,
      });
    });
  });
}); 