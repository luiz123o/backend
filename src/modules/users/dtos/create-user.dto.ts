import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

/**
 * DTO para validação de criação de usuário
 */
export class CreateUserDto {
  /**
   * Nome completo do usuário
   * @example "João Silva"
   */
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  /**
   * Email do usuário
   * @example "joao@example.com"
   */
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  @IsNotEmpty({ message: 'O email é obrigatório' })
  @IsEmail({}, { message: 'Informe um email válido' })
  email: string;

  /**
   * Senha do usuário
   * @example "Senha@123"
   */
  @ApiProperty({
    description: 'Senha do usuário (min. 8 caracteres, letras, números e caracteres especiais)',
    example: 'Senha@123',
  })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message: 'A senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
  })
  password: string;

  /**
   * Confirmação da senha
   * @example "Senha@123"
   */
  @ApiProperty({
    description: 'Confirmação da senha (deve ser igual à senha)',
    example: 'Senha@123',
  })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  passwordConfirmation: string;

  /**
   * Papel do usuário (opcional, apenas para administradores)
   * @example "user"
   */
  @ApiPropertyOptional({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Papel inválido. Deve ser "admin" ou "user"' })
  role?: UserRole;
} 