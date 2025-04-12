import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User, UserStatus } from '../entities/user.entity';
import { UserRepository } from './user.repository';

// Mock para o QueryBuilder do TypeORM
const createQueryBuilderMock = () => {
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getCount: jest.fn().mockResolvedValue(1),
    getManyAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
  };
  return queryBuilder;
};

// Usuário de teste
const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  status: UserStatus.ACTIVE,
} as User;

// Mock para UpdateResult
const createUpdateResult = (affected: number): UpdateResult => ({
  affected,
  raw: null,
  generatedMaps: []
});

describe('UserRepository', () => {
  let repository: UserRepository;
  let typeOrmRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            createQueryBuilder: jest.fn().mockReturnValue(createQueryBuilderMock()),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    typeOrmRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(mockUser);
      
      const result = await repository.findByEmail('test@example.com');
      
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if no user is found', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(null);
      
      const result = await repository.findByEmail('nonexistent@example.com');
      
      expect(result).toBeNull();
    });
  });

  describe('findByVerificationToken', () => {
    it('should find a user by verification token', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(mockUser);
      
      const result = await repository.findByVerificationToken('token123');
      
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { verificationToken: 'token123' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByPasswordResetToken', () => {
    it('should find a user by password reset token', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(mockUser);
      
      const result = await repository.findByPasswordResetToken('reset123');
      
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { passwordResetToken: 'reset123' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('save', () => {
    it('should save a user', async () => {
      jest.spyOn(typeOrmRepository, 'save').mockResolvedValue(mockUser);
      
      const result = await repository.save(mockUser);
      
      expect(typeOrmRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('countByEmail', () => {
    it('should count users by email', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.countByEmail('test@example.com');
      
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.where).toHaveBeenCalledWith('user.email = :email', { email: 'test@example.com' });
      expect(queryBuilder.getCount).toHaveBeenCalled();
    });

    it('should exclude a user by ID when counting', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.countByEmail('test@example.com', '123');
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.id != :userId', { userId: '123' });
    });
  });

  describe('findById', () => {
    it('should find a user by ID', async () => {
      jest.spyOn(typeOrmRepository, 'findOne').mockResolvedValue(mockUser);
      
      const result = await repository.findById('1');
      
      expect(typeOrmRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should find all users with default pagination', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({});
      
      expect(typeOrmRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(queryBuilder.skip).toHaveBeenCalledWith(0);
      expect(queryBuilder.take).toHaveBeenCalledWith(10);
      expect(queryBuilder.orderBy).toHaveBeenCalledWith('user.createdAt', 'DESC');
      expect(queryBuilder.getManyAndCount).toHaveBeenCalled();
    });

    it('should apply status filter', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ status: UserStatus.ACTIVE });
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith('user.status = :status', { status: UserStatus.ACTIVE });
    });

    it('should apply search filter', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ search: 'test' });
      
      expect(queryBuilder.andWhere).toHaveBeenCalledWith(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: '%test%' }
      );
    });

    it('should apply custom pagination', async () => {
      const queryBuilder = createQueryBuilderMock();
      jest.spyOn(typeOrmRepository, 'createQueryBuilder').mockReturnValue(queryBuilder as any);
      
      await repository.findAll({ skip: 10, take: 20 });
      
      expect(queryBuilder.skip).toHaveBeenCalledWith(10);
      expect(queryBuilder.take).toHaveBeenCalledWith(20);
    });
  });

  describe('remove', () => {
    it('should remove a user (soft delete)', async () => {
      jest.spyOn(typeOrmRepository, 'softDelete').mockResolvedValue(createUpdateResult(1));
      
      const result = await repository.remove('1');
      
      expect(typeOrmRepository.softDelete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false if no user was removed', async () => {
      jest.spyOn(typeOrmRepository, 'softDelete').mockResolvedValue(createUpdateResult(0));
      
      const result = await repository.remove('999');
      
      expect(result).toBe(false);
    });
  });
}); 