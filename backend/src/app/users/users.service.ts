import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

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

  async update(id: string, data: UpdateUserDto) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return await this.db.user.update({
      where: { id },
      data,
    });
  }

  remove(id: string) {
    return this.db.user.delete({ where: { id } });
  }
}
