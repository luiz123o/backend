import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para autenticação JWT
 * 
 * Utiliza a estratégia JWT para autenticar requisições
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {} 