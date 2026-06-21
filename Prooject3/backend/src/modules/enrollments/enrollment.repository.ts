import { PrismaClient, Enrollment, EnrollmentStatus } from '@prisma/client';

export class EnrollmentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Enrollment> {
    return this.prisma.enrollment.create({ data });
  }

  async findById(id: string, include?: any): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({ where: { id }, include });
  }

  async findByUserAndProgram(userId: string, programId: string): Promise<Enrollment | null> {
    return this.prisma.enrollment.findUnique({
      where: { userId_programId: { userId, programId } }
    });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany(params);
  }

  async findByUser(userId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { userId },
      include: { program: true }
    });
  }

  async findByProgram(programId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { programId },
      include: { user: true }
    });
  }

  async update(id: string, data: any): Promise<Enrollment> {
    return this.prisma.enrollment.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: EnrollmentStatus): Promise<Enrollment> {
    return this.prisma.enrollment.update({ where: { id }, data: { status } });
  }

  async updateProgress(id: string, progress: number): Promise<Enrollment> {
    return this.prisma.enrollment.update({ where: { id }, data: { progress } });
  }

  async delete(id: string): Promise<Enrollment> {
    return this.prisma.enrollment.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.enrollment.count({ where });
  }

  async findActiveByProgram(programId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { programId, status: EnrollmentStatus.ACTIVE }
    });
  }

  async findCompletedByUser(userId: string): Promise<Enrollment[]> {
    return this.prisma.enrollment.findMany({
      where: { userId, status: EnrollmentStatus.COMPLETED }
    });
  }

  async hasEnrolled(userId: string, programId: string): Promise<boolean> {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_programId: { userId, programId } }
    });
    return !!enrollment;
  }

  async getEnrollmentStats(programId: string) {
    const [total, active, completed, dropped] = await Promise.all([
      this.count({ programId }),
      this.prisma.enrollment.count({ where: { programId, status: EnrollmentStatus.ACTIVE } }),
      this.prisma.enrollment.count({ where: { programId, status: EnrollmentStatus.COMPLETED } }),
      this.prisma.enrollment.count({ where: { programId, status: EnrollmentStatus.DROPPED } })
    ]);

    return { total, active, completed, dropped };
  }
}
