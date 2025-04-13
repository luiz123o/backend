import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CategorySeedService } from './category-seed.service';

describe('CategorySeedService', () => {
  let service: CategorySeedService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategorySeedService,
        {
          provide: getRepositoryToken(Category),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CategorySeedService>(CategorySeedService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should skip seeding if categories already exist', async () => {
      // Mock
      jest.spyOn(repository, 'count').mockResolvedValueOnce(5);
      const saveSpy = jest.spyOn(repository, 'save');

      // Execute
      await service.seed();

      // Assert
      expect(repository.count).toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });

    it('should seed default categories if no categories exist', async () => {
      // Mock
      jest.spyOn(repository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(repository, 'save').mockResolvedValue([new Category()] as any);

      // Execute
      await service.seed();

      // Assert
      expect(repository.count).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ name: expect.any(String) })
        ])
      );
    });

    it('should handle errors during seeding', async () => {
      // Mock
      jest.spyOn(repository, 'count').mockResolvedValueOnce(0);
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error('Database error'));

      // Execute & Assert
      await expect(service.seed()).rejects.toThrow('Database error');
    });
  });
}); 