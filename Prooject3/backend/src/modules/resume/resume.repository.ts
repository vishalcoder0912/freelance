import { PrismaClient, ResumeAnalysis } from '@prisma/client';

export class ResumeAnalysisRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<ResumeAnalysis> {
    return this.prisma.resumeAnalysis.create({ data });
  }

  async findById(id: string): Promise<ResumeAnalysis | null> {
    return this.prisma.resumeAnalysis.findUnique({ where: { id } });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<ResumeAnalysis[]> {
    return this.prisma.resumeAnalysis.findMany(params);
  }

  async findByUser(userId: string): Promise<ResumeAnalysis[]> {
    return this.prisma.resumeAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findLatestByUser(userId: string): Promise<ResumeAnalysis | null> {
    const analyses = await this.prisma.resumeAnalysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 1
    });
    return analyses[0] || null;
  }

  async update(id: string, data: any): Promise<ResumeAnalysis> {
    return this.prisma.resumeAnalysis.update({ where: { id }, data });
  }

  async delete(id: string): Promise<ResumeAnalysis> {
    return this.prisma.resumeAnalysis.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.resumeAnalysis.count({ where });
  }

  async getAverageAtsScore(userId: string): Promise<number> {
    const result = await this.prisma.resumeAnalysis.aggregate({
      where: { userId, atsScore: { not: null } },
      _avg: { atsScore: true }
    });
    return result._avg.atsScore || 0;
  }
}
