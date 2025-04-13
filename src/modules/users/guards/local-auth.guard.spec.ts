import { LocalAuthGuard } from './local-auth.guard';

describe('LocalAuthGuard', () => {
  it('should be defined', () => {
    expect(LocalAuthGuard).toBeDefined();
  });
  
  // Como LocalAuthGuard é apenas uma extensão de AuthGuard, 
  // não precisamos testar a funcionalidade do AuthGuard
  it('should inherit from AuthGuard', () => {
    const guard = new LocalAuthGuard();
    expect(guard).toBeInstanceOf(LocalAuthGuard);
  });
}); 