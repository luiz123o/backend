import { UserRole } from '../entities/user.entity';

/**
 * Interface para o payload do token JWT
 */
export interface JwtPayload {
  /**
   * ID do usuário
   */
  sub: string;

  /**
   * Email do usuário
   */
  email: string;

  /**
   * Papel do usuário
   */
  role: UserRole;

  /**
   * Data de emissão (timestamp Unix)
   */
  iat?: number;

  /**
   * Data de expiração (timestamp Unix)
   */
  exp?: number;
}

/**
 * Interface para o payload do refresh token
 */
export interface RefreshTokenPayload {
  /**
   * ID do usuário
   */
  sub: string;

  /**
   * ID do token de refresh (para invalidação)
   */
  jti: string;

  /**
   * Data de emissão (timestamp Unix)
   */
  iat?: number;

  /**
   * Data de expiração (timestamp Unix)
   */
  exp?: number;
} 