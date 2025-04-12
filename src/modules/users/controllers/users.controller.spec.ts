import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
import { User, UserRole, UserStatus } from '../entities/user.entity';
import { UsersService } from '../services/users.service';
import { UsersController } from './users.controller';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    updateProfile: jest.fn(),
    remove: jest.fn(),
  };

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

  const mockUserResponse = {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    role: mockUser.role,
    status: mockUser.status,
    emailVerified: mockUser.emailVerified,
    profilePicture: mockUser.profilePicture,
    lastLoginAt: mockUser.lastLoginAt,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'new@example.com',
        password: 'Password@123',
        passwordConfirmation: 'Password@123',
        role: UserRole.USER,
      };

      mockUsersService.create.mockResolvedValue(mockUserResponse);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const queryDto: UserQueryDto = { page: 1, limit: 10 };
      const paginatedResponse = {
        data: [mockUserResponse],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockUsersService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll(queryDto);

      expect(usersService.findAll).toHaveBeenCalledWith(queryDto);
      expect(result).toEqual(paginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUsersService.findById.mockResolvedValue(mockUserResponse);

      const result = await controller.findOne('1');

      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      mockUsersService.update.mockResolvedValue({
        ...mockUserResponse,
        name: 'Updated Name',
      });

      const result = await controller.update('1', updateUserDto);

      expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result.name).toBe('Updated Name');
    });
  });

  describe('remove', () => {
    it('should remove a user and return success message', async () => {
      mockUsersService.remove.mockResolvedValue(true);

      const result = await controller.remove('1');

      expect(usersService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Usuário removido com sucesso' });
    });

    it('should return failure message if user not removed', async () => {
      mockUsersService.remove.mockResolvedValue(false);

      const result = await controller.remove('1');

      expect(usersService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({ message: 'Falha ao remover usuário' });
    });
  });

  describe('getProfile', () => {
    it('should return the profile of the authenticated user', async () => {
      mockUsersService.findById.mockResolvedValue(mockUserResponse);

      const result = await controller.getProfile(mockUser);

      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual(mockUserResponse);
    });
  });

  describe('updateProfile', () => {
    it('should update the profile of the authenticated user', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Profile',
      };

      mockUsersService.updateProfile.mockResolvedValue({
        ...mockUserResponse,
        name: 'Updated Profile',
      });

      const result = await controller.updateProfile(mockUser, updateUserDto);

      expect(usersService.updateProfile).toHaveBeenCalledWith(mockUser.id, updateUserDto);
      expect(result.name).toBe('Updated Profile');
    });
  });

  describe('updatePremiumStatus', () => {
    it('should update the premium status of a user', async () => {
      mockUsersService.update.mockResolvedValue(mockUserResponse);

      const result = await controller.updatePremiumStatus('1', true);

      expect(usersService.update).toHaveBeenCalledWith('1', expect.any(Object));
      expect(result).toEqual(mockUserResponse);
    });
  });
}); 