import { ApiProperty } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';

/**
 * DTO para resposta de tokens de autenticação
 */
export class AuthTokensDto {
  /**
   * Token de acesso JWT
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  @ApiProperty({
    description: 'Token de acesso JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  /**
   * Token de refresh para renovar o token de acesso
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  @ApiProperty({
    description: 'Token de refresh para renovar o token de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  /**
   * Tempo de expiração do token de acesso em segundos
   * @example 3600
   */
  @ApiProperty({
    description: 'Tempo de expiração do token de acesso em segundos',
    example: 3600,
  })
  expiresIn: number;
}

/**
 * DTO para dados básicos de usuário em respostas de autenticação
 */
export class UserAuthDto {
  /**
   * ID único do usuário
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  @ApiProperty({
    description: 'ID único do usuário',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  /**
   * Nome completo do usuário
   * @example "João Silva"
   */
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  /**
   * Email do usuário
   * @example "joao@example.com"
   */
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  email: string;

  /**
   * Papel do usuário no sistema
   * @example "user"
   */
  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  /**
   * Status atual do usuário
   * @example "active"
   */
  @ApiProperty({
    description: 'Status atual do usuário',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  /**
   * Indicador se o email foi verificado
   * @example true
   */
  @ApiProperty({
    description: 'Indicador se o email foi verificado',
    example: true,
  })
  emailVerified: boolean;
}

/**
 * DTO para resposta completa de login
 */
export class LoginResponseDto {
  /**
   * Informações do usuário autenticado
   */
  @ApiProperty({
    description: 'Informações do usuário autenticado',
    type: UserAuthDto,
  })
  user: UserAuthDto;

  /**
   * Tokens de autenticação
   */
  @ApiProperty({
    description: 'Tokens de autenticação',
    type: AuthTokensDto,
  })
  tokens: AuthTokensDto;
}

/**
 * DTO para resposta de refresh token
 */
export class RefreshTokenResponseDto {
  /**
   * Tokens de autenticação atualizados
   */
  @ApiProperty({
    description: 'Tokens de autenticação atualizados',
    type: AuthTokensDto,
  })
  tokens: AuthTokensDto;
} 