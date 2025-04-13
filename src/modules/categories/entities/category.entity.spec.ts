import { Category, CategoryType } from './category.entity';

describe('Category Entity', () => {
  let category: Category;

  beforeEach(() => {
    category = new Category();
    category.name = 'Entertainment';
    category.description = 'Streaming services and entertainment subscriptions';
    category.color = '#FF5733';
    category.icon = 'movie';
    category.type = CategoryType.DEFAULT;
    category.order = 1;
  });

  describe('Basic Properties', () => {
    it('should have correct property values', () => {
      // Assert
      expect(category.name).toBe('Entertainment');
      expect(category.description).toBe('Streaming services and entertainment subscriptions');
      expect(category.color).toBe('#FF5733');
      expect(category.icon).toBe('movie');
      expect(category.type).toBe(CategoryType.DEFAULT);
      expect(category.order).toBe(1);
    });

    it('should handle null values for optional properties', () => {
      // Setup
      category.description = null;
      category.icon = null;
      category.userId = null;

      // Assert
      expect(category.description).toBeNull();
      expect(category.icon).toBeNull();
      expect(category.userId).toBeNull();
    });
  });

  describe('CategoryType Enum', () => {
    it('should correctly use DEFAULT category type', () => {
      // Setup
      category.type = CategoryType.DEFAULT;
      
      // Assert
      expect(category.type).toBe('default');
    });

    it('should correctly use CUSTOM category type', () => {
      // Setup
      category.type = CategoryType.CUSTOM;
      category.userId = '123e4567-e89b-12d3-a456-426614174000';
      
      // Assert
      expect(category.type).toBe('custom');
      expect(category.userId).toBe('123e4567-e89b-12d3-a456-426614174000');
    });
  });
}); 