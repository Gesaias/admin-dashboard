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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
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

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiBearerAuth()
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @IsPublic()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.identifier, loginDto.password);
  }

  @IsPublic()
  @Post('password-reset/request')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  @ApiResponse({
    status: 200,
    description: 'Código de redefinição enviado por e-mail',
  })
  requestReset(@Body() dto: RequestResetDto) {
    return this.authService.requestPasswordReset(dto.identifier);
  }

  @IsPublic()
  @Post('password-reset/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar código de redefinição' })
  @ApiResponse({ status: 200, description: 'Código verificado com sucesso' })
  @ApiResponse({ status: 400, description: 'Código inválido ou expirado' })
  verifyCode(@Body() dto: VerifyResetCodeDto) {
    return this.authService.verifyResetCode(dto.identifier, dto.code);
  }

  @IsPublic()
  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirmar redefinição de senha' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  confirmReset(@Body() dto: ConfirmResetDto) {
    return this.authService.confirmPasswordReset(dto);
  }

  // @Roles(Role.ADMIN, Role.MANAGER)
  @Patch(':id/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar senha do usuário (perfil)' })
  @ApiResponse({ status: 200, description: 'Senha atualizada com sucesso' })
  @ApiBearerAuth()
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
