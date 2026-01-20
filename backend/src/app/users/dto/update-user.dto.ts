import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto.js';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password'] as const),
) {
  @ApiProperty({
    description: 'Status de suspensão do usuário',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  suspended?: boolean;
}
