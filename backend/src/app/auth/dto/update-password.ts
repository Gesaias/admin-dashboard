import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Nova senha do usuário (mínimo 6 caracteres)',
    example: 'novaSenha123',
    minLength: 6,
  })
  @IsString({ message: 'A nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'A nova senha é obrigatória' })
  @MinLength(6, {
    message: 'A nova senha deve ter pelo menos 6 caracteres',
  })
  password: string;

  @ApiProperty({
    description: 'Confirmação da nova senha',
    example: 'novaSenha123',
    minLength: 6,
  })
  @IsString({ message: 'A confirmação de senha deve ser uma string' })
  @IsNotEmpty({ message: 'A confirmação de senha é obrigatória' })
  @MinLength(6, {
    message: 'A confirmação de senha deve ter pelo menos 6 caracteres',
  })
  passwordConfirmation: string;
}
