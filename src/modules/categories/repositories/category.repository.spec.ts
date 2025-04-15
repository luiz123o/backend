import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { Category, CategoryType } from '../entities/category.entity';
import { CategoryRepository } from './category.repository';

// Mock para o QueryBuilder do TypeORM
const createQueryBuilderMock = () => {
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    getManyAndCount: jest.fn().mockResolvedValue([[mockCategory], 1]),
  };
  return queryBuilder;
};

// Categoria de teste
const mockCategory = {
  id: '1',
  name: 'Streaming',
  description: 'Serviços de streaming de vídeo, música e jogos',
  color: '#E50914',
  icon: 'play_circle',
  type: CategoryType.DEFAULT,
  userId: null,
  order: 1,
} as Category;

// Mock para UpdateResult
const createUpdateResult = (affected: number): UpdateResult => ({
  affected,
  raw: null,
  generatedMaps: []
});

describe('CategoryRepository', () => {
  let repository: CategoryRepository;
  let typeOrmRepository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryRepository,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            count: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock()),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<CategoryRepository>(CategoryRepository);
    typeOrmRepository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findById', () => {
    it('should find a category by ID', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(mockCategory);
      
      const result = await repository.findById('1');
      
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockCategory);
    });

    it('should return null if no category is found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);
      
      const result = await repository.findById('999');
      
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a category', async () => {
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(mockCategory);
      
      const result = await repository.save(mockCategory);
      
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockCategory);
      expect(result).toEqual(mockCategory);
    });
  });

  describe('countByNameAndUser', () => {
    it('should count categories by name for default categories', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.countByNameAndUser('Streaming');
      
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('category');
      expect(queryBuilder.where).toHaveBeenCalledWith('category.name = :name', { name: 'Streaming' });
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('category.userId IS NULL');
      expect(queryBuilder.getCount).toHaveBeenCalled();
    });

    it('should count categories by name for custom categories', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.countByNameAndUser('Custom Category', 'user123');
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('category.userId = :userId', { userId: 'user123' });
    });

    it('should exclude a category by ID when counting', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.countByNameAndUser('Streaming', null, '123');
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('category.id != :categoryId', { categoryId: '123' });
    });
  });

  describe('findAll', () => {
    it('should find all categories with default pagination', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({});
      
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('category');
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(50);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('category.order', 'ASC');
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should apply type filter', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ type: CategoryType.DEFAULT });
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('category.type = :type', { type: CategoryType.DEFAULT });
    });

    it('should apply userId filter for null', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ userId: null });
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('category.userId IS NULL');
    });

    it('should apply userId filter for custom and default categories', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ userId: 'user123' });
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(category.userId = :userId OR category.type = :defaultType)',
        { userId: 'user123', defaultType: CategoryType.DEFAULT }
      );
    });

    it('should apply search filter', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ search: 'stream' });
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(category.name ILIKE :search OR category.description ILIKE :search)',
        { search: '%stream%' }
      );
    });

    it('should apply name ordering', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ orderBy: 'name', orderDirection: 'DESC' });
      
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('category.name', 'DESC');
    });

    it('should apply createdAt ordering', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ orderBy: 'createdAt', orderDirection: 'DESC' });
      
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('category.createdAt', 'DESC');
    });
  });

  describe('findDefaultCategories', () => {
    it('should find default categories', async () => {
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue([mockCategory]);
      
      const result = await repository.findDefaultCategories();
      
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { 
          type: CategoryType.DEFAULT,
          userId: IsNull()
        },
        order: {
          order: 'ASC'
        }
      });
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findCustomCategoriesByUser', () => {
    it('should find custom categories for a user', async () => {
      const customCategory = { ...mockCategory, type: CategoryType.CUSTOM, userId: 'user123' };
      jest.spyOn(typeOrmRepository, 'find').mockResolvedValue([customCategory]);
      
      const result = await repository.findCustomCategoriesByUser('user123');
      
      expect(typeOrmRepository.find).toHaveBeenCalledWith({
        where: { 
          type: CategoryType.CUSTOM,
          userId: 'user123'
        },
        order: {
          order: 'ASC'
        }
      });
      expect(result).toEqual([customCategory]);
    });
  });

  describe('remove', () => {
    it('should remove a category (soft delete)', async () => {
      jest.spyOn(typeOrmRepository, 'softDelete').mockResolvedValue(createUpdateResult(1));
      
      const result = await repository.remove('1');
      
      expect(typeOrmRepository.softDelete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false if no category was removed', async () => {
      jest.spyOn(typeOrmRepository, 'softDelete').mockResolvedValue(createUpdateResult(0));
      
      const result = await repository.remove('999');
      
      expect(result).toBe(false);
    });
  });

  describe('exists', () => {
    it('should return true if category exists', async () => {
      jest.spyOn(typeOrmRepository, 'count').mockResolvedValue(1);
      
      const result = await repository.exists('1');
      
      expect(typeOrmRepository.count).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toBe(true);
    });

    it('should return false if category does not exist', async () => {
      jest.spyOn(typeOrmRepository, 'count').mockResolvedValue(0);
      
      const result = await repository.exists('999');
      
      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return the total count of categories', async () => {
      jest.spyOn(typeOrmRepository, 'count').mockResolvedValue(10);
      
      const result = await repository.count();
      
      expect(typeOrmRepository.count).toHaveBeenCalled();
      expect(result).toBe(10);
    });
  });
}); 