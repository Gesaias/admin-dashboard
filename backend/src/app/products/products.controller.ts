import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@ApiTags('Produtos')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  create(
    @Body() dto: CreateProductDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.productsService.create(dto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtos com filtros' })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filtrar por categoria',
  })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por nome' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso',
  })
  findAll(@Query() query: { category?: string; search?: string }) {
    return this.productsService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas dos produtos' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas retornadas com sucesso',
  })
  getStats() {
    return this.productsService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um produto pelo ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um produto' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um produto' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
