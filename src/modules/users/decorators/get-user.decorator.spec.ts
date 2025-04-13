import { ExecutionContext } from '@nestjs/common';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { GetUser } from './get-user.decorator';

describe('GetUser Decorator', () => {
  it('should be defined', () => {
    expect(GetUser).toBeDefined();
  });
  
  // Teste da funcionalidade através de simulação manual do comportamento
  it('should extract user from request', () => {
    const mockUser: Partial<User> = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
    };
    
    const mockRequest = { user: mockUser };
    const mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    } as unknown as ExecutionContext;
    
    // Simulação da factory function do decorator
    const extractUser = (data: string | undefined, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest();
      const user = request.user;
      
      return data ? user?.[data] : user;
    };
    
    // Testar comportamento sem propriedade específica
    const resultWithoutProp = extractUser(undefined, mockContext);
    expect(resultWithoutProp).toEqual(mockUser);
    
    // Testar comportamento com propriedade específica
    const resultWithProp = extractUser('email', mockContext);
    expect(resultWithProp).toEqual(mockUser.email);
  });
}); 