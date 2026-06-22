import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedFirestore, clearFirestoreMock, getFirestoreDoc, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { COLLECTIONS } from '../../src/config/constants.js';

vi.mock('../../src/config/admin.js', async () => {
  const { createFirestoreMock } = await vi.importActual('../setup/firestore-mock.js');
  const mockDb = createFirestoreMock();
  return {
    adminAuth: {
      verifyIdToken: vi.fn(async () => ({ uid: 'test-uid', email: 'user@test.com', role: 'STUDENT' })),
    },
    adminDb: mockDb,
    adminStorage: { bucket: () => ({ upload: vi.fn(), file: () => ({ delete: vi.fn(), getSignedUrl: vi.fn() }) }) },
  };
});

vi.mock('../../src/services/firestore.js', async () => {
  const { createFirestoreMock, getFirestoreDoc, getAllFirestoreDocs } = await vi.importActual('../setup/firestore-mock.js');
  const mockDb = createFirestoreMock();

  return {
    createDocument: vi.fn(async (collection, data, id = null) => {
      const ref = id ? mockDb.collection(collection).doc(id) : mockDb.collection(collection).doc();
      await ref.set({ ...data });
      return { id: ref.id, ...data };
    }),
    getDocument: vi.fn(async (collection, id) => getFirestoreDoc(collection, id)),
    updateDocument: vi.fn(async (collection, id, data) => {
      const doc = mockDb.collection(collection).doc(id);
      await doc.update(data);
      return getFirestoreDoc(collection, id);
    }),
    deleteDocument: vi.fn(async (collection, id) => ({ id, deleted: true })),
    queryDocuments: vi.fn(async (collection, filters = []) => {
      return getAllFirestoreDocs(collection).filter(doc => {
        return filters.every((f: any) => doc[f.field] === f.value);
      });
    }),
    getAllDocuments: vi.fn(async (collection) => getAllFirestoreDocs(collection)),
    countDocuments: vi.fn(async () => 0),
  };
});

import supertest from 'supertest';
import express from 'express';
import paymentRoutes from '../../src/modules/payments/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockPayment } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/payments', paymentRoutes);
  app.use(errorHandler);
  return app;
}

describe('Payments Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('POST /api/payments/create-order', () => {
    it('creates payment order when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/create-order')
        .set('Authorization', 'Bearer valid-token')
        .send({ amount: 49999, programId: 'prog-123', currency: 'INR' });

      expect(res.status).toBe(200);
      expect(res.body.orderId).toBeDefined();
      expect(res.body.amount).toBe(49999);
      expect(res.body.currency).toBe('INR');
      expect(res.body.key).toBeDefined();
    });

    it('defaults currency to INR', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/create-order')
        .set('Authorization', 'Bearer valid-token')
        .send({ amount: 9999, programId: 'prog-123' });

      expect(res.status).toBe(200);
      expect(res.body.currency).toBe('INR');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/create-order')
        .send({ amount: 49999, programId: 'prog-123' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/payments/verify', () => {
    it('verifies payment when authenticated', async () => {
      seed(COLLECTIONS.PAYMENTS, [
        mockPayment('test-uid', { id: 'order-123', status: 'PENDING' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/verify')
        .set('Authorization', 'Bearer valid-token')
        .send({
          orderId: 'order-123',
          paymentId: 'pay_abc123',
          signature: 'sig_xyz789',
        });

      expect(res.status).toBe(200);
      expect(res.body.verified).toBe(true);
      expect(res.body.payment).toBeDefined();
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/payments/verify')
        .send({ orderId: 'order-123', paymentId: 'pay_abc', signature: 'sig' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/payments/history', () => {
    it('returns payment history for user', async () => {
      seed(COLLECTIONS.PAYMENTS, [
        mockPayment('test-uid', { id: 'pay-1', status: 'COMPLETED' }),
        mockPayment('test-uid', { id: 'pay-2', status: 'PENDING' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/payments/history')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('returns empty array when no payments', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/payments/history')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/payments/history');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/payments/invoices', () => {
    it('returns completed payments as invoices', async () => {
      seed(COLLECTIONS.PAYMENTS, [
        mockPayment('test-uid', { id: 'pay-1', status: 'COMPLETED' }),
        mockPayment('test-uid', { id: 'pay-2', status: 'PENDING' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/payments/invoices')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.every((p: any) => p.status === 'COMPLETED')).toBe(true);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/payments/invoices');

      expect(res.status).toBe(401);
    });
  });
});
