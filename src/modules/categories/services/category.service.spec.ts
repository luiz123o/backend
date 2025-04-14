import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Category, CategoryType } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryService } from './category.service';

// Mock para o repositório
const mockCategoryRepository = {
  save: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  remove: jest.fn(),
  countByNameAndUser: jest.fn(),
  findDefaultCategories: jest.fn(),
  findCustomCategoriesByUser: jest.fn(),
};

// Categoria de teste
const mockCategory = {
  id: '1',
  name: 'Streaming',
  description: 'Serviços de streaming',
  color: '#E50914',
  icon: 'play_circle',
  type: CategoryType.DEFAULT,
  userId: null,
  order: 1,
} as Category;

describe('CategoryService', () => {
  let service: CategoryService;
  let repository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        {
          provide: CategoryRepository,
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    repository = module.get<CategoryRepository>(CategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a default category', async () => {
      // Mock
      jest.spyOn(repository, 'countByNameAndUser').mockResolvedValue(0);
      jest.spyOn(repository, 'save').mockResolvedValue(mockCategory);

      // Execute
      const result = await service.create({
        name: 'Streaming',
        description: 'Serviços de streaming',
        color: '#E50914',
        icon: 'play_circle',
      });

      // Assert
      expect(repository.countByNameAndUser).toHaveBeenCalledWith(
        'Streaming',
        undefined
      );
      expect(repository.save).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it('should create a custom category', async () => {
      // Mock
      jest.spyOn(repository, 'countByNameAndUser').mockResolvedValue(0);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockCategory,
        type: CategoryType.CUSTOM,
        userId: 'user123',
      });

      // Execute
      const result = await service.create(
        {
          name: 'Streaming',
          description: 'Serviços de streaming',
          color: '#E50914',
          icon: 'play_circle',
        },
        'user123'
      );

      // Assert
      expect(repository.countByNameAndUser).toHaveBeenCalledWith(
        'Streaming',
        'user123'
      );
      expect(repository.save).toHaveBeenCalled();
      expect(result.type).toBe(CategoryType.CUSTOM);
      expect(result.userId).toBe('user123');
    });

    it('should throw BadRequestException if category name already exists', async () => {
      // Mock
      jest.spyOn(repository, 'countByNameAndUser').mockResolvedValue(1);

      // Execute & Assert
      await expect(
        service.create({
          name: 'Streaming',
          description: 'Serviços de streaming',
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findById', () => {
    it('should find a category by ID', async () => {
      // Mock
      jest.spyOn(repository, 'findById').mockResolvedValue(mockCategory);

      // Execute
      const result = await service.findById('1');

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockCategory);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Mock
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      // Execute & Assert
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if custom category does not belong to user', async () => {
      // Mock
      jest.spyOn(repository, 'findById').mockResolvedValue({
        ...mockCategory,
        type: CategoryType.CUSTOM,
        userId: 'user123',
      });

      // Execute & Assert
      await expect(service.findById('1', 'user456')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('findAll', () => {
    it('should find all categories with default options', async () => {
      // Mock
      jest.spyOn(repository, 'findAll').mockResolvedValue([[mockCategory], 1]);

      // Execute
      const result = await service.findAll({});

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith({
        skip: undefined,
        take: undefined,
        type: undefined,
        userId: undefined,
        search: undefined,
        orderBy: undefined,
        orderDirection: undefined,
      });
      expect(result).toEqual([[mockCategory], 1]);
    });

    it('should find all categories with custom options', async () => {
      // Mock
      jest.spyOn(repository, 'findAll').mockResolvedValue([[mockCategory], 1]);

      // Execute
      const result = await service.findAll({
        skip: 10,
        take: 20,
        type: CategoryType.DEFAULT,
        userId: 'user123',
        search: 'stream',
        orderBy: 'name',
        orderDirection: 'DESC',
      });

      // Assert
      expect(repository.findAll).toHaveBeenCalledWith({
        skip: 10,
        take: 20,
        type: CategoryType.DEFAULT,
        userId: 'user123',
        search: 'stream',
        orderBy: 'name',
        orderDirection: 'DESC',
      });
      expect(result).toEqual([[mockCategory], 1]);
    });
  });

  describe('update', () => {
    it('should update a category', async () => {
      // Mock
      jest.spyOn(repository, 'findById').mockResolvedValue(mockCategory);
      jest.spyOn(repository, 'countByNameAndUser').mockResolvedValue(0);
      jest.spyOn(repository, 'save').mockResolvedValue({
        ...mockCategory,
        name: 'Updated Streaming',
      });

      // Execute
      const result = await service.update('1', {
        name: 'Updated Streaming',
      });

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.countByNameAndUser).toHaveBeenCalledWith(
        'Updated Streaming',
        undefined,
        '1'
      );
      expect(repository.save).toHaveBeenCalled();
      expect(result.name).toBe('Updated Streaming');
    });

    it('should throw BadRequestException if new name already exists', async () => {
      // Mock
      jest.spyOn(repository, 'findById').mockResolvedValue(mockCategory);
      jest.spyOn(repository, 'countByNameAndUser').mockResolvedValue(1);

      // Execute & Assert
      await expect(
        service.update('1', {
          name: 'Existing Category',
        })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a category', async () => {
      // Mock
      jest.spyOn(repository, 'findById').mockResolvedValue(mockCategory);
      jest.spyOn(repository, 'remove').mockResolvedValue(true);

      // Execute
      const result = await service.remove('1');

      // Assert
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.remove).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if category does not exist', async () => {
      // Mock
      jest.spyOn(repository, 'findById').mockResolvedValue(null);

      // Execute & Assert
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findDefaultCategories', () => {
    it('should find default categories', async () => {
      // Mock
      jest.spyOn(repository, 'findDefaultCategories').mockResolvedValue([
        mockCategory,
      ]);

      // Execute
      const result = await service.findDefaultCategories();

      // Assert
      expect(repository.findDefaultCategories).toHaveBeenCalled();
      expect(result).toEqual([mockCategory]);
    });
  });

  describe('findCustomCategoriesByUser', () => {
    it('should find custom categories by user', async () => {
      // Mock
      jest.spyOn(repository, 'findCustomCategoriesByUser').mockResolvedValue([
        {
          ...mockCategory,
          type: CategoryType.CUSTOM,
          userId: 'user123',
        },
      ]);

      // Execute
      const result = await service.findCustomCategoriesByUser('user123');

      // Assert
      expect(repository.findCustomCategoriesByUser).toHaveBeenCalledWith(
        'user123'
      );
      expect(result[0].type).toBe(CategoryType.CUSTOM);
      expect(result[0].userId).toBe('user123');
    });
  });
}); 