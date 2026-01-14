import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { IsPublic } from './decorators/is-public.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/index.js';
import { UpdatePasswordDto } from './dto/update-password.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @IsPublic()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @IsPublic()
  @Patch(':id/password')
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(id, updatePasswordDto);
  }
}
