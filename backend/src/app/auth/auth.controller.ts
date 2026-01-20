import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Patch,
  Param,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { IsPublic } from './decorators/is-public.decorator.js';
import { Roles } from './decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/index.js';
import {
  ConfirmResetDto,
  RequestResetDto,
  VerifyResetCodeDto,
} from './dto/password-reset.dto.js';
import { UpdatePasswordDto } from './dto/update-password.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @IsPublic()
  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  requestReset(@Body() dto: RequestResetDto) {
    return this.authService.requestPasswordReset(dto.identifier);
  }

  @IsPublic()
  @Post('password-reset/verify')
  @HttpCode(HttpStatus.OK)
  verifyCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(dto.identifier, dto.code);
  }

  @IsPublic()
  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  confirmReset(@Body() dto: ConfirmResetDto) {
    return this.authService.confirmPasswordReset(dto);
  }

  // @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/password')
  @HttpCode(HttpStatus.OK)
  updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() req: any,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req.user.userId as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const role = req.user.role as Role;

    return this.authService.updatePassword(id, updatePasswordDto, {
      id: userId,
      role: role,
    });
  }
}
