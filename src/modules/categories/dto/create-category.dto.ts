import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsHexColor, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nome da categoria',
    example: 'Streaming',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

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
    default: '#808080',
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
    default: CategoryType.CUSTOM,
  })
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;
} 