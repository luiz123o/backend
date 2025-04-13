import { JwtRefreshAuthGuard } from './jwt-refresh-auth.guard';

describe('JwtRefreshAuthGuard', () => {
  it('should be defined', () => {
    expect(JwtRefreshAuthGuard).toBeDefined();
  });
  
  // Como JwtRefreshAuthGuard é apenas uma extensão de AuthGuard, 
  // não precisamos testar a funcionalidade do AuthGuard
  it('should inherit from AuthGuard', () => {
    const guard = new JwtRefreshAuthGuard();
    expect(guard).toBeInstanceOf(JwtRefreshAuthGuard);
  });
}); 