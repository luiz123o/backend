import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * DTO para validação de credenciais de login
 */
export class LoginDto {
  /**
   * Email do usuário
   * @example "usuario@example.com"
   */
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Informe um email válido' })
  email: string;

  /**
   * Senha do usuário
   * @example "Senha@123"
   */
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha@123',
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString({ message: 'A senha deve ser uma string' })
  password: string;
}

/**
 * DTO para validação de solicitação de refresh token
 */
export class RefreshTokenDto {
  /**
   * Refresh token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  @ApiProperty({
    description: 'Token de refresh para obter um novo token de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({ message: 'O refresh token é obrigatório' })
  @IsString({ message: 'O refresh token deve ser uma string' })
  refreshToken: string;
}

/**
 * DTO para validação de solicitação de redefinição de senha
 */
export class ForgotPasswordDto {
  /**
   * Email do usuário
   * @example "usuario@example.com"
   */
  @ApiProperty({
    description: 'Email do usuário que esqueceu a senha',
    example: 'usuario@example.com',
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Informe um email válido' })
  email: string;
}

/**
 * DTO para validação de redefinição de senha
 */
export class ResetPasswordDto {
  /**
   * Token de redefinição de senha
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  @ApiProperty({
    description: 'Token de redefinição de senha',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({ message: 'O token é obrigatório' })
  @IsString({ message: 'O token deve ser uma string' })
  token: string;

  /**
   * Nova senha
   * @example "NovaSenha@123"
   */
  @ApiProperty({
    description: 'Nova senha',
    example: 'NovaSenha@123',
  })
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;

  /**
   * Confirmação da nova senha
   * @example "NovaSenha@123"
   */
  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'NovaSenha@123',
  })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  passwordConfirmation: string;
} 