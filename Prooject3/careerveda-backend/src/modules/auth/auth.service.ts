import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto, UserResponseDto } from './dto/auth-response.dto';
import { Role, Status } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        role: dto.role || Role.STUDENT,
        status: Status.ACTIVE,
      },
    });

    if (dto.role === Role.STUDENT || !dto.role) {
      await this.prisma.student.create({
        data: { userId: user.id },
      });
    } else if (dto.role === Role.MENTOR) {
      await this.prisma.mentor.create({
        data: {
          userId: user.id,
          company: '',
          designation: '',
          experience: 0,
        },
      });
    }

    return this.generateAuthResponse(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        student: true,
        mentor: true,
        recruiter: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status !== Status.ACTIVE) {
      throw new UnauthorizedException('Account is not active');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.session.deleteMany({
      where: { userId: user.id, expiresAt: { lt: new Date() } },
    });

    return this.generateAuthResponse(user);
  }

  async refreshTokens(userId: string, sessionId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        mentor: true,
        recruiter: true,
      },
    });

    if (!user || user.status !== Status.ACTIVE) {
      throw new UnauthorizedException('User not found or inactive');
    }

    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    await this.prisma.session.delete({
      where: { id: sessionId },
    });

    const tokens = this.generateTokens(user);
    await this.createSession(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(sessionId: string): Promise<void> {
    await this.prisma.session.delete({
      where: { id: sessionId },
    }).catch(() => {});
  }

  async getProfile(userId: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        mentor: true,
        recruiter: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UserResponseDto.fromUser(user);
  }

  private async generateAuthResponse(user: any): Promise<AuthResponseDto> {
    const tokens = this.generateTokens(user);
    await this.createSession(user.id, tokens.refreshToken);

    return {
      user: UserResponseDto.fromUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private generateTokens(user: any): { accessToken: string; refreshToken: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: (this.configService.get<string>('jwt.accessTokenExpiry') || '15m') as any,
    });

    const refreshToken = this.jwtService.sign(
      { ...payload, type: 'refresh' },
      {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: (this.configService.get<string>('jwt.refreshTokenExpiry') || '7d') as any,
      },
    );

    return { accessToken, refreshToken };
  }

  private async createSession(userId: string, refreshToken: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.session.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });
  }

  async validateUser(userId: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        student: true,
        mentor: true,
        recruiter: true,
      },
    });

    if (!user || user.status !== Status.ACTIVE) {
      return null;
    }

    return user;
  }
}