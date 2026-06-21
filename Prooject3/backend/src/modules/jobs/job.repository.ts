import { PrismaClient, Job, JobType } from '@prisma/client';

export class JobRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Job> {
    return this.prisma.job.create({ data });
  }

  async findById(id: string, include?: any): Promise<Job | null> {
    return this.prisma.job.findUnique({ where: { id }, include });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Job[]> {
    return this.prisma.job.findMany(params);
  }

  async findByEmployer(employerId: string): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { employerId },
      include: { employer: true }
    });
  }

  async findByRecruiter(recruiterId: string): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { recruiterId },
      include: { employer: true }
    });
  }

  async update(id: string, data: any): Promise<Job> {
    return this.prisma.job.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Job> {
    return this.prisma.job.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.job.count({ where });
  }

  async search(query: string): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ],
        isActive: true
      },
      include: { employer: true }
    });
  }

  async findByType(jobType: JobType): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { jobType, isActive: true }
    });
  }

  async findActiveJobs(): Promise<Job[]> {
    return this.prisma.job.findMany({
      where: { isActive: true },
      include: { employer: true }
    });
  }

  async findJobsWithApplications() {
    return this.prisma.job.findMany({
      where: { isActive: true },
      include: {
        employer: true,
        _count: { select: { applications: true } }
      }
    });
  }
}
