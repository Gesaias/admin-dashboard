import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { DatabaseModule } from './services/database/database.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './app/auth/auth.module.js';
import { UsersModule } from './app/users/users.module.js';
import { JwtAuthGuard } from './app/auth/guards/jwt-auth.guard.js';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
