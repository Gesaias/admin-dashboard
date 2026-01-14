import { Injectable } from '@nestjs/common';
import { Role } from '../../generated/prisma/index.js';
import { DatabaseService } from '../../services/database/database.service.js';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return await this.db.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async update(id: string, data: { name?: string; role?: Role }) {
    return await this.db.user.update({
      where: { id },
      data: { name: data.name, role: data.role },
    });
  }

  remove(id: string) {
    return this.db.user.delete({ where: { id } });
  }
}
