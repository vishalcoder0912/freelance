import { PrismaClient, Application, ApplicationStatus } from '@prisma/client';

export class ApplicationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Application> {
    return this.prisma.application.create({ data });
  }

  async findById(id: string, include?: any): Promise<Application | null> {
    return this.prisma.application.findUnique({ where: { id }, include });
  }

  async findByJobAndUser(jobId: string, userId: string): Promise<Application | null> {
    return this.prisma.application.findUnique({
      where: { jobId_userId: { jobId, userId } }
    });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Application[]> {
    return this.prisma.application.findMany(params);
  }

  async findByUser(userId: string): Promise<Application[]> {
    return this.prisma.application.findMany({
      where: { userId },
      include: { job: { include: { employer: true } } }
    });
  }

  async findByJob(jobId: string): Promise<Application[]> {
    return this.prisma.application.findMany({
      where: { jobId },
      include: { user: true }
    });
  }

  async update(id: string, data: any): Promise<Application> {
    return this.prisma.application.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: ApplicationStatus): Promise<Application> {
    return this.prisma.application.update({ where: { id }, data: { status } });
  }

  async delete(id: string): Promise<Application> {
    return this.prisma.application.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.application.count({ where });
  }

  async hasApplied(jobId: string, userId: string): Promise<boolean> {
    const application = await this.prisma.application.findUnique({
      where: { jobId_userId: { jobId, userId } }
    });
    return !!application;
  }

  async getApplicationStats(jobId: string) {
    const [total, pending, reviewed, shortlisted, accepted, rejected] = await Promise.all([
      this.count({ jobId }),
      this.prisma.application.count({ where: { jobId, status: ApplicationStatus.PENDING } }),
      this.prisma.application.count({ where: { jobId, status: ApplicationStatus.REVIEWED } }),
      this.prisma.application.count({ where: { jobId, status: ApplicationStatus.SHORTLISTED } }),
      this.prisma.application.count({ where: { jobId, status: ApplicationStatus.ACCEPTED } }),
      this.prisma.application.count({ where: { jobId, status: ApplicationStatus.REJECTED } })
    ]);

    return { total, pending, reviewed, shortlisted, accepted, rejected };
  }
}
