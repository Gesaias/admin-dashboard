import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service.js';

@Injectable()
export class ProductsService {
  constructor(private db: DatabaseService) {}

  async create(data: any, userId: string) {
    return await this.db.product.create({ data: { ...data, userId } });
  }

  async findAll(filters?: { category?: string; search?: string }) {
    return await this.db.product.findMany({
      where: {
        ...(filters?.category && { category: filters.category }),
        ...(filters?.search && {
          name: { contains: filters.search, mode: 'insensitive' },
        }),
      },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return await this.db.product.findUnique({ where: { id } });
  }

  async update(id: string, data: any) {
    return await this.db.product.update({ where: { id }, data });
  }

  async remove(id: string) {
    return await this.db.product.delete({ where: { id } });
  }

  async getStats() {
    return await this.db.product.groupBy({
      by: ['category'],
      _count: true,
      _sum: { stock: true },
    });
  }
}
