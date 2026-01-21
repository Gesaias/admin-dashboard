/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  Scope,
  Inject,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DatabaseService } from '../../services/database/database.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Role } from '../../generated/prisma/index.js';
import { PrismaClientKnownRequestError } from '../../generated/prisma/runtime/client.js';

function isPrismaKnownRequestError(
  error: any,
): error is PrismaClientKnownRequestError {
  return error instanceof PrismaClientKnownRequestError;
}

@Injectable({ scope: Scope.REQUEST })
export class ProductsService {
  constructor(
    private db: DatabaseService,

    @Inject(REQUEST)
    private request: { user: { id: string; role: Role; email: string } },
  ) {}

  async create(data: CreateProductDto) {
    const { id: userId, role: userRole } = this.request.user;

    if (userRole !== Role.ADMIN && userRole !== Role.MANAGER) {
      throw new ForbiddenException(
        'Apenas MANAGER e ADMIN podem criar produtos',
      );
    }

    return await this.db.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        category: data.category,
        createdBy: userId,
        updatedBy: userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        stock: true,
        category: true,
      },
    });
  }

  async findAll(filters?: { category?: string; search?: string }) {
    return await this.db.product
      .findMany({
        where: {
          ...(filters?.category && { category: filters.category }),
          ...(filters?.search && {
            name: { contains: filters.search, mode: 'insensitive' },
          }),
        },
        orderBy: { createdAt: 'desc' },
      })
      .then((data) => {
        if (!data || data.length < 1) {
          throw new NotFoundException('Produtos não encontrados');
        }

        return data;
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Produtos não encontrados`);
        }

        throw error;
      });
  }

  async findOne(id: string) {
    return await this.db.product
      .findUnique({
        where: { id },
      })
      .then((data) => {
        if (!data) {
          throw new NotFoundException('Produto não encontrado');
        }

        return data;
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }

        throw error;
      });
  }

  async update(id: string, data: UpdateProductDto) {
    const { id: userId, role: userRole } = this.request.user;

    if (userRole !== Role.ADMIN && userRole !== Role.MANAGER) {
      throw new ForbiddenException(
        'Apenas MANAGER e ADMIN podem criar produtos',
      );
    }

    return await this.db.product
      .update({ where: { id }, data: { ...data, updatedBy: userId } })
      .then((data) => {
        if (!data) {
          throw new NotFoundException('Produto não encontrado');
        }

        return data;
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }

        throw error;
      });
  }

  async remove(id: string) {
    const { role: userRole } = this.request.user;

    if (userRole !== Role.ADMIN) {
      throw new ForbiddenException('Apenas ADMIN pode remover produtos');
    }

    return await this.db.product
      .delete({ where: { id } })
      .then((data) => {
        if (!data) {
          throw new NotFoundException('Produto não encontrado');
        }

        return data;
      })
      .catch((error) => {
        if (isPrismaKnownRequestError(error) && error.code === 'P2025') {
          throw new NotFoundException(`Produto com ID ${id} não encontrado`);
        }

        throw error;
      });
  }

  async getStats() {
    return await this.db.product.groupBy({
      by: ['category'],
      _count: true,
      _sum: { stock: true },
    });
  }
}
