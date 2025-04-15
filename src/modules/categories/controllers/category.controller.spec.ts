import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category, CategoryType } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';
import { CategoryController } from './category.controller';

describe('CategoryController', () => {
  let controller: CategoryController;
  let service: CategoryService;

  const mockCategory: Category = {
    id: '1',
    name: 'Streaming',
    description: 'Serviços de streaming',
    color: '#FF0000',
    icon: 'streaming',
    type: CategoryType.CUSTOM,
    userId: 'user-1',
    order: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockCategoryService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findDefaultCategories: jest.fn(),
    findCustomCategoriesByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: mockCategoryService,
        },
      ],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
    service = module.get<CategoryService>(CategoryService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('deve retornar uma lista de categorias', async () => {
      const expectedCategories = [[mockCategory], 1];
      mockCategoryService.findAll.mockResolvedValue(expectedCategories);

      const result = await controller.findAll();

      expect(result).toEqual(expectedCategories);
      expect(service.findAll).toHaveBeenCalled();
    });

    it('deve aplicar filtros corretamente', async () => {
      const filters = {
        skip: 0,
        take: 10,
        type: CategoryType.CUSTOM,
        search: 'streaming',
        orderBy: 'name' as const,
        orderDirection: 'ASC' as const,
      };

      await controller.findAll(
        filters.skip,
        filters.take,
        filters.type,
        filters.search,
        filters.orderBy,
        filters.orderDirection,
      );

      expect(service.findAll).toHaveBeenCalledWith(filters);
    });
  });

  describe('findById', () => {
    it('deve retornar uma categoria pelo ID', async () => {
      mockCategoryService.findById.mockResolvedValue(mockCategory);

      const result = await controller.findById('1');

      expect(result).toEqual(mockCategory);
      expect(service.findById).toHaveBeenCalledWith('1', undefined);
    });

    it('deve passar o ID do usuário quando fornecido', async () => {
      const userId = 'user-1';
      mockCategoryService.findById.mockResolvedValue(mockCategory);

      await controller.findById('1', userId);

      expect(service.findById).toHaveBeenCalledWith('1', userId);
    });
  });

  describe('create', () => {
    it('deve criar uma nova categoria', async () => {
      const createDto: CreateCategoryDto = {
        name: 'Streaming',
        description: 'Serviços de streaming',
        color: '#FF0000',
        icon: 'streaming',
        type: CategoryType.CUSTOM,
      };

      mockCategoryService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockCategory);
      expect(service.create).toHaveBeenCalledWith(createDto, undefined);
    });

    it('deve passar o ID do usuário quando fornecido', async () => {
      const userId = 'user-1';
      const createDto: CreateCategoryDto = {
        name: 'Streaming',
      };

      await controller.create(createDto, userId);

      expect(service.create).toHaveBeenCalledWith(createDto, userId);
    });
  });

  describe('update', () => {
    it('deve atualizar uma categoria existente', async () => {
      const updateDto: UpdateCategoryDto = {
        name: 'Streaming Atualizado',
      };

      mockCategoryService.update.mockResolvedValue({
        ...mockCategory,
        ...updateDto,
      });

      const result = await controller.update('1', updateDto);

      expect(result).toEqual({ ...mockCategory, ...updateDto });
      expect(service.update).toHaveBeenCalledWith('1', updateDto, undefined);
    });

    it('deve passar o ID do usuário quando fornecido', async () => {
      const userId = 'user-1';
      const updateDto: UpdateCategoryDto = {
        name: 'Streaming Atualizado',
      };

      await controller.update('1', updateDto, userId);

      expect(service.update).toHaveBeenCalledWith('1', updateDto, userId);
    });
  });

  describe('remove', () => {
    it('deve remover uma categoria', async () => {
      mockCategoryService.remove.mockResolvedValue(true);

      const result = await controller.remove('1');

      expect(result).toBe(true);
      expect(service.remove).toHaveBeenCalledWith('1', undefined);
    });

    it('deve passar o ID do usuário quando fornecido', async () => {
      const userId = 'user-1';

      await controller.remove('1', userId);

      expect(service.remove).toHaveBeenCalledWith('1', userId);
    });
  });

  describe('findDefaultCategories', () => {
    it('deve retornar categorias padrão', async () => {
      const defaultCategories = [mockCategory];
      mockCategoryService.findDefaultCategories.mockResolvedValue(defaultCategories);

      const result = await controller.findDefaultCategories();

      expect(result).toEqual(defaultCategories);
      expect(service.findDefaultCategories).toHaveBeenCalled();
    });
  });

  describe('findCustomCategories', () => {
    it('deve retornar categorias personalizadas do usuário', async () => {
      const userId = 'user-1';
      const customCategories = [mockCategory];
      mockCategoryService.findCustomCategoriesByUser.mockResolvedValue(customCategories);

      const result = await controller.findCustomCategories(userId);

      expect(result).toEqual(customCategories);
      expect(service.findCustomCategoriesByUser).toHaveBeenCalledWith(userId);
    });
  });
}); 