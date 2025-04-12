import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, UserStatus } from '../entities/user.entity';

/**
 * DTO de resposta para usuários
 */
export class UserResponseDto {
  /**
   * ID único do usuário
   * @example "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
   */
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  })
  id: string;

  /**
   * Nome completo do usuário
   * @example "João Silva"
   */
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  name: string;

  /**
   * Email do usuário
   * @example "joao@example.com"
   */
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com',
  })
  email: string;

  /**
   * Status do usuário
   * @example "active"
   */
  @ApiProperty({
    description: 'Status do usuário',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  /**
   * Papel do usuário no sistema
   * @example "user"
   */
  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.USER,
  })
  role: UserRole;

  /**
   * Verificação de email
   * @example true
   */
  @ApiProperty({
    description: 'Verificação de email',
    example: true,
  })
  emailVerified: boolean;

  /**
   * URL da imagem de perfil
   * @example "https://example.com/profile.jpg"
   */
  @ApiPropertyOptional({
    description: 'URL da imagem de perfil',
    example: 'https://example.com/profile.jpg',
  })
  profilePicture?: string | null;

  /**
   * Data do último login
   * @example "2023-01-01T00:00:00.000Z"
   */
  @ApiPropertyOptional({
    description: 'Data do último login',
    example: '2023-01-01T00:00:00.000Z',
  })
  lastLoginAt?: Date | null;

  /**
   * Data de criação do registro
   * @example "2023-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  /**
   * Data da última atualização do registro
   * @example "2023-01-01T00:00:00.000Z"
   */
  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2023-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

/**
 * DTO de resposta paginada para usuários
 */
export class PaginatedUserResponseDto {
  /**
   * Lista de usuários
   */
  @ApiProperty({
    description: 'Lista de usuários',
    type: [UserResponseDto],
  })
  data: UserResponseDto[];

  /**
   * Total de registros
   * @example 100
   */
  @ApiProperty({
    description: 'Total de registros',
    example: 100,
  })
  total: number;

  /**
   * Página atual
   * @example 1
   */
  @ApiProperty({
    description: 'Página atual',
    example: 1,
  })
  page: number;

  /**
   * Número de itens por página
   * @example 10
   */
  @ApiProperty({
    description: 'Número de itens por página',
    example: 10,
  })
  limit: number;

  /**
   * Total de páginas
   * @example 10
   */
  @ApiProperty({
    description: 'Total de páginas',
    example: 10,
  })
  totalPages: number;
} 