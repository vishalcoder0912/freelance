import { PrismaClient, Assignment } from '@prisma/client';

export class AssignmentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Assignment> {
    return this.prisma.assignment.create({ data });
  }

  async findById(id: string, include?: any): Promise<Assignment | null> {
    return this.prisma.assignment.findUnique({ where: { id }, include });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Assignment[]> {
    return this.prisma.assignment.findMany(params);
  }

  async findByProgram(programId: string): Promise<Assignment[]> {
    return this.prisma.assignment.findMany({
      where: { programId },
      include: { submissions: true }
    });
  }

  async update(id: string, data: any): Promise<Assignment> {
    return this.prisma.assignment.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Assignment> {
    return this.prisma.assignment.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.assignment.count({ where });
  }

  async findActiveByProgram(programId: string): Promise<Assignment[]> {
    return this.prisma.assignment.findMany({
      where: { programId, isActive: true }
    });
  }
}

export class SubmissionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any) {
    return this.prisma.submission.create({ data });
  }

  async findById(id: string, include?: any) {
    return this.prisma.submission.findUnique({ where: { id }, include });
  }

  async findByAssignmentAndUser(assignmentId: string, userId: string) {
    return this.prisma.submission.findUnique({
      where: { assignmentId_userId: { assignmentId, userId } }
    });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }) {
    return this.prisma.submission.findMany(params);
  }

  async findByAssignment(assignmentId: string) {
    return this.prisma.submission.findMany({
      where: { assignmentId },
      include: { user: true }
    });
  }

  async findByUser(userId: string) {
    return this.prisma.submission.findMany({
      where: { userId },
      include: { assignment: true }
    });
  }

  async update(id: string, data: any) {
    return this.prisma.submission.update({ where: { id }, data });
  }

  async review(id: string, score: number, feedback: string, reviewedBy: string) {
    return this.prisma.submission.update({
      where: { id },
      data: { score, feedback, reviewedBy, reviewedAt: new Date() }
    });
  }

  async delete(id: string) {
    return this.prisma.submission.delete({ where: { id } });
  }

  async count(where?: any) {
    return this.prisma.submission.count({ where });
  }
}
