import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsString({ message: 'O identificador deve ser uma string' })
  @IsNotEmpty({ message: 'O e-mail ou nome de usuário é obrigatório' })
  identifier: string;

  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}
