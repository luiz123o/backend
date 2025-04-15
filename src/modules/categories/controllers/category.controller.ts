import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { User } from '../../users/decorators/user.decorator';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category, CategoryType } from '../entities/category.entity';
import { CategoryService } from '../services/category.service';

/**
 * Controller para gerenciamento de categorias
 */
@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Lista todas as categorias com paginação e filtros
   */
  @Get()
  @ApiOperation({ summary: 'Lista todas as categorias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias retornada com sucesso',
    type: [Category],
  })
  async findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
    @Query('type') type?: CategoryType,
    @Query('search') search?: string,
    @Query('orderBy') orderBy?: 'name' | 'createdAt' | 'order',
    @Query('orderDirection') orderDirection?: 'ASC' | 'DESC',
    @User('id') userId?: string,
  ) {
    return this.categoryService.findAll({
      skip,
      take,
      type,
      userId,
      search,
      orderBy,
      orderDirection,
    });
  }

  /**
   * Busca uma categoria por ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Busca uma categoria por ID' })
  @ApiResponse({
    status: 200,
    description: 'Categoria encontrada com sucesso',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async findById(
    @Param('id') id: string,
    @User('id') userId?: string,
  ) {
    return this.categoryService.findById(id, userId);
  }

  /**
   * Cria uma nova categoria
   */
  @Post()
  @ApiOperation({ summary: 'Cria uma nova categoria' })
  @ApiResponse({
    status: 201,
    description: 'Categoria criada com sucesso',
    type: Category,
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @User('id') userId?: string,
  ) {
    return this.categoryService.create(createCategoryDto, userId);
  }

  /**
   * Atualiza uma categoria existente
   */
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma categoria existente' })
  @ApiResponse({
    status: 200,
    description: 'Categoria atualizada com sucesso',
    type: Category,
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @User('id') userId?: string,
  ) {
    return this.categoryService.update(id, updateCategoryDto, userId);
  }

  /**
   * Remove uma categoria
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma categoria' })
  @ApiResponse({
    status: 200,
    description: 'Categoria removida com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  async remove(
    @Param('id') id: string,
    @User('id') userId?: string,
  ) {
    return this.categoryService.remove(id, userId);
  }

  /**
   * Lista todas as categorias padrão do sistema
   */
  @Get('default')
  @ApiOperation({ summary: 'Lista categorias padrão do sistema' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias padrão retornada com sucesso',
    type: [Category],
  })
  async findDefaultCategories() {
    return this.categoryService.findDefaultCategories();
  }

  /**
   * Lista todas as categorias personalizadas do usuário
   */
  @Get('custom')
  @ApiOperation({ summary: 'Lista categorias personalizadas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorias personalizadas retornada com sucesso',
    type: [Category],
  })
  async findCustomCategories(@User('id') userId: string) {
    return this.categoryService.findCustomCategoriesByUser(userId);
  }
} 