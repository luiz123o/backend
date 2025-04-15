import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsHexColor, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Streaming',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'Descrição da categoria',
    example: 'Serviços de streaming de vídeo e música',
    required: false,
    maxLength: 255,
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;

  @ApiProperty({
    description: 'Cor da categoria em formato hexadecimal',
    example: '#FF0000',
    required: false,
  })
  @IsString()
  @IsHexColor()
  @IsOptional()
  color?: string;

  @ApiProperty({
    description: 'Ícone da categoria',
    example: 'streaming',
    required: false,
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  icon?: string;

  @ApiProperty({
    description: 'Tipo da categoria',
    enum: CategoryType,
    required: false,
  })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;

  @ApiProperty({
    description: 'Ordem de exibição da categoria',
    example: 1,
    required: false,
  })
  @IsOptional()
  order?: number;
} 