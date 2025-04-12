import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';

@Module({
  imports: [
    // Registra a entidade User no TypeORM
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [UserRepository],
  exports: [TypeOrmModule, UserRepository],
})
export class UsersModule {} 