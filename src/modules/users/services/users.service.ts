import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException
} from '@nestjs/common';
import * as crypto from 'crypto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
import { PaginatedUserResponseDto, UserResponseDto } from '../dtos/user-response.dto';
import { User, UserStatus } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';

/**
 * Serviço de Usuários
 * 
 * Gerencia operações relacionadas a usuários, como criação, atualização e exclusão
 */
@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Cria um novo usuário
   * 
   * @param createUserDto Dados para criação do usuário
   * @returns Promise<UserResponseDto> Usuário criado
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const { email, password, passwordConfirmation } = createUserDto;

    // Verifica se as senhas coincidem
    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem');
    }

    // Verifica se o email já existe
    const emailExists = await this.userRepository.countByEmail(email);
    if (emailExists > 0) {
      throw new ConflictException('Este email já está em uso');
    }

    // Cria uma nova instância de usuário
    const user = new User();
    Object.assign(user, createUserDto);

    // Define o status inicial como pendente
    user.status = UserStatus.PENDING;
    
    // Gera um token de verificação
    user.verificationToken = crypto.randomBytes(32).toString('hex');

    // Salva o usuário
    const savedUser = await this.userRepository.save(user);

    // TODO: Implementar envio de email de verificação
    // Exemplo: this.notificationService.sendVerificationEmail(savedUser.email, savedUser.verificationToken);

    return this.mapToUserResponseDto(savedUser);
  }

  /**
   * Busca usuários com paginação e filtros
   * 
   * @param queryDto DTO com parâmetros de consulta
   * @returns Promise<PaginatedUserResponseDto> Lista paginada de usuários
   */
  async findAll(queryDto: UserQueryDto): Promise<PaginatedUserResponseDto> {
    const { page = 1, limit = 10, status, search } = queryDto;
    
    // Calcula o offset para a paginação
    const skip = (page - 1) * limit;
    
    // Busca os usuários no repositório
    const [users, total] = await this.userRepository.findAll({
      skip,
      take: limit,
      status,
      search,
    });

    // Calcula o total de páginas
    const totalPages = Math.ceil(total / limit);
    
    // Mapeia para o DTO de resposta
    const data = users.map(user => this.mapToUserResponseDto(user));
    
    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Busca um usuário pelo ID
   * 
   * @param id ID do usuário
   * @returns Promise<UserResponseDto> Usuário encontrado
   */
  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return this.mapToUserResponseDto(user);
  }

  /**
   * Busca um usuário pelo email
   * 
   * @param email Email do usuário
   * @returns Promise<UserResponseDto> Usuário encontrado
   */
  async findByEmail(email: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    return this.mapToUserResponseDto(user);
  }

  /**
   * Atualiza um usuário
   * 
   * @param id ID do usuário
   * @param updateUserDto Dados para atualização
   * @returns Promise<UserResponseDto> Usuário atualizado
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Busca o usuário
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    // Valida senha e confirmação, se fornecidas
    if (updateUserDto.password && updateUserDto.password !== updateUserDto.passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem');
    }
    
    // Verifica se está alterando o email para um que já existe
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const emailExists = await this.userRepository.countByEmail(updateUserDto.email, id);
      if (emailExists > 0) {
        throw new ConflictException('Este email já está em uso');
      }
    }
    
    // Atualiza apenas os campos fornecidos
    Object.keys(updateUserDto).forEach(key => {
      // Ignora a confirmação de senha
      if (key !== 'passwordConfirmation') {
        user[key] = updateUserDto[key];
      }
    });
    
    // Salva as alterações
    const updatedUser = await this.userRepository.save(user);
    
    return this.mapToUserResponseDto(updatedUser);
  }

  /**
   * Remove um usuário (soft delete)
   * 
   * @param id ID do usuário
   * @returns Promise<boolean> True se removido com sucesso
   */
  async remove(id: string): Promise<boolean> {
    // Verifica se o usuário existe
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    
    // Realiza o soft delete
    return this.userRepository.remove(id);
  }

  /**
   * Atualiza o perfil do usuário atual
   * 
   * @param id ID do usuário
   * @param updateUserDto Dados para atualização
   * @returns Promise<UserResponseDto> Usuário atualizado
   */
  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    // Previne a alteração de campos protegidos no perfil
    const sanitizedDto = { ...updateUserDto };
    delete sanitizedDto.role;
    delete sanitizedDto.status;
    
    // Utiliza o método update para fazer a atualização
    return this.update(id, sanitizedDto);
  }

  /**
   * Mapeia a entidade User para o DTO de resposta UserResponseDto
   * 
   * @param user Entidade User
   * @returns UserResponseDto DTO de resposta
   */
  private mapToUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
      emailVerified: user.emailVerified,
      profilePicture: user.profilePicture,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
} 