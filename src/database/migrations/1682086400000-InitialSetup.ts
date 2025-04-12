import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1682086400000 implements MigrationInterface {
  name = 'InitialSetup1682086400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "migrations" (
        "id" SERIAL PRIMARY KEY,
        "timestamp" bigint NOT NULL,
        "name" varchar NOT NULL
      )`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "migrations"`);
  }
} 