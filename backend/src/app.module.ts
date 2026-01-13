import { Module } from '@nestjs/common';
import { DatabaseModule } from './services/database/database.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './app/auth/auth.module.js';
import { UsersModule } from './app/users/users.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
