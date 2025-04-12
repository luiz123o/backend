import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Se não houver papéis definidos, permitir acesso
    if (!requiredRoles) {
      return true;
    }
    
    // Obtém o usuário da requisição (definido pelo JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();
    
    // Verifica se o usuário possui um dos papéis necessários
    return requiredRoles.some((role) => user.role === role);
  }
} 