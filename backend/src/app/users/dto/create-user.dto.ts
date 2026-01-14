import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';
import { Role } from '../../../generated/prisma/index.js';

export class CreateUserDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsString({ message: 'O nome deve ser uma string' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsString({ message: 'O nome de usuário deve ser uma string' })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório' })
  username: string;

  @IsString({ message: 'O Role deve ser uma string' })
  @IsNotEmpty({ message: 'O Role é obrigatório' })
  @IsEnum(Role, { message: 'Role inválido' })
  role: Role;
}
