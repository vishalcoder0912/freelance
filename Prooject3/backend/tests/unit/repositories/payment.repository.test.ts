import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, PaymentStatus } from '@prisma/client';
import { PaymentRepository } from '../../../src/modules/payments/payment.repository.js';
import { UserFactory, PaymentFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('PaymentRepository', () => {
  let prisma: PrismaClient;
  let repository: PaymentRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new PaymentRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const user = await UserFactory.create();

      const payment = await repository.create({
        userId: user.id,
        amount: 9999,
        currency: 'INR',
        status: PaymentStatus.PENDING,
      });

      expect(payment).toBeDefined();
      expect(payment.id).toBeDefined();
      expect(payment.userId).toBe(user.id);
      expect(payment.status).toBe(PaymentStatus.PENDING);
    });
  });

  describe('findById', () => {
    it('should find payment by id', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id);

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByRazorpayPaymentId', () => {
    it('should find payment by razorpay payment id', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id, {
        razorpayPaymentId: 'pay_razorpay123',
      });

      const found = await repository.findByRazorpayPaymentId('pay_razorpay123');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent razorpay payment id', async () => {
      const found = await repository.findByRazorpayPaymentId('pay_nonexistent');

      expect(found).toBeNull();
    });
  });

  describe('findByRazorpayOrderId', () => {
    it('should find payment by razorpay order id', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id, {
        razorpayOrderId: 'order_razorpay123',
      });

      const found = await repository.findByRazorpayOrderId('order_razorpay123');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent razorpay order id', async () => {
      const found = await repository.findByRazorpayOrderId('order_nonexistent');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple payments', async () => {
      const user = await UserFactory.create();
      await PaymentFactory.create(user.id);
      await PaymentFactory.create(user.id);

      const payments = await repository.findMany({});

      expect(payments).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find payments by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await PaymentFactory.create(user1.id);
      await PaymentFactory.create(user1.id);
      await PaymentFactory.create(user2.id);

      const payments = await repository.findByUser(user1.id);

      expect(payments).toHaveLength(2);
      expect(payments.every(p => p.userId === user1.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update payment', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id);

      const updated = await repository.update(created.id, { currency: 'USD' });

      expect(updated.currency).toBe('USD');
    });
  });

  describe('updateStatus', () => {
    it('should update payment status', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id);

      const updated = await repository.updateStatus(created.id, PaymentStatus.COMPLETED);

      expect(updated.status).toBe(PaymentStatus.COMPLETED);
    });
  });

  describe('completePayment', () => {
    it('should complete payment with razorpay details', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id);

      const completed = await repository.completePayment(
        created.id,
        'pay_completed123',
        'signature_abc'
      );

      expect(completed.status).toBe(PaymentStatus.COMPLETED);
      expect(completed.razorpayPaymentId).toBe('pay_completed123');
      expect(completed.razorpaySignature).toBe('signature_abc');
    });
  });

  describe('refundPayment', () => {
    it('should refund payment', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id);

      const refunded = await repository.refundPayment(
        created.id,
        'refund_123',
        9999,
        'Customer request'
      );

      expect(refunded.status).toBe(PaymentStatus.REFUNDED);
      expect(refunded.refundId).toBe('refund_123');
      expect(refunded.refundAmount).toBe(9999);
      expect(refunded.refundReason).toBe('Customer request');
    });
  });

  describe('partialRefund', () => {
    it('should partially refund payment', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id);

      const refunded = await repository.partialRefund(
        created.id,
        'refund_partial123',
        5000,
        'Partial refund'
      );

      expect(refunded.status).toBe(PaymentStatus.PARTIAL_REFUND);
      expect(refunded.refundId).toBe('refund_partial123');
      expect(refunded.refundAmount).toBe(5000);
    });
  });

  describe('delete', () => {
    it('should delete payment', async () => {
      const user = await UserFactory.create();
      const created = await PaymentFactory.create(user.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count payments', async () => {
      const user = await UserFactory.create();
      await PaymentFactory.create(user.id);
      await PaymentFactory.create(user.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });

    it('should count payments with filter', async () => {
      const user = await UserFactory.create();
      await PaymentFactory.create(user.id, { status: PaymentStatus.COMPLETED });
      await PaymentFactory.create(user.id, { status: PaymentStatus.PENDING });

      const count = await repository.count({ status: PaymentStatus.COMPLETED });

      expect(count).toBe(1);
    });
  });

  describe('getRevenueByDateRange', () => {
    it('should get revenue by date range', async () => {
      const user = await UserFactory.create();
      await PaymentFactory.create(user.id, {
        status: PaymentStatus.COMPLETED,
        amount: 10000,
        createdAt: new Date('2024-01-15'),
      });
      await PaymentFactory.create(user.id, {
        status: PaymentStatus.COMPLETED,
        amount: 20000,
        createdAt: new Date('2024-01-20'),
      });
      await PaymentFactory.create(user.id, {
        status: PaymentStatus.PENDING,
        amount: 5000,
        createdAt: new Date('2024-01-18'),
      });

      const result = await repository.getRevenueByDateRange(
        new Date('2024-01-01'),
        new Date('2024-01-31')
      );

      expect(result.totalRevenue).toBe(30000);
      expect(result.totalTransactions).toBe(2);
    });
  });

  describe('getMonthlyRevenue', () => {
    it('should get monthly revenue', async () => {
      const user = await UserFactory.create();
      await PaymentFactory.create(user.id, {
        status: PaymentStatus.COMPLETED,
        amount: 10000,
        createdAt: new Date('2024-02-15'),
      });
      await PaymentFactory.create(user.id, {
        status: PaymentStatus.COMPLETED,
        amount: 20000,
        createdAt: new Date('2024-03-20'),
      });

      const result = await repository.getMonthlyRevenue(2024);

      expect(result).toHaveLength(12);
      expect(result[1].revenue).toBe(10000);
      expect(result[2].revenue).toBe(20000);
    });
  });
});
