import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserStatus } from '../entities/user.entity';
import { RefreshTokenPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';

/**
 * Estratégia JWT Refresh para validação do refresh token
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  /**
   * Valida o refresh token
   * 
   * @param req Objeto de requisição Express
   * @param payload Payload do refresh token
   * @returns Promise<{ user: User, refreshToken: string }> Usuário e refresh token
   */
  async validate(
    req: Request,
    payload: RefreshTokenPayload,
  ): Promise<{ user: User; refreshToken: string }> {
    const refreshToken = req.body.refreshToken;
    const { sub: id } = payload;

    const user = await this.userRepository.findById(id);

    // Verifica se o usuário existe e está ativo
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }

    // Aqui você pode adicionar lógica adicional para verificar se o token está na lista negra
    // ou executar outras validações específicas para refresh tokens

    return {
      user,
      refreshToken,
    };
  }
} 