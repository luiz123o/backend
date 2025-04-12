import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { UserStatus } from '../entities/user.entity';

/**
 * DTO para consulta de usuários com paginação e filtros
 */
export class UserQueryDto {
  /**
   * Número da página (começa em 1)
   * @example 1
   */
  @ApiPropertyOptional({
    description: 'Número da página (começa em 1)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'A página deve ser um número inteiro' })
  @Min(1, { message: 'A página deve ser maior ou igual a 1' })
  page?: number = 1;

  /**
   * Número de itens por página
   * @example 10
   */
  @ApiPropertyOptional({
    description: 'Número de itens por página',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'O limite deve ser um número inteiro' })
  @Min(1, { message: 'O limite deve ser maior ou igual a 1' })
  limit?: number = 10;

  /**
   * Filtro de busca por nome ou email
   * @example "joão"
   */
  @ApiPropertyOptional({
    description: 'Filtro de busca por nome ou email',
  })
  @IsOptional()
  @IsString({ message: 'O termo de busca deve ser uma string' })
  search?: string;

  /**
   * Filtro por status
   * @example "active"
   */
  @ApiPropertyOptional({
    description: 'Filtro por status',
    enum: UserStatus,
  })
  @IsOptional()
  @IsEnum(UserStatus, { message: 'Status inválido. Deve ser "active", "inactive" ou "pending"' })
  status?: UserStatus;
} 