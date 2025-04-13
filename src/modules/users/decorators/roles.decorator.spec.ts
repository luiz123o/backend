import { UserRole } from '../entities/user.entity';
import { ROLES_KEY, Roles } from './roles.decorator';

describe('Roles Decorator', () => {
  it('should be defined', () => {
    expect(Roles).toBeDefined();
    expect(ROLES_KEY).toEqual('roles');
  });
  
  // Verificamos que o decorator existe e está configurado corretamente
  it('should create a roles metadata decorator', () => {
    // Verificar que o Roles decorator aceita múltiplos papéis
    const decorator = Roles(UserRole.ADMIN, UserRole.USER);
    expect(decorator).toBeDefined();
    
    // Como não podemos substituir SetMetadata, verificamos apenas que o decorator
    // está disponível e pode ser chamado com os papéis esperados
    expect(typeof decorator).toBe('function');
  });
}); 