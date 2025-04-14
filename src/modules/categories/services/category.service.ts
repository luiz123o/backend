import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Category, CategoryType } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';

/**
 * Serviço para gerenciamento de categorias
 */
@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(
    private readonly categoryRepository: CategoryRepository,
  ) {}

  /**
   * Cria uma nova categoria
   * 
   * @param category Dados da categoria
   * @param userId ID do usuário (opcional, para categorias personalizadas)
   * @returns Promise<Category> Categoria criada
   */
  async create(category: Partial<Category>, userId?: string): Promise<Category> {
    this.logger.log(`Criando categoria: ${category.name}`);

    // Verifica se já existe uma categoria com o mesmo nome
    const count = await this.categoryRepository.countByNameAndUser(
      category.name as string,
      userId
    );
    
    if (count > 0) {
      throw new BadRequestException(
        `Já existe uma categoria com o nome '${category.name}'`
      );
    }
    
    // Define o tipo da categoria
    const type = userId ? CategoryType.CUSTOM : CategoryType.DEFAULT;
    
    // Cria a entidade de categoria
    const newCategory = new Category();
    Object.assign(newCategory, {
      ...category,
      type,
      userId,
      order: 0, // Será atualizado após salvar
    });
    
    // Salva a categoria
    const savedCategory = await this.categoryRepository.save(newCategory);
    this.logger.log(`Categoria criada com sucesso: ${savedCategory.id}`);
    
    return savedCategory;
  }

  /**
   * Busca uma categoria por ID
   * 
   * @param id ID da categoria
   * @param userId ID do usuário (opcional, para filtrar categorias personalizadas)
   * @returns Promise<Category> Categoria encontrada
   */
  async findById(id: string, userId?: string): Promise<Category> {
    this.logger.log(`Buscando categoria: ${id}`);
    
    const category = await this.categoryRepository.findById(id);
    
    if (!category) {
      throw new NotFoundException(`Categoria não encontrada: ${id}`);
    }
    
    // Verifica se a categoria pertence ao usuário (se for personalizada)
    if (category.type === CategoryType.CUSTOM && category.userId !== userId) {
      throw new NotFoundException(`Categoria não encontrada: ${id}`);
    }
    
    return category;
  }

  /**
   * Busca todas as categorias com paginação e filtros
   * 
   * @param options Opções de filtro e paginação
   * @returns Promise<[Category[], number]> Categorias e contagem total
   */
  async findAll(options: {
    skip?: number;
    take?: number;
    type?: CategoryType;
    userId?: string;
    search?: string;
    orderBy?: 'name' | 'createdAt' | 'order';
    orderDirection?: 'ASC' | 'DESC';
  }): Promise<[Category[], number]> {
    this.logger.log('Buscando categorias');
    return this.categoryRepository.findAll(options);
  }

  /**
   * Atualiza uma categoria
   * 
   * @param id ID da categoria
   * @param category Dados da categoria
   * @param userId ID do usuário (opcional, para categorias personalizadas)
   * @returns Promise<Category> Categoria atualizada
   */
  async update(
    id: string,
    category: Partial<Category>,
    userId?: string
  ): Promise<Category> {
    this.logger.log(`Atualizando categoria: ${id}`);
    
    // Busca a categoria existente
    const existingCategory = await this.findById(id, userId);
    
    // Verifica se já existe uma categoria com o mesmo nome
    if (category.name && category.name !== existingCategory.name) {
      const count = await this.categoryRepository.countByNameAndUser(
        category.name,
        userId,
        id
      );
      
      if (count > 0) {
        throw new BadRequestException(
          `Já existe uma categoria com o nome '${category.name}'`
        );
      }
    }
    
    // Atualiza a categoria
    Object.assign(existingCategory, category);
    const updatedCategory = await this.categoryRepository.save(existingCategory);
    this.logger.log(`Categoria atualizada com sucesso: ${id}`);
    
    return updatedCategory;
  }

  /**
   * Remove uma categoria
   * 
   * @param id ID da categoria
   * @param userId ID do usuário (opcional, para categorias personalizadas)
   * @returns Promise<boolean> True se removida com sucesso
   */
  async remove(id: string, userId?: string): Promise<boolean> {
    this.logger.log(`Removendo categoria: ${id}`);
    
    // Verifica se a categoria existe e pertence ao usuário
    await this.findById(id, userId);
    
    // Remove a categoria
    const result = await this.categoryRepository.remove(id);
    this.logger.log(`Categoria removida com sucesso: ${id}`);
    
    return result;
  }

  /**
   * Busca categorias padrão do sistema
   * 
   * @returns Promise<Category[]> Lista de categorias padrão
   */
  async findDefaultCategories(): Promise<Category[]> {
    this.logger.log('Buscando categorias padrão');
    return this.categoryRepository.findDefaultCategories();
  }

  /**
   * Busca categorias personalizadas de um usuário
   * 
   * @param userId ID do usuário
   * @returns Promise<Category[]> Lista de categorias personalizadas
   */
  async findCustomCategoriesByUser(userId: string): Promise<Category[]> {
    this.logger.log(`Buscando categorias personalizadas do usuário: ${userId}`);
    return this.categoryRepository.findCustomCategoriesByUser(userId);
  }
} 