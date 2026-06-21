import { PrismaClient, Placement } from '@prisma/client';

export class PlacementRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Placement> {
    return this.prisma.placement.create({ data });
  }

  async findById(id: string, include?: any): Promise<Placement | null> {
    return this.prisma.placement.findUnique({ where: { id }, include });
  }

  async findByApplicationId(applicationId: string): Promise<Placement | null> {
    return this.prisma.placement.findUnique({
      where: { applicationId }
    });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Placement[]> {
    return this.prisma.placement.findMany(params);
  }

  async findByUser(userId: string): Promise<Placement[]> {
    return this.prisma.placement.findMany({
      where: { userId },
      include: { job: { include: { employer: true } } }
    });
  }

  async findByJob(jobId: string): Promise<Placement[]> {
    return this.prisma.placement.findMany({
      where: { jobId },
      include: { user: true }
    });
  }

  async update(id: string, data: any): Promise<Placement> {
    return this.prisma.placement.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Placement> {
    return this.prisma.placement.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.placement.count({ where });
  }

  async getPlacementStats() {
    const [total, pending, accepted, rejected] = await Promise.all([
      this.count(),
      this.prisma.placement.count({ where: { status: 'PENDING' } }),
      this.prisma.placement.count({ where: { status: 'ACCEPTED' } }),
      this.prisma.placement.count({ where: { status: 'REJECTED' } })
    ]);

    return { total, pending, accepted, rejected };
  }

  async getPlacementRate() {
    const totalPlacements = await this.count();
    const acceptedPlacements = await this.prisma.placement.count({
      where: { status: 'ACCEPTED' }
    });

    return totalPlacements > 0 ? (acceptedPlacements / totalPlacements) * 100 : 0;
  }

  async getAverageCtc() {
    const result = await this.prisma.placement.aggregate({
      where: { status: 'ACCEPTED', ctc: { not: null } },
      _avg: { ctc: true },
      _count: { ctc: true }
    });

    return {
      averageCtc: result._avg.ctc || 0,
      totalPlacements: result._count.ctc
    };
  }
}
