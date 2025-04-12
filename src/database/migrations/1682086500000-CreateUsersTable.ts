import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1682086500000 implements MigrationInterface {
  name = 'CreateUsersTable1682086500000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Criar enums para role e status
    await queryRunner.query(`
      CREATE TYPE "user_role_enum" AS ENUM ('admin', 'user')
    `);

    await queryRunner.query(`
      CREATE TYPE "user_status_enum" AS ENUM ('active', 'inactive', 'pending')
    `);

    // Criar tabela de usuários
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(255) NOT NULL,
        "email" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'user',
        "status" "user_status_enum" NOT NULL DEFAULT 'pending',
        "email_verified" boolean NOT NULL DEFAULT false,
        "verification_token" character varying(255),
        "password_reset_token" character varying(255),
        "password_reset_expires" TIMESTAMP,
        "password_changed_at" TIMESTAMP,
        "last_login_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "pk_users" PRIMARY KEY ("id")
      )
    `);

    // Criar índice único para email
    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_users_email" ON "users" ("email") 
      WHERE "deleted_at" IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remover tabela e enums
    await queryRunner.query(`DROP INDEX "idx_users_email"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "user_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
} 