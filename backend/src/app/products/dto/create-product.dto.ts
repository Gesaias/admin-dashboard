import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Teclado Mecânico RGB',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Teclado mecânico com switches azuis e retroiluminação RGB',
    required: false,
  })
  @IsString({ message: 'A descrição deve ser uma string' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 250.5,
  })
  @IsNumber({}, { message: 'O preço deve ser um número' })
  @Min(0, { message: 'O preço não pode ser negativo' })
  price: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
  })
  @IsNumber({}, { message: 'O estoque deve ser um número' })
  @Min(0, { message: 'O estoque não pode ser negativo' })
  stock: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'Periféricos',
  })
  @IsString({ message: 'A categoria deve ser uma string' })
  @IsNotEmpty({ message: 'A categoria é obrigatória' })
  category: string;
}
