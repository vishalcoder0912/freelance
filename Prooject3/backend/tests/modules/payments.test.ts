import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import paymentRoutes from '../../src/modules/payments/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockPayment } from '../factories/firestore-factories.js';

vi.mock('../../src/config/admin.js', () => {
  const mockDb = createFirestoreMock();
  return {
    adminAuth: { verifyIdToken: vi.fn(async () => ({ uid: 'mock-uid', email: 'user@test.com', role: 'STUDENT' })) },
    adminDb: mockDb,
  };
});

vi.mock('../../src/services/firestore.js', async () => {
  const { getFirestoreDoc, getAllFirestoreDocs } = await vi.importActual('../setup/firestore-mock.js');
  return {
    createDocument: vi.fn(async (c, data) => ({ id: `pay-${Date.now()}`, ...data })),
    getDocument: vi.fn(async (c, id) => getFirestoreDoc(c, id)),
    updateDocument: vi.fn(async (c, id, data) => ({ id, ...data })),
    getAllDocuments: vi.fn(async (c) => getAllFirestoreDocs(c)),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/payments', paymentRoutes);
  app.use(errorHandler);
  return app;
}

describe('Payments Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('POST /create-order', () => {
    it('creates a payment order', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/create-order')
        .set('Authorization', 'Bearer token')
        .send({ amount: 49999, programId: 'prog-1', currency: 'INR' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('orderId');
      expect(res.body.amount).toBe(49999);
      expect(res.body.currency).toBe('INR');
    });

    it('defaults currency to INR', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/create-order')
        .set('Authorization', 'Bearer token')
        .send({ amount: 25000, programId: 'prog-1' });

      expect(res.body.currency).toBe('INR');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/create-order')
        .send({ amount: 49999, programId: 'prog-1' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /verify', () => {
    it('verifies payment successfully', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/verify')
        .set('Authorization', 'Bearer token')
        .send({ orderId: 'order-1', paymentId: 'pay-123', signature: 'sig-abc' });

      expect(res.status).toBe(200);
      expect(res.body.verified).toBe(true);
      expect(res.body.payment.status).toBe('COMPLETED');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/verify')
        .send({ orderId: 'order-1', paymentId: 'pay-123', signature: 'sig-abc' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /history', () => {
    it('returns current user payment history', async () => {
      seedFirestore(COLLECTIONS.PAYMENTS, [
        mockPayment('mock-uid'),
        mockPayment('other-user'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/payments/history')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.userId === 'mock-uid')).toBe(true);
    });

    it('returns empty array when no payments', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/payments/history')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/payments/history');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /invoices', () => {
    it('returns completed payments for current user', async () => {
      seedFirestore(COLLECTIONS.PAYMENTS, [
        mockPayment('mock-uid', { status: 'COMPLETED' }),
        mockPayment('mock-uid', { status: 'PENDING' }),
        mockPayment('other-user', { status: 'COMPLETED' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/payments/invoices')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.userId === 'mock-uid' && p.status === 'COMPLETED')).toBe(true);
    });

    it('returns empty array when no completed invoices', async () => {
      seedFirestore(COLLECTIONS.PAYMENTS, [
        mockPayment('mock-uid', { status: 'PENDING' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/payments/invoices')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/payments/invoices');
      expect(res.status).toBe(401);
    });
  });
});
