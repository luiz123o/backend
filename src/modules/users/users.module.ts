import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    // Registra a entidade User no TypeORM
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class UsersModule {} 