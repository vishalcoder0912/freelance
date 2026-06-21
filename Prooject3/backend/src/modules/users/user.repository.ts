import { PrismaClient, User, Role } from '@prisma/client';

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<User> {
    return this.prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { firebaseUid } });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<User[]> {
    return this.prisma.user.findMany(params);
  }

  async update(id: string, data: any): Promise<User> {
    return this.prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<User> {
    return this.prisma.user.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.user.count({ where });
  }

  async findByRole(role: Role): Promise<User[]> {
    return this.prisma.user.findMany({ where: { role } });
  }

  async incrementLoginAttempts(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { loginAttempts: { increment: 1 } }
    });
  }

  async resetLoginAttempts(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { loginAttempts: 0, lastLoginAt: new Date() }
    });
  }

  async lockAccount(id: string, reason: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isLocked: true, lockedAt: new Date(), lockedReason: reason }
    });
  }

  async unlockAccount(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { isLocked: false, lockedAt: null, lockedReason: null, loginAttempts: 0 }
    });
  }

  async setResetToken(id: string, token: string, expiry: Date): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { resetToken: token, resetTokenExpiry: expiry }
    });
  }

  async clearResetToken(id: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { resetToken: null, resetTokenExpiry: null }
    });
  }

  async setOtp(id: string, otp: string, expiry: Date): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { otp, otpExpiry: expiry }
    });
  }

  async verifyOtp(id: string, otp: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || user.otp !== otp || !user.otpExpiry) {
      return false;
    }
    if (new Date() > user.otpExpiry) {
      return false;
    }
    await this.prisma.user.update({
      where: { id },
      data: { otp: null, otpExpiry: null, isEmailVerified: true }
    });
    return true;
  }
}
