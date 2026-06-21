import { PrismaClient, Project } from '@prisma/client';

export class ProjectRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Project> {
    return this.prisma.project.create({ data });
  }

  async findById(id: string, include?: any): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id }, include });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Project[]> {
    return this.prisma.project.findMany(params);
  }

  async findByUser(userId: string): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { userId }
    });
  }

  async update(id: string, data: any): Promise<Project> {
    return this.prisma.project.update({ where: { id }, data });
  }

  async review(id: string, score: number, feedback: string, reviewedBy: string): Promise<Project> {
    return this.prisma.project.update({
      where: { id },
      data: { score, feedback, reviewedBy, reviewedAt: new Date() }
    });
  }

  async delete(id: string): Promise<Project> {
    return this.prisma.project.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.project.count({ where });
  }

  async findByGithubUrl(githubUrl: string): Promise<Project | null> {
    return this.prisma.project.findFirst({ where: { githubUrl } });
  }

  async hasSubmitted(githubUrl: string, userId: string): Promise<boolean> {
    const project = await this.prisma.project.findFirst({
      where: { githubUrl, userId }
    });
    return !!project;
  }
}
