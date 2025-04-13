import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategorySeedService } from './services/category-seed.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
  ],
  providers: [
    CategorySeedService,
  ],
  exports: [
    TypeOrmModule,
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