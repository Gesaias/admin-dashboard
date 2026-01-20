import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RequestResetDto {
  @IsString({ message: 'Identificador (email ou username) é obrigatório' })
  @IsNotEmpty({ message: 'Identificador não pode ser vazio' })
  identifier: string;
}

export class VerifyResetCodeDto {
  @IsString({ message: 'Identificador é obrigatório' })
  @IsNotEmpty()
  identifier: string;

  @IsString({ message: 'Código é obrigatório' })
  @IsNotEmpty()
  code: string;
}

export class ConfirmResetDto {
  @IsString({ message: 'Token é obrigatório' })
  @IsNotEmpty()
  resetToken: string;

  @IsString({ message: 'A nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsString({ message: 'A confirmação deve ser uma string' })
  @IsNotEmpty({ message: 'A confirmação é obrigatória' })
  passwordConfirmation: string;
}
