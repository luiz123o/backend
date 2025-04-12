import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserStatus } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';

/**
 * Estratégia JWT para autenticação
 * 
 * Valida o token JWT e carrega o usuário associado
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  /**
   * Método chamado quando o token JWT é validado
   * 
   * @param payload Payload do token JWT
   * @returns Promise<User> Usuário autenticado
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: id } = payload;
    const user = await this.userRepository.findById(id);

    // Verifica se o usuário existe e está ativo
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }

    return user;
  }
} 