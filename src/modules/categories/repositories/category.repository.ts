import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Category, CategoryType } from '../entities/category.entity';

/**
 * Repositório de Categorias
 * 
 * Estende o repositório padrão do TypeORM e adiciona métodos personalizados
 * para operações específicas com categorias
 */
@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  /**
   * Encontra uma categoria por ID
   * 
   * @param id ID da categoria
   * @returns Promise<Category | null> Categoria encontrada ou null
   */
  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  /**
   * Salva uma categoria no banco de dados
   * 
   * @param category Entidade de categoria
   * @returns Promise<Category> Categoria salva
   */
  async save(category: Category): Promise<Category> {
    return this.repository.save(category);
  }

  /**
   * Conta quantas categorias existem com um determinado nome para um usuário
   * 
   * @param name Nome da categoria
   * @param userId ID do usuário (opcional, para categorias personalizadas)
   * @param excludeCategoryId ID da categoria a ser excluída da contagem (opcional)
   * @returns Promise<number> Número de categorias encontradas
   */
  async countByNameAndUser(
    name: string, 
    userId?: string | null, 
    excludeCategoryId?: string
  ): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('category')
      .where('category.name = :name', { name });
    
    if (userId) {
      // Para categorias personalizadas, verifica se já existe com o mesmo nome para o usuário
      queryBuilder.andWhere('category.userId = :userId', { userId });
    } else {
      // Para categorias padrão, verifica se já existe com o mesmo nome
      queryBuilder.andWhere('category.userId IS NULL');
    }
    
    if (excludeCategoryId) {
      queryBuilder.andWhere('category.id != :categoryId', { categoryId: excludeCategoryId });
    }
    
    return queryBuilder.getCount();
  }

  /**
   * Busca categorias com paginação e filtros
   * 
   * @param options Opções de filtro e paginação
   * @returns Promise<[Category[], number]> Categorias e contagem total
   */
  async findAll(options: {
    skip?: number;
    take?: number;
    type?: CategoryType;
    userId?: string | null;
    search?: string;
    orderBy?: 'name' | 'createdAt' | 'order';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<[Category[], number]> {
    const { 
      skip = 0, 
      take = 50, 
      type, 
      userId, 
      search,
      orderBy = 'order',
      orderDirection = 'ASC'
    } = options;
    
    const queryBuilder = this.repository.createQueryBuilder('category');
    
    // Filtra por tipo de categoria
    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
    }
    
    // Filtra por usuário (para categorias personalizadas)
    if (userId !== undefined) {
      if (userId === null) {
        queryBuilder.andWhere('category.userId IS NULL');
      } else {
        queryBuilder.andWhere(
          '(category.userId = :userId OR category.type = :defaultType)',
          { userId, defaultType: CategoryType.DEFAULT }
        );
      }
    }
    
    // Adiciona busca por nome ou descrição
    if (search) {
      queryBuilder.andWhere(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    // Adiciona paginação e ordenação
    queryBuilder
      .skip(skip)
      .take(take);
      
    // Define a ordenação
    if (orderBy === 'name') {
      queryBuilder.orderBy('category.name', orderDirection);
    } else if (orderBy === 'createdAt') {
      queryBuilder.orderBy('category.createdAt', orderDirection);
    } else {
      // Ordenação padrão por ordem
      queryBuilder.orderBy('category.order', orderDirection);
    }
    
    return queryBuilder.getManyAndCount();
  }

  /**
   * Encontra categorias padrão do sistema
   * 
   * @returns Promise<Category[]> Lista de categorias padrão
   */
  async findDefaultCategories(): Promise<Category[]> {
    return this.repository.find({
      where: { 
        type: CategoryType.DEFAULT,
        userId: IsNull()
      },
      order: {
        order: 'ASC'
      }
    });
  }

  /**
   * Encontra categorias personalizadas de um usuário
   * 
   * @param userId ID do usuário
   * @returns Promise<Category[]> Lista de categorias personalizadas
   */
  async findCustomCategoriesByUser(userId: string): Promise<Category[]> {
    return this.repository.find({
      where: { 
        type: CategoryType.CUSTOM,
        userId 
      },
      order: {
        order: 'ASC'
      }
    });
  }

  /**
   * Remove uma categoria (soft delete)
   * 
   * @param id ID da categoria
   * @returns Promise<boolean> True se removida com sucesso
   */
  async remove(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected ? result.affected > 0 : false;
  }

  /**
   * Verifica se uma categoria existe
   * 
   * @param id ID da categoria
   * @returns Promise<boolean> True se a categoria existe
   */
  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { id }
    });
    return count > 0;
  }

  /**
   * Conta o número total de categorias
   * 
   * @returns Promise<number> Número total de categorias
   */
  async count(): Promise<number> {
    return this.repository.count();
  }
} 