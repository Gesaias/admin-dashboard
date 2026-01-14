import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'A nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @MinLength(6, {
    message: 'A nova senha deve ter pelo menos 6 caracteres',
  })
  password: string;

  @IsString({ message: 'A confirmação de senha deve ser uma string' })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter pelo menos 6 caracteres',
  })
  passwordConfirmation: string;
}
