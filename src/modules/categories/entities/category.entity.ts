import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

/**
 * Enum para definir os tipos de categorias no sistema
 */
export enum CategoryType {
  DEFAULT = 'default',   // Categoria padrão do sistema
  CUSTOM = 'custom',     // Categoria personalizada criada pelo usuário
}

/**
 * Entidade de Categoria
 * 
 * Representa uma categoria para classificação de assinaturas no sistema
 */
@Entity('categories')
export class Category {
  /**
   * ID único da categoria, gerado como UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nome da categoria
   */
  @Column({ type: 'varchar', length: 100 })
  @Index()
  name: string;

  /**
   * Descrição da categoria
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  /**
   * Cor da categoria (em formato hexadecimal)
   */
  @Column({ type: 'varchar', length: 7, default: '#808080' })
  color: string;

  /**
   * Ícone da categoria (nome do ícone)
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string | null;

  /**
   * Tipo da categoria (padrão ou personalizada)
   */
  @Column({
    type: 'enum',
    enum: CategoryType,
    default: CategoryType.DEFAULT
  })
  type: CategoryType;

  /**
   * ID do usuário proprietário (apenas para categorias personalizadas)
   */
  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  userId: string | null;

  /**
   * Ordem de exibição da categoria
   */
  @Column({ type: 'int', default: 0 })
  order: number;

  /**
   * Data de criação do registro
   */
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  /**
   * Data da última atualização do registro
   */
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  /**
   * Data de exclusão (para soft delete)
   */
  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at' })
  deletedAt: Date | null;
} 