import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { defaultCategories } from '../seeds/default-categories.seed';

/**
 * Serviço para seed de categorias padrão
 */
@Injectable()
export class CategorySeedService {
  private logger = new Logger(CategorySeedService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * Popula o banco de dados com categorias padrão
   */
  async seed(): Promise<void> {
    this.logger.log('Iniciando seed de categorias padrão');
    
    // Verifica se já existem categorias no banco
    const count = await this.categoryRepository.count();
    
    if (count > 0) {
      this.logger.log(`Já existem ${count} categorias no banco. Pulando seed.`);
      return;
    }
    
    try {
      // Cria as entidades de categoria a partir dos dados de seed
      const categories = defaultCategories.map(categoryData => {
        const category = new Category();
        Object.assign(category, categoryData);
        return category;
      });
      
      // Salva as categorias no banco de dados
      const savedCategories = await this.categoryRepository.save(categories);
      this.logger.log(`${savedCategories.length} categorias padrão foram criadas com sucesso.`);
    } catch (error) {
      this.logger.error('Erro ao criar categorias padrão:', error.message);
      throw error;
    }
  }
} 