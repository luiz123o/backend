import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetUser } from '../decorators/get-user.decorator';
import { LoginResponseDto } from '../dtos/auth-response.dto';
import { LoginDto } from '../dtos/auth.dto';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from '../guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { AuthService } from '../services/auth.service';

/**
 * Controlador de Autenticação
 * 
 * Gerencia endpoints relacionados à autenticação de usuários
 */
@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  /**
   * Endpoint de login com email e senha
   * 
   * @param loginDto DTO com email e senha
   * @returns Promise<LoginResponseDto> Dados do usuário e tokens
   */
  @ApiOperation({ summary: 'Login com email e senha' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
  
  /**
   * Endpoint para renovar tokens com refresh token
   * 
   * @param req Requisição HTTP
   * @param user Usuário autenticado
   * @returns Promise<{ accessToken: string, refreshToken: string }> Novos tokens
   */
  @ApiOperation({ summary: 'Renovar tokens com refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens renovados com sucesso' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido ou expirado' })
  @UseGuards(JwtRefreshAuthGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() req, @GetUser() user: User) {
    return this.authService.refreshTokens(
      req.user.refreshToken,
      user.id,
    );
  }

  /**
   * Endpoint para iniciar a autenticação com Google
   */
  @ApiOperation({ summary: 'Iniciar autenticação com Google' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Este método é apenas para iniciar o fluxo de autenticação
    // O redirecionamento para o Google é feito pelo guard
  }

  /**
   * Endpoint de callback para autenticação Google
   * 
   * @param req Requisição HTTP
   * @param res Resposta HTTP
   */
  @ApiOperation({ summary: 'Callback para autenticação Google' })
  @ApiResponse({ status: 200, description: 'Autenticação Google bem-sucedida' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.googleLogin(req.user);
    
    // Redireciona para a URL de sucesso com o token como parâmetro de query
    const frontendUrl = this.configService.get<string>('frontend.url') || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/social-login-success?access_token=${result.tokens.accessToken}&refresh_token=${result.tokens.refreshToken}`;
    
    return res.redirect(redirectUrl);
  }

  /**
   * Endpoint para iniciar a autenticação com Apple
   */
  @ApiOperation({ summary: 'Iniciar autenticação com Apple' })
  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  appleAuth() {
    // Este método é apenas para iniciar o fluxo de autenticação
    // O redirecionamento para a Apple é feito pelo guard
  }

  /**
   * Endpoint de callback para autenticação Apple
   * 
   * @param req Requisição HTTP
   * @param res Resposta HTTP
   */
  @ApiOperation({ summary: 'Callback para autenticação Apple' })
  @ApiResponse({ status: 200, description: 'Autenticação Apple bem-sucedida' })
  @Post('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleAuthRedirect(@Req() req, @Res() res: Response) {
    const result = await this.authService.appleLogin(req.user);
    
    // Redireciona para a URL de sucesso com o token como parâmetro de query
    const frontendUrl = this.configService.get<string>('frontend.url') || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/social-login-success?access_token=${result.tokens.accessToken}&refresh_token=${result.tokens.refreshToken}`;
    
    return res.redirect(redirectUrl);
  }

  /**
   * Endpoint para logout (invalidar token)
   */
  @ApiOperation({ summary: 'Logout - invalidar token' })
  @ApiResponse({ status: 200, description: 'Logout bem-sucedido' })
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // Na implementação atual, o token é stateless, então não há necessidade de invalidação
    // Em uma implementação mais completa, aqui seria o lugar para adicionar o token a uma blacklist
    return { message: 'Logout bem-sucedido' };
  }
} 