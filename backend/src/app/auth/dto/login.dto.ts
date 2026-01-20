import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail ou nome de usuário',
    example: 'admin',
  })
  @IsString({ message: 'O identificador deve ser uma string' })
  @IsNotEmpty({ message: 'O e-mail ou nome de usuário é obrigatório' })
  identifier: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @IsString({ message: 'A senha deve ser uma string' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password: string;
}
