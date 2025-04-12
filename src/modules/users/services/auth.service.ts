import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { AuthTokensDto, LoginResponseDto, UserAuthDto } from '../dtos/auth-response.dto';
import { ForgotPasswordDto, LoginDto, ResetPasswordDto } from '../dtos/auth.dto';
import { User, UserStatus } from '../entities/user.entity';
import { JwtPayload, RefreshTokenPayload } from '../interfaces/jwt-payload.interface';
import { UserRepository } from '../repositories/user.repository';

/**
 * Serviço de Autenticação
 * 
 * Gerencia todas as operações relacionadas à autenticação e autorização de usuários
 */
@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * Valida um usuário pelo email e senha
   * 
   * @param email Email do usuário
   * @param password Senha do usuário
   * @returns Promise<User | null> Usuário encontrado ou null
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await user.validatePassword(password);

    if (!isPasswordValid) {
      return null;
    }

    // Verifica se o usuário está ativo
    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Conta não ativada ou suspensa');
    }

    return user;
  }

  /**
   * Realiza o login do usuário
   * 
   * @param loginDto DTO de login (email e senha)
   * @returns Promise<LoginResponseDto> Dados do usuário e tokens
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    
    // Valida o usuário
    const user = await this.validateUser(email, password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Atualiza a data do último login
    user.lastLoginAt = new Date();
    await this.userRepository.save(user);

    // Gera os tokens
    const tokens = await this.generateTokens(user);
    
    // Prepara a resposta
    return {
      user: this.buildUserResponse(user),
      tokens,
    };
  }

  /**
   * Gera um novo par de tokens a partir de um refresh token
   * 
   * @param refreshToken Refresh token
   * @param userId ID do usuário
   * @returns Promise<AuthTokensDto> Novos tokens
   */
  async refreshTokens(refreshToken: string, userId: string): Promise<AuthTokensDto> {
    // Verifica se o usuário existe e está ativo
    const user = await this.userRepository.findById(userId);
    
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException('Usuário inválido ou inativo');
    }

    // Gera novos tokens
    return this.generateTokens(user);
  }

  /**
   * Inicia o processo de recuperação de senha
   * 
   * @param forgotPasswordDto DTO com email do usuário
   * @returns Promise<void>
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;
    const user = await this.userRepository.findByEmail(email);

    // Mesmo que o usuário não exista, retornamos sucesso por segurança
    if (!user) {
      return;
    }

    // Gera um token de reset de senha
    const token = crypto.randomBytes(32).toString('hex');
    
    // Define o prazo de expiração (1 hora)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    // Salva o token no usuário
    user.passwordResetToken = token;
    user.passwordResetExpires = expiresAt;
    await this.userRepository.save(user);

    // Aqui você pode adicionar a lógica para enviar o email com o token
    // Por exemplo, using a NotificationService
    
    // Exemplo de conteúdo do email:
    // `Para redefinir sua senha, clique no link: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
  }

  /**
   * Redefine a senha do usuário usando um token de reset
   * 
   * @param resetPasswordDto DTO com token e nova senha
   * @returns Promise<void>
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, password, passwordConfirmation } = resetPasswordDto;
    
    // Verifica se as senhas coincidem
    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem');
    }

    // Busca o usuário pelo token
    const user = await this.userRepository.findByPasswordResetToken(token);
    
    if (!user) {
      throw new NotFoundException('Token inválido ou expirado');
    }

    // Verifica se o token não expirou
    if (user.isPasswordResetTokenExpired()) {
      throw new BadRequestException('Token expirado');
    }

    // Atualiza a senha e limpa os tokens
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await this.userRepository.save(user);
  }

  /**
   * Verifica o email do usuário com um token de verificação
   * 
   * @param token Token de verificação
   * @returns Promise<void>
   */
  async verifyEmail(token: string): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(token);
    
    if (!user) {
      throw new NotFoundException('Token inválido');
    }

    // Atualiza o status do usuário e limpa o token
    user.emailVerified = true;
    user.verificationToken = null;
    
    // Se o usuário estava pendente, ativa-o
    if (user.status === UserStatus.PENDING) {
      user.status = UserStatus.ACTIVE;
    }
    
    await this.userRepository.save(user);
  }

  /**
   * Gera um par de tokens (access e refresh) para um usuário
   * 
   * @param user Usuário
   * @returns Promise<AuthTokensDto> Tokens gerados
   */
  private async generateTokens(user: User): Promise<AuthTokensDto> {
    // Define o payload do access token
    const accessTokenPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    // Define o payload do refresh token
    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id,
      jti: uuidv4(), // ID único para o refresh token
    };

    // Obtém os tempos de expiração da configuração
    const accessTokenExpiration = this.configService.get<string>('jwt.expiration') || '1h';
    const refreshTokenExpiration = this.configService.get<string>('jwt.refreshExpiration') || '7d';

    // Converte a expiração em segundos
    const expiresIn = this.parseExpirationToSeconds(accessTokenExpiration);

    // Gera os tokens
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(accessTokenPayload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: accessTokenExpiration,
      }),
      this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: refreshTokenExpiration,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  /**
   * Constrói a resposta com os dados do usuário para autenticação
   * 
   * @param user Entidade de usuário
   * @returns UserAuthDto DTO com dados básicos do usuário
   */
  private buildUserResponse(user: User): UserAuthDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    };
  }

  /**
   * Converte a string de expiração em segundos
   * 
   * @param expiration String de expiração (ex: '1h', '7d')
   * @returns number Segundos
   */
  private parseExpirationToSeconds(expiration: string): number {
    const match = expiration.match(/^(\d+)([smhd])$/);
    
    if (!match) {
      return 3600; // Padrão: 1 hora
    }
    
    const value = parseInt(match[1], 10);
    const unit = match[2];
    
    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 24 * 60 * 60;
      default: return 3600;
    }
  }
} 