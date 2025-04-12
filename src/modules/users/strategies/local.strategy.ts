import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';

/**
 * Estratégia Local para autenticação com email e senha
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  /**
   * Valida o email e senha do usuário
   * 
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Promise<User> Usuário autenticado
   */
  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    return user;
  }
} 