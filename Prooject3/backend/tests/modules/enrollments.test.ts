import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import enrollmentRoutes from '../../src/modules/enrollments/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockEnrollment, mockProgram, mockUser } from '../factories/firestore-factories.js';

vi.mock('../../src/config/admin.js', () => {
  const mockDb = createFirestoreMock();
  return {
    adminAuth: { verifyIdToken: vi.fn(async () => ({ uid: 'mock-uid', email: 'user@test.com', role: 'STUDENT' })) },
    adminDb: mockDb,
  };
});

vi.mock('../../src/services/firestore.js', async () => {
  const { getAllFirestoreDocs, getFirestoreDoc } = await vi.importActual('../setup/firestore-mock.js');
  return {
    getAllDocuments: vi.fn(async (c) => getAllFirestoreDocs(c)),
    getDocument: vi.fn(async (c, id) => getFirestoreDoc(c, id)),
    createDocument: vi.fn(async (c, data) => ({ id: `enr-${Date.now()}`, ...data })),
    updateDocument: vi.fn(async (c, id, data) => ({ id, ...data })),
    deleteDocument: vi.fn(async (c, id) => ({ id, deleted: true })),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/enrollments', enrollmentRoutes);
  app.use(errorHandler);
  return app;
}

describe('Enrollments Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /my', () => {
    it('returns current user enrollments', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('mock-uid', 'prog-1'),
        mockEnrollment('other-user', 'prog-2'),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/enrollments/my').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.every((e: any) => e.userId === 'mock-uid')).toBe(true);
    });
  });

  describe('GET /', () => {
    it('returns all enrollments', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [mockEnrollment('u1', 'p1'), mockEnrollment('u2', 'p2')]);
      const app = createApp();
      const res = await supertest(app).get('/api/enrollments').set('Authorization', 'Bearer admin-token');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /:id', () => {
    it('returns enrollment by ID', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [mockEnrollment('mock-uid', 'p1', { id: 'enr-1' })]);
      const app = createApp();
      const res = await supertest(app).get('/api/enrollments/enr-1').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });

    it('returns 404 for non-existent', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/enrollments/nonexistent').set('Authorization', 'Bearer token');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {
    it('creates new enrollment', async () => {
      const app = createApp();
      const res = await supertest(app).post('/api/enrollments').set('Authorization', 'Bearer token').send({ programId: 'prog-1' });
      expect(res.status).toBe(201);
      expect(res.body.userId).toBe('mock-uid');
      expect(res.body.status).toBe('ACTIVE');
    });
  });

  describe('PATCH /:id', () => {
    it('updates enrollment', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [mockEnrollment('mock-uid', 'p1', { id: 'enr-1' })]);
      const app = createApp();
      const res = await supertest(app).patch('/api/enrollments/enr-1').set('Authorization', 'Bearer token').send({ progress: 50 });
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deletes enrollment as admin', async () => {
      const app = createApp();
      const res = await supertest(app).delete('/api/enrollments/enr-1').set('Authorization', 'Bearer admin-token');
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Enrollment deleted');
    });
  });
});
