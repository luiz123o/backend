import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../decorators/get-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserQueryDto } from '../dtos/user-query.dto';
import { PaginatedUserResponseDto, UserResponseDto } from '../dtos/user-response.dto';
import { User, UserRole } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { UsersService } from '../services/users.service';

/**
 * Controlador de Usuários
 * 
 * Gerencia endpoints relacionados a usuários
 */
@ApiTags('Usuários')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Cria um novo usuário
   * 
   * @param createUserDto Dados para criação do usuário
   * @returns Promise<UserResponseDto> Usuário criado
   */
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Busca usuários com paginação e filtros
   * 
   * @param queryDto Parâmetros de consulta
   * @returns Promise<PaginatedUserResponseDto> Lista paginada de usuários
   */
  @ApiOperation({ summary: 'Buscar usuários com paginação e filtros' })
  @ApiResponse({ status: 200, description: 'Lista de usuários recuperada com sucesso', type: PaginatedUserResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async findAll(@Query() queryDto: UserQueryDto): Promise<PaginatedUserResponseDto> {
    return this.usersService.findAll(queryDto);
  }

  /**
   * Busca um usuário pelo ID
   * 
   * @param id ID do usuário
   * @returns Promise<UserResponseDto> Usuário encontrado
   */
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  /**
   * Atualiza um usuário
   * 
   * @param id ID do usuário
   * @param updateUserDto Dados para atualização
   * @returns Promise<UserResponseDto> Usuário atualizado
   */
  @ApiOperation({ summary: 'Atualizar usuário' })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Remove um usuário
   * 
   * @param id ID do usuário
   * @returns Promise<{ message: string }> Mensagem de sucesso
   */
  @ApiOperation({ summary: 'Remover usuário' })
  @ApiResponse({ status: 200, description: 'Usuário removido com sucesso' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const removed = await this.usersService.remove(id);
    return {
      message: removed ? 'Usuário removido com sucesso' : 'Falha ao remover usuário',
    };
  }

  /**
   * Recupera o perfil do usuário autenticado
   * 
   * @param user Usuário autenticado
   * @returns Promise<UserResponseDto> Dados do perfil
   */
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil recuperado com sucesso', type: UserResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile/me')
  async getProfile(@GetUser() user: User): Promise<UserResponseDto> {
    return this.usersService.findById(user.id);
  }

  /**
   * Atualiza o perfil do usuário autenticado
   * 
   * @param user Usuário autenticado
   * @param updateUserDto Dados para atualização
   * @returns Promise<UserResponseDto> Perfil atualizado
   */
  @ApiOperation({ summary: 'Atualizar perfil do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('profile/me')
  async updateProfile(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.updateProfile(user.id, updateUserDto);
  }

  /**
   * Atualiza a assinatura Premium do usuário
   * 
   * @param id ID do usuário
   * @param isPremium Status Premium
   * @returns Promise<UserResponseDto> Usuário atualizado
   */
  @ApiOperation({ summary: 'Atualizar status Premium do usuário' })
  @ApiResponse({ status: 200, description: 'Status Premium atualizado', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/premium')
  async updatePremiumStatus(
    @Param('id') id: string,
    @Body('isPremium') isPremium: boolean,
  ): Promise<UserResponseDto> {
    // Aqui, estamos apenas atualizando um campo específico
    // Em uma implementação completa, seria necessário adicionar a propriedade isPremium na entidade User
    // e implementar a lógica correspondente no UsersService
    return this.usersService.update(id, {
      // Apenas um exemplo, ajustar conforme a implementação real
      // isPremium: isPremium
    });
  }
} 