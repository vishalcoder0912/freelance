import { PrismaClient, Notification, NotificationType } from '@prisma/client';

export class NotificationRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }

  async findById(id: string): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<Notification[]> {
    return this.prisma.notification.findMany(params);
  }

  async findByUser(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findUnreadByUser(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId, isRead: false },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByType(userId: string, type: NotificationType): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId, type },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: any): Promise<Notification> {
    return this.prisma.notification.update({ where: { id }, data });
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });
    return result.count;
  }

  async delete(id: string): Promise<Notification> {
    return this.prisma.notification.delete({ where: { id } });
  }

  async deleteAllByUser(userId: string): Promise<number> {
    const result = await this.prisma.notification.deleteMany({
      where: { userId }
    });
    return result.count;
  }

  async count(where?: any): Promise<number> {
    return this.prisma.notification.count({ where });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({
      where: { userId, isRead: false }
    });
  }

  async createBulk(notifications: Array<{
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    metadata?: any;
  }>): Promise<number> {
    const result = await this.prisma.notification.createMany({
      data: notifications
    });
    return result.count;
  }
}
