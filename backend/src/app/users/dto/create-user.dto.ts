import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from '../../../generated/prisma/index.js';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: 'senha123',
    minLength: 6,
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
  })
  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @ApiProperty({
    description: 'Nome de usuário único',
    example: 'joaosilva',
  })
  @IsString({ message: 'O nome de usuário deve ser uma string' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  username: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: Role,
    example: Role.USER,
  })
  @IsString({ message: 'O Role deve ser uma string' })
  @IsNotEmpty({ message: 'O Role é obrigatório' })
  @IsEnum(Role, { message: 'Role inválido' })
  role: Role;
}
