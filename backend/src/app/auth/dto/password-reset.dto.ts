import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestResetDto {
  @ApiProperty({
    description: 'E-mail ou nome de usuário para solicitação',
    example: 'usuario@exemplo.com',
  })
  @IsString({ message: 'Identificador (email ou username) é obrigatório' })
  @IsNotEmpty({ message: 'Identificador não pode ser vazio' })
  identifier: string;
}

export class VerifyResetCodeDto {
  @ApiProperty({
    description: 'E-mail ou nome de usuário vinculado à solicitação',
    example: 'usuario@exemplo.com',
  })
  @IsString({ message: 'Identificador é obrigatório' })
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({
    description: 'Código de 6 dígitos recebido por e-mail',
    example: '123456',
  })
  @IsString({ message: 'Código é obrigatório' })
  @IsNotEmpty()
  code: string;
}

export class ConfirmResetDto {
  @ApiProperty({
    description: 'Token recebido após a verificação do código',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Token é obrigatório' })
  @IsNotEmpty()
  resetToken: string;

  @ApiProperty({
    description: 'Nova senha (mínimo 6 caracteres)',
    example: 'novaSenha123',
    minLength: 6,
  })
  @IsString({ message: 'A nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'novaSenha123',
  })
  @IsString({ message: 'A confirmação deve ser uma string' })
  @IsNotEmpty({ message: 'A confirmação é obrigatória' })
  passwordConfirmation: string;
}
