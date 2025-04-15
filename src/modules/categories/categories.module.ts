import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './controllers/category.controller';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategorySeedService } from './services/category-seed.service';
import { CategoryService } from './services/category.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  controllers: [CategoryController],
  providers: [
    CategoryRepository,
    CategorySeedService,
    CategoryService,
  ],
  exports: [
    TypeOrmModule,
    CategoryRepository,
    CategoryService,
  ],
})
export class CategoriesModule implements OnModuleInit {
  constructor(private readonly categorySeedService: CategorySeedService) {}

  /**
   * Executa o seed de categorias quando o módulo for inicializado
   */
  async onModuleInit() {
    await this.categorySeedService.seed();
  }
} 