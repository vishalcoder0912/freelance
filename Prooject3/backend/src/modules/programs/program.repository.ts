import { PrismaClient, Program, DifficultyLevel } from '@prisma/client';

export class ProgramRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Program> {
    return this.prisma.program.create({ data });
  }

  async findById(id: string, include?: any): Promise<Program | null> {
    return this.prisma.program.findUnique({ where: { id }, include });
  }

  async findBySlug(slug: string, include?: any): Promise<Program | null> {
    return this.prisma.program.findUnique({ where: { slug }, include });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Program[]> {
    return this.prisma.program.findMany(params);
  }

  async update(id: string, data: any): Promise<Program> {
    return this.prisma.program.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Program> {
    return this.prisma.program.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.program.count({ where });
  }

  async search(query: string): Promise<Program[]> {
    return this.prisma.program.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } }
        ],
        isActive: true
      }
    });
  }

  async findByCategory(category: string): Promise<Program[]> {
    return this.prisma.program.findMany({
      where: { category, isActive: true }
    });
  }

  async findFeatured(): Promise<Program[]> {
    return this.prisma.program.findMany({
      where: { isFeatured: true, isActive: true }
    });
  }

  async incrementStudents(id: string): Promise<Program> {
    return this.prisma.program.update({
      where: { id },
      data: { currentStudents: { increment: 1 } }
    });
  }

  async decrementStudents(id: string): Promise<Program> {
    return this.prisma.program.update({
      where: { id },
      data: { currentStudents: { decrement: 1 } }
    });
  }

  async updateRating(id: string, rating: number, totalReviews: number): Promise<Program> {
    return this.prisma.program.update({
      where: { id },
      data: { rating, totalReviews }
    });
  }
}
