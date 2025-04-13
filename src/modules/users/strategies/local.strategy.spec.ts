import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  // Mock para o AuthService
  const mockAuthService = {
    validateUser: jest.fn(),
  };

  // Mock de usuário para testes
  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);

    // Limpa os mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user when credentials are valid', async () => {
      // Arrange
      mockAuthService.validateUser.mockResolvedValue(mockUser);
      const email = 'test@example.com';
      const password = 'password123';

      // Act
      const result = await strategy.validate(email, password);

      // Assert
      expect(result).toEqual(mockUser);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      // Arrange
      mockAuthService.validateUser.mockResolvedValue(null);
      const email = 'wrong@example.com';
      const password = 'wrongpassword';

      // Act & Assert
      await expect(strategy.validate(email, password)).rejects.toThrow(UnauthorizedException);
      expect(authService.validateUser).toHaveBeenCalledWith(email, password);
    });
  });
}); 