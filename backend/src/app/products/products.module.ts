import { Module } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service.js';
import { ProductsService } from './products.service.js';
import { ProductsController } from './products.controller.js';

@Module({
  providers: [ProductsService, DatabaseService],
  controllers: [ProductsController],
})
export class ProductsModule {}
