import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    // Registra a entidade User no TypeORM
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [],
  providers: [UserRepository, UsersService],
  exports: [TypeOrmModule, UserRepository, UsersService],
})
export class UsersModule {} 