import { Test, TestingModule } from '@nestjs/testing';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { defaultCategories } from '../seeds/default-categories.seed';
import { CategorySeedService } from './category-seed.service';

describe('CategorySeedService', () => {
  let service: CategorySeedService;
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategorySeedService,
        {
          provide: CategoryRepository,
          useValue: {
            count: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CategorySeedService>(CategorySeedService);
    categoryRepository = module.get<CategoryRepository>(CategoryRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should skip seeding if categories already exist', async () => {
      // Mock
      jest.spyOn(categoryRepository, 'count').mockResolvedValueOnce(5);
      const saveSpy = jest.spyOn(categoryRepository, 'save');

      // Execute
      await service.seed();

      // Assert
      expect(categoryRepository.count).toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should seed default categories if no categories exist', async () => {
      // Mock
      jest.spyOn(categoryRepository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(categoryRepository, 'save').mockImplementation(category => 
        Promise.resolve({ ...category, id: '123' } as Category)
      );

      // Execute
      await service.seed();

      // Assert
      expect(categoryRepository.count).toHaveBeenCalled();
      expect(categoryRepository.save).toHaveBeenCalled();
      // O número de chamadas deve ser igual ao número de categorias padrão
      expect(categoryRepository.save).toHaveBeenCalledTimes(defaultCategories.length);
    });

    it('should handle errors during seeding', async () => {
      // Mock
      jest.spyOn(categoryRepository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(categoryRepository, 'save').mockRejectedValueOnce(new Error('Database error'));

      // Execute & Assert
      await expect(service.seed()).rejects.toThrow('Database error');
    });
  });
}); 