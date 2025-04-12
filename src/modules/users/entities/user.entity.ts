import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

/**
 * Enum para definir os papéis dos usuários no sistema
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

/**
 * Enum para definir os status dos usuários
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

/**
 * Entidade de Usuário
 * 
 * Representa um usuário no sistema, armazenando suas credenciais e informações básicas
 */
@Entity('users')
export class User {
  /**
   * ID único do usuário, gerado como UUID
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nome completo do usuário
   */
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * Email do usuário, deve ser único no sistema
   */
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  /**
   * Senha do usuário, armazenada com hash
   */
  @Column({ type: 'varchar', length: 255 })
  @Exclude({ toPlainOnly: true })
  password: string;

  /**
   * Papel do usuário no sistema (admin ou usuário regular)
   */
  @Column({ 
    type: 'enum', 
    enum: UserRole, 
    default: UserRole.USER 
  })
  role: UserRole;

  /**
   * Status atual do usuário
   */
  @Column({ 
    type: 'enum', 
    enum: UserStatus, 
    default: UserStatus.PENDING 
  })
  status: UserStatus;

  /**
   * Verificação se o email foi confirmado
   */
  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  /**
   * Token para verificação de email
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  verificationToken: string | null;

  /**
   * Token para reset de senha
   */
  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude({ toPlainOnly: true })
  passwordResetToken: string | null;

  /**
   * Data de expiração do token de reset de senha
   */
  @Column({ type: 'timestamp', nullable: true })
  @Exclude({ toPlainOnly: true })
  passwordResetExpires: Date | null;

  /**
   * Data da última vez que o usuário mudou a senha
   */
  @Column({ type: 'timestamp', nullable: true })
  passwordChangedAt: Date | null;

  /**
   * Último login do usuário
   */
  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date | null;

  /**
   * Data de criação do registro
   */
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  /**
   * Data da última atualização do registro
   */
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  /**
   * Data de exclusão (para soft delete)
   */
  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  /**
   * Hash da senha antes de inserir/atualizar
   */
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Só faz hash da senha se ela foi modificada e não está vazia
    if (this.password && this.password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      
      // Atualiza a data de alteração da senha
      this.passwordChangedAt = new Date();
    }
  }

  /**
   * Verifica se a senha fornecida está correta
   * 
   * @param candidatePassword - A senha a ser verificada
   * @returns Promise<boolean> - true se a senha estiver correta, false caso contrário
   */
  async validatePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  /**
   * Verifica se o token de reset de senha está expirado
   * 
   * @returns boolean - true se expirado, false caso contrário
   */
  isPasswordResetTokenExpired(): boolean {
    return this.passwordResetExpires 
      ? this.passwordResetExpires.getTime() < Date.now() 
      : true;
  }
} 