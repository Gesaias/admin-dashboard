import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from '../../services/database/database.service.js';
import { User } from '../../generated/prisma/index.js';
import { RegisterDto } from './dto/register.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const { email, password, name } = dto;

    const existingEmail = await this.db.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('E-mail já vinculado em outra conta');
    }

    const existingName = await this.db.user.findFirst({ where: { name } });
    if (existingName) {
      throw new ConflictException('Usuário já existe');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.db.user.create({
        data: { email, password: hashedPassword, name },
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
          OR: [{ email: identifier }, { name: identifier }],
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

  private generateToken(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
