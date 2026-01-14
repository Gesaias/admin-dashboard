/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../services/database/database.service.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/client.js';

function isPrismaKnownRequestError(
  error: any,
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async findAll() {
    return await this.db.user
      .findMany({
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('Erro ao buscar usuários');
      });
  }

  async findOne(id: string) {
    return await this.db.user
      .findUnique({
        where: { id },
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })
      .then((user) => {
        if (!user) {
          throw new NotFoundException('Usuário não encontrado');
        }

        return user;
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        throw new InternalServerErrorException('Erro ao buscar usuário');
      });
  }

  async update(id: string, data: UpdateUserDto) {
    return await this.db.user
      .update({
        where: { id },
        data,
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        throw new InternalServerErrorException('Erro ao atualizar usuário');
      });
  }

  async updatePassword(id: string, data: { hashedPassword: string }) {
    return await this.db.user
      .update({
        where: { id },
        data: { password: data.hashedPassword },
        select: {
          id: true,
          updatedAt: true,
        },
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        throw new InternalServerErrorException('Erro ao atualizar senha');
      });
  }

  async remove(id: string) {
    return this.db.user
      .delete({
        where: { id },
        select: { id: true, name: true, createdAt: true, updatedAt: true },
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
        }

        throw new InternalServerErrorException('Erro ao deletar usuário');
      });
  }
}
