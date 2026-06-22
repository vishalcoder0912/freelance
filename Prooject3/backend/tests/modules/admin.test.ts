import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import adminRoutes from '../../src/modules/admin/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockUser, mockAdmin, mockPayment, mockEnrollment, mockPlacement, mockProgram } from '../factories/firestore-factories.js';

vi.mock('../../src/config/admin.js', () => {
  const mockDb = createFirestoreMock();
  return {
    adminAuth: { verifyIdToken: vi.fn(async () => ({ uid: 'mock-admin', email: 'admin@test.com', role: 'ADMIN' })) },
    adminDb: mockDb,
  };
});

vi.mock('../../src/services/firestore.js', async () => {
  const { getAllFirestoreDocs } = await vi.importActual('../setup/firestore-mock.js');
  return {
    getAllDocuments: vi.fn(async (c) => getAllFirestoreDocs(c)),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
    countDocuments: vi.fn(async (c, filters = []) => {
      const docs = filters.length > 0
        ? getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))
        : getAllFirestoreDocs(c);
      return docs.length;
    }),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/admin', adminRoutes);
  app.use(errorHandler);
  return app;
}

describe('Admin Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /analytics', () => {
    it('returns analytics counts', async () => {
      seedFirestore(COLLECTIONS.USERS, [mockUser(), mockUser(), mockAdmin()]);
      seedFirestore(COLLECTIONS.PROGRAMS, [mockProgram(), mockProgram()]);
      seedFirestore(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('u1', 'p1', { status: 'ACTIVE' }),
        mockEnrollment('u2', 'p2', { status: 'COMPLETED' }),
      ]);
      seedFirestore(COLLECTIONS.PLACEMENTS, [mockPlacement('a1', 'j1', 'u1')]);
      seedFirestore(COLLECTIONS.APPLICATIONS, [{ id: 'app-1', jobId: 'j1', userId: 'u1' }]);

      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/analytics')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.totalUsers).toBe(3);
      expect(res.body.totalStudents).toBe(2);
      expect(res.body.totalPrograms).toBe(2);
      expect(res.body.totalEnrollments).toBe(3);
      expect(res.body.activeEnrollments).toBe(1);
      expect(res.body.totalPlacements).toBe(1);
      expect(res.body.totalApplicants).toBe(1);
    });

    it('returns zeros when no data', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/analytics')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.totalUsers).toBe(0);
      expect(res.body.totalStudents).toBe(0);
      expect(res.body.totalPrograms).toBe(0);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/admin/analytics');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /users', () => {
    it('returns all users for admin', async () => {
      seedFirestore(COLLECTIONS.USERS, [mockUser(), mockAdmin(), mockUser()]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });

    it('filters users by role', async () => {
      seedFirestore(COLLECTIONS.USERS, [
        mockUser({ role: 'STUDENT' }),
        mockAdmin(),
        mockUser({ role: 'STUDENT' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/users?role=STUDENT')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.every((u: any) => u.role === 'STUDENT')).toBe(true);
    });

    it('returns empty array when no users', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/admin/users');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /revenue', () => {
    it('returns revenue summary', async () => {
      seedFirestore(COLLECTIONS.PAYMENTS, [
        mockPayment('u1', { amount: '50000', status: 'COMPLETED', completedAt: '2025-01-15T00:00:00.000Z' }),
        mockPayment('u2', { amount: '75000', status: 'COMPLETED', completedAt: '2025-01-20T00:00:00.000Z' }),
        mockPayment('u3', { amount: '30000', status: 'PENDING' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/revenue')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.totalRevenue).toBe(125000);
      expect(res.body.totalTransactions).toBe(2);
      expect(res.body.byMonth['2025-01']).toBe(125000);
    });

    it('returns zeros when no completed payments', async () => {
      seedFirestore(COLLECTIONS.PAYMENTS, [
        mockPayment('u1', { amount: '50000', status: 'PENDING' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/revenue')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.totalRevenue).toBe(0);
      expect(res.body.totalTransactions).toBe(0);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/admin/revenue');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /enrollments', () => {
    it('returns enrollment stats', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('u1', 'prog-1', { createdAt: '2025-01-10T00:00:00.000Z' }),
        mockEnrollment('u2', 'prog-2', { createdAt: '2025-01-15T00:00:00.000Z' }),
        mockEnrollment('u3', 'prog-1', { createdAt: '2025-02-10T00:00:00.000Z' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/enrollments')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(3);
      expect(res.body.byProgram['prog-1']).toBe(2);
      expect(res.body.byProgram['prog-2']).toBe(1);
      expect(res.body.byMonth['2025-01']).toBe(2);
      expect(res.body.byMonth['2025-02']).toBe(1);
    });

    it('returns empty stats when no enrollments', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/enrollments')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(0);
      expect(res.body.byProgram).toEqual({});
      expect(res.body.byMonth).toEqual({});
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/admin/enrollments');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /placements', () => {
    it('returns placement stats', async () => {
      seedFirestore(COLLECTIONS.PLACEMENTS, [
        mockPlacement('a1', 'j1', 'u1', { company: 'Google', package: '1200000', createdAt: '2025-01-10T00:00:00.000Z' }),
        mockPlacement('a2', 'j2', 'u2', { company: 'Microsoft', package: '1800000', createdAt: '2025-01-15T00:00:00.000Z' }),
        mockPlacement('a3', 'j3', 'u3', { company: 'Google', package: '1500000', createdAt: '2025-02-10T00:00:00.000Z' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/placements')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(3);
      expect(res.body.averagePackage).toBe('15 LPA');
      expect(res.body.byCompany['Google']).toBe(2);
      expect(res.body.byCompany['Microsoft']).toBe(1);
      expect(res.body.byMonth['2025-01']).toBe(2);
      expect(res.body.byMonth['2025-02']).toBe(1);
    });

    it('returns zeros when no placements', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/placements')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.total).toBe(0);
      expect(res.body.averagePackage).toBe('0 LPA');
      expect(res.body.byCompany).toEqual({});
      expect(res.body.byMonth).toEqual({});
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/admin/placements');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /programs', () => {
    it('returns programs with enrollment counts', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ id: 'prog-1', title: 'AI Engineering' }),
        mockProgram({ id: 'prog-2', title: 'Data Science' }),
      ]);
      seedFirestore(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('u1', 'prog-1'),
        mockEnrollment('u2', 'prog-1'),
        mockEnrollment('u3', 'prog-2'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/programs')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.find((p: any) => p.id === 'prog-1').enrollmentCount).toBe(2);
      expect(res.body.find((p: any) => p.id === 'prog-2').enrollmentCount).toBe(1);
    });

    it('returns programs with zero enrollment counts', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ id: 'prog-1', title: 'AI Engineering' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/admin/programs')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].enrollmentCount).toBe(0);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/admin/programs');
      expect(res.status).toBe(401);
    });
  });
});
