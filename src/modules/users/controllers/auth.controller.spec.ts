import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { AuthController } from './auth.controller';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let configService: ConfigService;

  const mockAuthService = {
    login: jest.fn(),
    refreshTokens: jest.fn(),
    googleLogin: jest.fn(),
    appleLogin: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    googleId: 'google-id-123',
    appleId: 'apple-id-123',
    emailVerified: true,
    password: 'hashedPassword',
    profilePicture: null,
    firstName: null,
    lastName: null,
    verificationToken: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    passwordChangedAt: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
    isPasswordResetTokenExpired: jest.fn(),
  } as User;

  const mockLoginResponse = {
    user: {
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      role: mockUser.role,
      status: mockUser.status,
      emailVerified: mockUser.emailVerified,
    },
    tokens: {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 3600,
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return result', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' };
      mockAuthService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockLoginResponse);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshTokens and return result', async () => {
      const req = {
        user: {
          refreshToken: 'refresh-token',
        },
      };
      const tokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
      };
      mockAuthService.refreshTokens.mockResolvedValue(tokens);

      const result = await controller.refreshToken(req, mockUser);

      expect(authService.refreshTokens).toHaveBeenCalledWith(
        'refresh-token',
        mockUser.id,
      );
      expect(result).toEqual(tokens);
    });
  });

  describe('googleAuth', () => {
    it('should just exist as method to initiate OAuth flow', () => {
      expect(controller.googleAuth()).toBeUndefined();
    });
  });

  describe('googleAuthRedirect', () => {
    it('should call authService.googleLogin and redirect with tokens', async () => {
      const req = { user: mockUser };
      const res = { redirect: jest.fn() };
      mockAuthService.googleLogin.mockResolvedValue(mockLoginResponse);
      mockConfigService.get.mockReturnValue('http://localhost:3000');

      await controller.googleAuthRedirect(req, res as any);

      expect(authService.googleLogin).toHaveBeenCalledWith(mockUser);
      expect(configService.get).toHaveBeenCalledWith('frontend.url');
      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/social-login-success?access_token=access-token&refresh_token=refresh-token',
      );
    });

    it('should use default frontend URL if not configured', async () => {
      const req = { user: mockUser };
      const res = { redirect: jest.fn() };
      mockAuthService.googleLogin.mockResolvedValue(mockLoginResponse);
      mockConfigService.get.mockReturnValue(null);

      await controller.googleAuthRedirect(req, res as any);

      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/social-login-success?access_token=access-token&refresh_token=refresh-token',
      );
    });
  });

  describe('appleAuth', () => {
    it('should just exist as method to initiate OAuth flow', () => {
      expect(controller.appleAuth()).toBeUndefined();
    });
  });

  describe('appleAuthRedirect', () => {
    it('should call authService.appleLogin and redirect with tokens', async () => {
      const req = { user: mockUser };
      const res = { redirect: jest.fn() };
      mockAuthService.appleLogin.mockResolvedValue(mockLoginResponse);
      mockConfigService.get.mockReturnValue('http://localhost:3000');

      await controller.appleAuthRedirect(req, res as any);

      expect(authService.appleLogin).toHaveBeenCalledWith(mockUser);
      expect(configService.get).toHaveBeenCalledWith('frontend.url');
      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/social-login-success?access_token=access-token&refresh_token=refresh-token',
      );
    });

    it('should use default frontend URL if not configured', async () => {
      const req = { user: mockUser };
      const res = { redirect: jest.fn() };
      mockAuthService.appleLogin.mockResolvedValue(mockLoginResponse);
      mockConfigService.get.mockReturnValue(null);

      await controller.appleAuthRedirect(req, res as any);

      expect(res.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/social-login-success?access_token=access-token&refresh_token=refresh-token',
      );
    });
  });

  describe('logout', () => {
    it('should return success message on logout', async () => {
      const result = await controller.logout();
      expect(result).toEqual({ message: 'Logout bem-sucedido' });
    });
  });
}); 