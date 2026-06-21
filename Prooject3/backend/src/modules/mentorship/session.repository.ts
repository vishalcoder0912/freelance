import { PrismaClient, MentorSession } from '@prisma/client';

export class MentorSessionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<MentorSession> {
    return this.prisma.mentorSession.create({ data });
  }

  async findById(id: string): Promise<MentorSession | null> {
    return this.prisma.mentorSession.findUnique({
      where: { id },
      include: { mentor: true, student: true }
    });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<MentorSession[]> {
    return this.prisma.mentorSession.findMany(params);
  }

  async findByMentor(mentorId: string): Promise<MentorSession[]> {
    return this.prisma.mentorSession.findMany({
      where: { mentorId },
      include: { student: true },
      orderBy: { scheduledAt: 'desc' }
    });
  }

  async findByStudent(studentId: string): Promise<MentorSession[]> {
    return this.prisma.mentorSession.findMany({
      where: { studentId },
      include: { mentor: true },
      orderBy: { scheduledAt: 'desc' }
    });
  }

  async findUpcoming(mentorId: string): Promise<MentorSession[]> {
    return this.prisma.mentorSession.findMany({
      where: {
        mentorId,
        scheduledAt: { gte: new Date() },
        status: 'SCHEDULED'
      },
      include: { student: true },
      orderBy: { scheduledAt: 'asc' }
    });
  }

  async update(id: string, data: any): Promise<MentorSession> {
    return this.prisma.mentorSession.update({ where: { id }, data });
  }

  async complete(id: string, notes?: string, rating?: number): Promise<MentorSession> {
    return this.prisma.mentorSession.update({
      where: { id },
      data: { status: 'COMPLETED', notes, rating }
    });
  }

  async cancel(id: string): Promise<MentorSession> {
    return this.prisma.mentorSession.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
  }

  async delete(id: string): Promise<MentorSession> {
    return this.prisma.mentorSession.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.mentorSession.count({ where });
  }

  async hasConflict(mentorId: string, scheduledAt: Date, duration: number, excludeId?: string): Promise<boolean> {
    const endTime = new Date(scheduledAt.getTime() + duration * 60000);
    
    const conflict = await this.prisma.mentorSession.findFirst({
      where: {
        mentorId,
        status: 'SCHEDULED',
        id: excludeId ? { not: excludeId } : undefined,
        scheduledAt: { lt: endTime },
        // Check if there's an overlap
      }
    });

    return !!conflict;
  }
}
