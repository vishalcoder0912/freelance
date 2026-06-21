import { PrismaClient, Payment, PaymentStatus } from '@prisma/client';

export class PaymentRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: any): Promise<Payment> {
    return this.prisma.payment.create({ data });
  }

  async findById(id: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async findByRazorpayPaymentId(razorpayPaymentId: string): Promise<Payment | null> {
    return this.prisma.payment.findUnique({ where: { razorpayPaymentId } });
  }

  async findByRazorpayOrderId(razorpayOrderId: string): Promise<Payment | null> {
    return this.prisma.payment.findFirst({ where: { razorpayOrderId } });
  }

  async findMany(params: {
    where?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
    include?: any;
  }): Promise<Payment[]> {
    return this.prisma.payment.findMany(params);
  }

  async findByUser(userId: string): Promise<Payment[]> {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: string, data: any): Promise<Payment> {
    return this.prisma.payment.update({ where: { id }, data });
  }

  async updateStatus(id: string, status: PaymentStatus): Promise<Payment> {
    return this.prisma.payment.update({ where: { id }, data: { status } });
  }

  async completePayment(id: string, razorpayPaymentId: string, razorpaySignature: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.COMPLETED,
        razorpayPaymentId,
        razorpaySignature
      }
    });
  }

  async refundPayment(id: string, refundId: string, refundAmount: number, reason?: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.REFUNDED,
        refundId,
        refundAmount,
        refundReason: reason
      }
    });
  }

  async partialRefund(id: string, refundId: string, refundAmount: number, reason?: string): Promise<Payment> {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.PARTIAL_REFUND,
        refundId,
        refundAmount,
        refundReason: reason
      }
    });
  }

  async delete(id: string): Promise<Payment> {
    return this.prisma.payment.delete({ where: { id } });
  }

  async count(where?: any): Promise<number> {
    return this.prisma.payment.count({ where });
  }

  async getRevenueByDateRange(startDate: Date, endDate: Date) {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: PaymentStatus.COMPLETED,
        createdAt: { gte: startDate, lte: endDate }
      }
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalTransactions = payments.length;

    return { totalRevenue, totalTransactions, payments };
  }

  async getMonthlyRevenue(year: number) {
    const payments = await this.prisma.payment.findMany({
      where: {
        status: PaymentStatus.COMPLETED,
        createdAt: {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1)
        }
      }
    });

    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: 0,
      transactions: 0
    }));

    payments.forEach(payment => {
      const month = payment.createdAt.getMonth();
      monthlyData[month].revenue += Number(payment.amount);
      monthlyData[month].transactions += 1;
    });

    return monthlyData;
  }
}
