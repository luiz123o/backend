import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para autenticação com JWT refresh token
 * 
 * Utiliza a estratégia JWT refresh para autenticar requisições de refresh token
 */
@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh') {} 