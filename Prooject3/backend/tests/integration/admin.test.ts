import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedFirestore, clearFirestoreMock, getFirestoreDoc, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { COLLECTIONS } from '../../src/config/constants.js';

vi.mock('../../src/config/admin.js', async () => {
  const { createFirestoreMock } = await vi.importActual('../setup/firestore-mock.js');
  const mockDb = createFirestoreMock();
  return {
    adminAuth: {
      verifyIdToken: vi.fn(async (token) => {
        if (token === 'admin-token') return { uid: 'admin-uid', email: 'admin@test.com', role: 'ADMIN' };
        return { uid: 'test-uid', email: 'user@test.com', role: 'STUDENT' };
      }),
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
      return { id, ...data };
    }),
    deleteDocument: vi.fn(async (collection, id) => ({ id, deleted: true })),
    queryDocuments: vi.fn(async (collection, filters = []) => {
      return getAllFirestoreDocs(collection).filter(doc => {
        return filters.every((f: any) => doc[f.field] === f.value);
      });
    }),
    getAllDocuments: vi.fn(async (collection) => getAllFirestoreDocs(collection)),
    countDocuments: vi.fn(async (collection, filters = []) => {
      const docs = filters.length > 0
        ? getAllFirestoreDocs(collection).filter(doc => filters.every((f: any) => doc[f.field] === f.value))
        : getAllFirestoreDocs(collection);
      return docs.length;
    }),
  };
});

import supertest from 'supertest';
import express from 'express';
import adminRoutes from '../../src/modules/admin/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockUser, mockProgram, mockEnrollment, mockPlacement, mockPayment, mockApplication } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminRoutes);
  app.use(errorHandler);
  return app;
}

describe('Admin Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/admin/analytics', () => {
    it('returns dashboard analytics for admin', async () => {
      seed(COLLECTIONS.USERS, [mockUser(), mockUser({ role: 'STUDENT' })]);
      seed(COLLECTIONS.PROGRAMS, [mockProgram()]);
      seed(COLLECTIONS.ENROLLMENTS, [mockEnrollment('user-1', 'prog-1')]);
      seed(COLLECTIONS.PLACEMENTS, [mockPlacement('app-1', 'job-1', 'user-1')]);
      seed(COLLECTIONS.APPLICATIONS, [mockApplication('job-1', 'user-1')]);

      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/analytics')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.totalUsers).toBeDefined();
      expect(res.body.totalStudents).toBeDefined();
      expect(res.body.totalPrograms).toBeDefined();
      expect(res.body.totalEnrollments).toBeDefined();
      expect(res.body.totalPlacements).toBeDefined();
      expect(res.body.totalApplicants).toBeDefined();
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/analytics')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/admin/analytics');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/admin/users', () => {
    it('returns users for admin', async () => {
      seed(COLLECTIONS.USERS, [mockUser(), mockUser()]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('filters users by role', async () => {
      seed(COLLECTIONS.USERS, [
        mockUser({ role: 'STUDENT' }),
        mockUser({ role: 'MENTOR' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/users?role=MENTOR')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.every((u: any) => u.role === 'MENTOR')).toBe(true);
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/revenue', () => {
    it('returns revenue analytics for admin', async () => {
      seed(COLLECTIONS.PAYMENTS, [
        mockPayment('user-1', { status: 'COMPLETED', amount: 49999, completedAt: '2024-01-15T00:00:00Z' }),
        mockPayment('user-2', { status: 'COMPLETED', amount: 99999, completedAt: '2024-02-20T00:00:00Z' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/revenue')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.totalRevenue).toBeDefined();
      expect(res.body.totalTransactions).toBeDefined();
      expect(res.body.byMonth).toBeDefined();
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/revenue')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/enrollments', () => {
    it('returns enrollment analytics for admin', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('user-1', 'prog-1', { createdAt: '2024-01-10T00:00:00Z' }),
        mockEnrollment('user-2', 'prog-1', { createdAt: '2024-01-15T00:00:00Z' }),
        mockEnrollment('user-3', 'prog-2', { createdAt: '2024-02-01T00:00:00Z' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/enrollments')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.total).toBeDefined();
      expect(res.body.byProgram).toBeDefined();
      expect(res.body.byMonth).toBeDefined();
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/enrollments')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/placements', () => {
    it('returns placement analytics for admin', async () => {
      seed(COLLECTIONS.PLACEMENTS, [
        mockPlacement('app-1', 'job-1', 'user-1', { company: 'TechCorp', package: '1200000' }),
        mockPlacement('app-2', 'job-2', 'user-2', { company: 'StartupXYZ', package: '800000' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/placements')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.total).toBeDefined();
      expect(res.body.averagePackage).toBeDefined();
      expect(res.body.byCompany).toBeDefined();
      expect(res.body.byMonth).toBeDefined();
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/placements')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/admin/programs', () => {
    it('returns programs with enrollment counts for admin', async () => {
      seed(COLLECTIONS.PROGRAMS, [mockProgram({ id: 'prog-1' }), mockProgram({ id: 'prog-2' })]);
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('user-1', 'prog-1'),
        mockEnrollment('user-2', 'prog-1'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/programs')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/programs')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });
});
