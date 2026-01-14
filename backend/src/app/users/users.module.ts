import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';
import { DatabaseService } from '../../services/database/database.service.js';

@Module({
  providers: [UsersService, DatabaseService],
  controllers: [UsersController],
})
export class UsersModule {}
