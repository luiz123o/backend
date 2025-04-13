import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let userRepository: UserRepository;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  const mockUserRepository = {
    findById: jest.fn(),
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
        JwtStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
    configService = module.get<ConfigService>(ConfigService);

    // Limpar os mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return a user object when payload is valid', async () => {
      // Arrange
      const payload: JwtPayload = { sub: '1', email: 'test@example.com', role: UserRole.USER };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await strategy.validate(payload);

      // Assert
      expect(result).toEqual(mockUser);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const payload: JwtPayload = { sub: '999', email: 'nonexistent@example.com', role: UserRole.USER };
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith('999');
    });

    it('should throw UnauthorizedException when user is not active', async () => {
      // Arrange
      const inactiveUser = { ...mockUser, status: UserStatus.INACTIVE };
      const payload: JwtPayload = { sub: '1', email: 'test@example.com', role: UserRole.USER };
      mockUserRepository.findById.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });
  });
}); 