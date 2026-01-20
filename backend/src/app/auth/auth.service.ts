/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DatabaseService } from '../../services/database/database.service.js';
import { User, Role } from '../../generated/prisma/index.js';
import { RegisterDto } from './dto/register.dto.js';
import { UpdatePasswordDto } from './dto/update-password.js';
import { UsersService } from '../users/users.service.js';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfirmResetDto } from './dto/password-reset.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name, username, role } = dto;

    const existingEmail = await this.db.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('E-mail já vinculado em outra conta');
    }

    const existingUsername = await this.db.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      throw new ConflictException('Nome de usuário já existe');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.db.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          username,
          role,
          suspended: false,
        },
      });
      return this.generateToken(user);
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  async login(identifier: string, password: string) {
    try {
      const user = await this.db.user.findFirst({
        where: {
          OR: [{ email: identifier }, { username: identifier }],
          AND: [{ suspended: false }],
        },
      });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new UnauthorizedException('Credenciais inválidas');
      }
      return this.generateToken(user);
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async requestPasswordReset(identifier: string) {
    const user = await this.db.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });

    if (!user) {
      return { message: 'Se o usuário existir, um código foi enviado.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this.db.passwordReset.create({
      data: {
        userId: user.id,
        code,
        expiresAt,
      },
    });

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Recuperação de Senha - Código de Validação',
        text: `Olá ${user.name},\n\nSeu código de validação para alteração de senha é: ${code}\n\nEste código expira em 2 minutos.`,
      });
    } catch (error) {
      console.error('❌ Mail error:', error);
      throw new InternalServerErrorException('Erro ao enviar e-mail');
    }

    return { message: 'Código enviado com sucesso para o e-mail cadastrado' };
  }

  async verifyResetCode(identifier: string, code: string) {
    const user = await this.db.user.findFirst({
      where: { OR: [{ email: identifier }, { username: identifier }] },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const masterCodeEntry = await this.db.systemConfig.findFirst({
      where: { key: 'MASTER_RESET_CODE' },
    });
    const isMasterCode = masterCodeEntry && code === masterCodeEntry.value;

    if (!isMasterCode) {
      const resetEntry = await this.db.passwordReset.findFirst({
        where: {
          userId: user.id,
          code,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!resetEntry) {
        throw new BadRequestException('Código inválido ou expirado');
      }
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = new Date(Date.now() + 2 * 60 * 1000);

    await this.db.passwordReset.create({
      data: {
        userId: user.id,
        code: isMasterCode ? 'MASTER_USED' : code,
        token: resetToken,
        expiresAt: tokenExpiresAt,
      },
    });

    return { resetToken };
  }

  async confirmPasswordReset(dto: ConfirmResetDto) {
    const { resetToken, password, passwordConfirmation } = dto;

    const resetEntry = await this.db.passwordReset.findUnique({
      where: { token: resetToken },
      include: { user: true },
    });

    if (!resetEntry || resetEntry.expiresAt < new Date()) {
      throw new BadRequestException('Token de reset inválido ou expirado');
    }

    if (password !== passwordConfirmation) {
      const newTokenExpiresAt = new Date(Date.now() + 2 * 60 * 1000);
      await this.db.passwordReset.update({
        where: { id: resetEntry.id },
        data: { expiresAt: newTokenExpiresAt },
      });
      throw new BadRequestException('As senhas não coincidem. Token renovado.');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await this.db.user.update({
        where: { id: resetEntry.userId },
        data: { password: hashedPassword },
      });

      await this.db.passwordReset.deleteMany({
        where: { userId: resetEntry.userId },
      });

      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      console.error('❌ Reset confirmation error:', error);
      throw new InternalServerErrorException('Erro ao processar alteração');
    }
  }

  async updatePassword(
    id: string,
    dto: UpdatePasswordDto,
    currentUser: { id: string; role: Role },
  ) {
    const targetUser = await this.db.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!targetUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const isSelf = currentUser.id === id;
    const isAdmin = currentUser.role === Role.ADMIN;
    const isManager = currentUser.role === Role.MANAGER;
    const targetIsUser = targetUser.role === Role.USER;

    if (!isSelf && !isAdmin && !(isManager && targetIsUser)) {
      throw new ForbiddenException(
        'Você não tem permissão para alterar a senha deste usuário',
      );
    }

    const { password, passwordConfirmation } = dto;

    if (password !== passwordConfirmation) {
      throw new BadRequestException('As senhas não coincidem');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await this.usersService.updatePassword(id, { hashedPassword });
    } catch (error) {
      console.error('❌ Update password error:', error);
      throw error;
    }
  }

  private generateToken(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      suspended: user.suspended,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
        suspended: user.suspended,
      },
    };
  }
}
