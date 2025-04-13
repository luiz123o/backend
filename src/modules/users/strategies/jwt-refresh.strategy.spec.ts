import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { RefreshTokenPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;
  let userRepository: UserRepository;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-refresh-secret'),
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
        JwtRefreshStrategy,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
    configService = module.get<ConfigService>(ConfigService);

    // Limpar os mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const mockRequest = {
      body: {
        refreshToken: 'test-refresh-token',
      },
    } as Request;

    it('should return user and refreshToken when valid', async () => {
      // Arrange
      const payload: RefreshTokenPayload = { sub: '1', jti: 'token-id-1' };
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await strategy.validate(mockRequest, payload);

      // Assert
      expect(result).toEqual({
        user: mockUser,
        refreshToken: 'test-refresh-token',
      });
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const payload: RefreshTokenPayload = { sub: '999', jti: 'token-id-2' };
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(strategy.validate(mockRequest, payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith('999');
    });

    it('should throw UnauthorizedException when user is not active', async () => {
      // Arrange
      const inactiveUser = { ...mockUser, status: UserStatus.INACTIVE };
      const payload: RefreshTokenPayload = { sub: '1', jti: 'token-id-3' };
      mockUserRepository.findById.mockResolvedValue(inactiveUser);

      // Act & Assert
      await expect(strategy.validate(mockRequest, payload)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findById).toHaveBeenCalledWith('1');
    });
  });
}); 