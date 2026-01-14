import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../services/database/database.service.js';
import { User } from '../../generated/prisma/index.js';
import { RegisterDto } from './dto/register.dto.js';
import { UpdatePasswordDto } from './dto/update-password.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name, username } = dto;

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
        data: { email, password: hashedPassword, name, username },
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

  async updatePassword(id: string, dto: UpdatePasswordDto) {
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
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    };
  }
}
