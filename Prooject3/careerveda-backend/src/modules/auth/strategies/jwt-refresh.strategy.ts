import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';

export interface RefreshJwtPayload {
  sub: string;
  email: string;
  role: Role;
  type: 'refresh';
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'your-super-secret-jwt-key-change-in-production',
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: RefreshJwtPayload) {
    const refreshToken = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const session = await this.prisma.session.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = session.user;
    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('User inactive');
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      sessionId: session.id,
    };
  }
}