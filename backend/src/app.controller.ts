import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { IsPublic } from './app/auth/decorators/is-public.decorator.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
