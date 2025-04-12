import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';

/**
 * Repositório de Usuários
 * 
 * Estende o repositório padrão do TypeORM e adiciona métodos personalizados
 * para operações específicas com usuários
 */
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  /**
   * Encontra um usuário pelo email
   * 
   * @param email Email do usuário
   * @returns Promise<User | null> Usuário encontrado ou null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ 
      where: { email },
    });
  }

  /**
   * Encontra um usuário pelo token de verificação
   * 
   * @param token Token de verificação
   * @returns Promise<User | null> Usuário encontrado ou null
   */
  async findByVerificationToken(token: string): Promise<User | null> {
    return this.repository.findOne({
      where: { verificationToken: token },
    });
  }

  /**
   * Encontra um usuário pelo token de reset de senha
   * 
   * @param token Token de reset de senha
   * @returns Promise<User | null> Usuário encontrado ou null
   */
  async findByPasswordResetToken(token: string): Promise<User | null> {
    return this.repository.findOne({
      where: { passwordResetToken: token },
    });
  }

  /**
   * Salva um usuário no banco de dados
   * 
   * @param user Entidade de usuário
   * @returns Promise<User> Usuário salvo
   */
  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  /**
   * Conta quantos usuários existem com um determinado email
   * 
   * @param email Email a ser verificado
   * @param excludeUserId ID de usuário a ser excluído da contagem (opcional)
   * @returns Promise<number> Número de usuários encontrados
   */
  async countByEmail(email: string, excludeUserId?: string): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('user')
      .where('user.email = :email', { email });
    
    if (excludeUserId) {
      queryBuilder.andWhere('user.id != :userId', { userId: excludeUserId });
    }
    
    return queryBuilder.getCount();
  }

  /**
   * Encontra um usuário por ID
   * 
   * @param id ID do usuário
   * @returns Promise<User | null> Usuário encontrado ou null
   */
  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Busca usuários com paginação e filtros
   * 
   * @param options Opções de filtro e paginação
   * @returns Promise<[User[], number]> Usuários e contagem total
   */
  async findAll(options: {
    skip?: number;
    take?: number;
    status?: UserStatus;
    search?: string;
  }): Promise<[User[], number]> {
    const { skip = 0, take = 10, status, search } = options;
    
    const queryBuilder = this.repository.createQueryBuilder('user');
    
    // Adiciona filtro por status
    if (status) {
      queryBuilder.andWhere('user.status = :status', { status });
    }
    
    // Adiciona busca por nome ou email
    if (search) {
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    // Adiciona paginação
    queryBuilder
      .skip(skip)
      .take(take)
      .orderBy('user.createdAt', 'DESC');
    
    return queryBuilder.getManyAndCount();
  }

  /**
   * Remove um usuário (soft delete)
   * 
   * @param id ID do usuário
   * @returns Promise<boolean> True se removido com sucesso
   */
  async remove(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected ? result.affected > 0 : false;
  }
} 