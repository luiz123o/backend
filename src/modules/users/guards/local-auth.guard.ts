import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard para autenticação local
 * 
 * Utiliza a estratégia local para autenticar requisições com email e senha
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
 