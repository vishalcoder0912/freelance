import { PrismaClient, AuditLog } from '@prisma/client';

export class AuditLogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<AuditLog> {
    return this.prisma.auditLog.create({ data });
  }

  async findById(id: string): Promise<AuditLog | null> {
    return this.prisma.auditLog.findUnique({ where: { id } });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany(params);
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { entity, entityId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      where: { action },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: any): Promise<AuditLog> {
    return this.prisma.auditLog.update({ where: { id }, data });
  }

  async delete(id: string): Promise<AuditLog> {
    return this.prisma.auditLog.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.auditLog.count({ where });
  }

  async logAction(
    userId: string | null,
    action: string,
    entity: string,
    entityId: string | null,
    oldValues?: any,
    newValues?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<AuditLog> {
    return this.create({
      userId,
      action,
      entity,
      entityId,
      oldValues,
      newValues,
      ipAddress,
      userAgent
    });
  }

  async getRecentActivity(limit: number = 10): Promise<AuditLog[]> {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { user: true }
    });
  }
}
