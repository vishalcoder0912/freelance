import { PrismaClient } from '@prisma/client';

export class EmployerRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any) {
    return this.prisma.employer.create({ data });
  }

  async findById(id: string) {
    return this.prisma.employer.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return this.prisma.employer.findUnique({ where: { email } });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }) {
    return this.prisma.employer.findMany(params);
  }

  async update(id: string, data: any) {
    return this.prisma.employer.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.employer.delete({ where: { id } });
  }

  async count(where?: any) {
    return this.prisma.employer.count({ where });
  }

  async findActive() {
    return this.prisma.employer.findMany({ where: { isActive: true } });
  }

  async verify(id: string) {
    return this.prisma.employer.update({
      where: { id },
      data: { isVerified: true }
    });
  }
}

export class MentorProfileRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any) {
    return this.prisma.mentorProfile.create({ data });
  }

  async findById(id: string) {
    return this.prisma.mentorProfile.findUnique({ where: { id } });
  }

  async findByUserId(userId: string) {
    return this.prisma.mentorProfile.findUnique({ where: { userId } });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }) {
    return this.prisma.mentorProfile.findMany(params);
  }

  async update(id: string, data: any) {
    return this.prisma.mentorProfile.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.mentorProfile.delete({ where: { id } });
  }

  async count(where?: any) {
    return this.prisma.mentorProfile.count({ where });
  }

  async findAvailable() {
    return this.prisma.mentorProfile.findMany({
      where: { isAvailable: true },
      include: { user: true }
    });
  }

  async incrementSessions(id: string) {
    return this.prisma.mentorProfile.update({
      where: { id },
      data: { totalSessions: { increment: 1 } }
    });
  }

  async updateRating(id: string, rating: number) {
    return this.prisma.mentorProfile.update({
      where: { id },
      data: { rating }
    });
  }
}
