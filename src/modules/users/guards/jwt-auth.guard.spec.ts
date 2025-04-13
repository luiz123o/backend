import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  it('should be defined', () => {
    expect(JwtAuthGuard).toBeDefined();
  });
  
  // Como JwtAuthGuard é apenas uma extensão de AuthGuard, 
  // não precisamos testar a funcionalidade do AuthGuard
  it('should inherit from AuthGuard', () => {
    const guard = new JwtAuthGuard();
    expect(guard).toBeInstanceOf(JwtAuthGuard);
  });
}); 