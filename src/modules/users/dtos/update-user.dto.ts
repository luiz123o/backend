import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserRole, UserStatus } from '../entities/user.entity';

/**
 * DTO para validação de atualização de usuário
 */
export class UpdateUserDto {
  /**
   * Nome completo do usuário
   * @example "João Silva"
   */
  @ApiPropertyOptional({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString({ message: 'O nome deve ser uma string' })
  name?: string;

  /**
   * Email do usuário
   * @example "joao@example.com"
   */
  @ApiPropertyOptional({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Informe um email válido' })
  email?: string;

  /**
   * Senha do usuário
   * @example "Senha@123"
   */
  @ApiPropertyOptional({
    description: 'Senha do usuário (min. 8 caracteres, letras, números e caracteres especiais)',
    example: 'Senha@123',
  })
  @IsOptional()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  })
  password?: string;

  /**
   * Confirmação da senha
   * @example "Senha@123"
   */
  @ApiPropertyOptional({
    description: 'Confirmação da senha (deve ser igual à senha)',
    example: 'Senha@123',
  })
  @IsOptional()
  passwordConfirmation?: string;

  /**
   * Papel do usuário (opcional, apenas para administradores)
   * @example "user"
   */
  @ApiPropertyOptional({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Papel inválido. Deve ser "admin" ou "user"' })
  role?: UserRole;

  /**
   * Status do usuário (opcional, apenas para administradores)
   * @example "active"
   */
  @ApiPropertyOptional({
    description: 'Status do usuário',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status inválido. Deve ser "active", "inactive" ou "pending"' })
  status?: UserStatus;

  /**
   * URL da imagem de perfil
   * @example "https://example.com/profile.jpg"
   */
  @ApiPropertyOptional({
    description: 'URL da imagem de perfil',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString({ message: 'A URL da imagem de perfil deve ser uma string' })
  profilePicture?: string;
} 