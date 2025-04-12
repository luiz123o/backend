import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: UserRepository;

  // Mock do UserRepository
  const mockUserRepository = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    save: jest.fn(),
    countByEmail: jest.fn(),
    remove: jest.fn(),
  };

  // Usuário de exemplo
  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
    emailVerified: true,
    verificationToken: null,
    profilePicture: null,
    googleId: null,
    appleId: null,
    firstName: null,
    lastName: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    passwordChangedAt: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    hashPassword: jest.fn(),
    validatePassword: jest.fn(),
    isPasswordResetTokenExpired: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);

    // Limpa os mocks
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'New User',
      email: 'new@example.com',
      password: 'Password@123',
      passwordConfirmation: 'Password@123',
      role: UserRole.USER,
    };

    it('should create a new user successfully', async () => {
      // Arranjar
      mockUserRepository.countByEmail.mockResolvedValue(0);
      mockUserRepository.save.mockImplementation((user) => 
        Promise.resolve({
          ...user,
          id: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      // Agir
      const result = await service.create(createUserDto);

      // Verificar
      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.name).toBe(createUserDto.name);
      expect(result.status).toBe(UserStatus.PENDING);
      expect(mockUserRepository.countByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      // Arranjar
      const invalidDto = {
        ...createUserDto,
        passwordConfirmation: 'DifferentPassword@123',
      };

      // Agir e verificar
      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      // Arranjar
      mockUserRepository.countByEmail.mockResolvedValue(1);

      // Agir e verificar
      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      // Arranjar
      const queryDto: UserQueryDto = { page: 1, limit: 10 };
      const users = [mockUser, { ...mockUser, id: '2', email: 'test2@example.com' }];
      mockUserRepository.findAll.mockResolvedValue([users, 2]);

      // Agir
      const result = await service.findAll(queryDto);

      // Verificar
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        status: undefined,
        search: undefined,
      });
    });

    it('should apply filters correctly', async () => {
      // Arranjar
      const queryDto: UserQueryDto = { 
        page: 2, 
        limit: 5, 
        status: UserStatus.ACTIVE,
        search: 'test',
      };
      mockUserRepository.findAll.mockResolvedValue([[mockUser], 6]);

      // Agir
      const result = await service.findAll(queryDto);

      // Verificar
      expect(result).toBeDefined();
      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(mockUserRepository.findAll).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        status: UserStatus.ACTIVE,
        search: 'test',
      });
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Agir
      const result = await service.findById('1');

      // Verificar
      expect(result).toBeDefined();
      expect(result.id).toBe('1');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(null);

      // Agir e verificar
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      // Arranjar
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      // Agir
      const result = await service.findByEmail('test@example.com');

      // Verificar
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arranjar
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Agir e verificar
      await expect(service.findByEmail('nonexistent@example.com')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
    };

    it('should update a user successfully', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.save.mockImplementation((user) => 
        Promise.resolve({
          ...user,
          ...updateUserDto,
          updatedAt: new Date(),
        })
      );

      // Agir
      const result = await service.update('1', updateUserDto);

      // Verificar
      expect(result).toBeDefined();
      expect(result.name).toBe('Updated Name');
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(null);

      // Agir e verificar
      await expect(service.update('999', updateUserDto)).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if passwords do not match', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(mockUser);
      const invalidDto: UpdateUserDto = {
        password: 'NewPassword@123',
        passwordConfirmation: 'DifferentPassword@123',
      };

      // Agir e verificar
      await expect(service.update('1', invalidDto)).rejects.toThrow(BadRequestException);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if changing email to one that already exists', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.countByEmail.mockResolvedValue(1);
      const emailUpdateDto: UpdateUserDto = {
        email: 'existing@example.com',
      };

      // Agir e verificar
      await expect(service.update('1', emailUpdateDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(true);

      // Agir
      const result = await service.remove('1');

      // Verificar
      expect(result).toBe(true);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.remove).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(null);

      // Agir e verificar
      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });
  });

  describe('updateProfile', () => {
    it('should update profile without changing protected fields', async () => {
      // Arranjar
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.save.mockImplementation((user) => 
        Promise.resolve({
          ...user,
          name: 'Profile Update',
          updatedAt: new Date(),
        })
      );

      const profileUpdateDto: UpdateUserDto = {
        name: 'Profile Update',
        role: UserRole.ADMIN, // Este campo não deve ser alterado via updateProfile
        status: UserStatus.INACTIVE, // Este campo não deve ser alterado via updateProfile
      };

      // Agir
      const result = await service.updateProfile('1', profileUpdateDto);

      // Verificar
      expect(result).toBeDefined();
      expect(result.name).toBe('Profile Update');
      
      // Verifica se os campos protegidos não foram passados para o update
      const saveCall = mockUserRepository.save.mock.calls[0][0];
      expect(saveCall.role).not.toBe(UserRole.ADMIN);
      expect(saveCall.status).not.toBe(UserStatus.INACTIVE);
    });
  });
}); 