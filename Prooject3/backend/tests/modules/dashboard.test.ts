import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import dashboardRoutes from '../../src/modules/dashboard/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockEnrollment, mockAssignment, mockProject, mockCertificate, mockApplication, mockMentorshipSession, mockPlacement, mockPayment } from '../factories/firestore-factories.js';

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
    getDocument: vi.fn(async (c, id) => getFirestoreDoc(c, id)),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/dashboard', dashboardRoutes);
  app.use(errorHandler);
  return app;
}

describe('Dashboard Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /overview', () => {
    it('returns dashboard overview for current user', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('mock-uid', 'p1', { status: 'ACTIVE' }),
        mockEnrollment('mock-uid', 'p2', { status: 'ACTIVE' }),
      ]);
      seedFirestore(COLLECTIONS.ASSIGNMENTS, [
        { ...mockAssignment('p1'), userId: 'mock-uid', status: 'PENDING' },
        { ...mockAssignment('p1'), userId: 'mock-uid', status: 'SUBMITTED' },
      ]);
      seedFirestore(COLLECTIONS.PROJECTS, [
        mockProject('mock-uid', { status: 'COMPLETED' }),
        mockProject('mock-uid', { status: 'IN_PROGRESS' }),
      ]);
      seedFirestore(COLLECTIONS.CERTIFICATES, [
        mockCertificate('mock-uid', 'p1'),
      ]);
      seedFirestore(COLLECTIONS.APPLICATIONS, [
        mockApplication('job-1', 'mock-uid', { status: 'PENDING' }),
        mockApplication('job-2', 'mock-uid', { status: 'INTERVIEW_SCHEDULED' }),
      ]);

      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/overview')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.totalEnrollments).toBe(2);
      expect(res.body.activeEnrollments).toBe(2);
      expect(res.body.pendingAssignments).toBe(1);
      expect(res.body.completedProjects).toBe(1);
      expect(res.body.totalCertificates).toBe(1);
      expect(res.body.activeApplications).toBe(2);
      expect(res.body.upcomingInterviews).toBe(1);
    });

    it('returns zeros when no data exists', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/overview')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.totalEnrollments).toBe(0);
      expect(res.body.activeEnrollments).toBe(0);
      expect(res.body.pendingAssignments).toBe(0);
      expect(res.body.completedProjects).toBe(0);
      expect(res.body.totalCertificates).toBe(0);
      expect(res.body.activeApplications).toBe(0);
      expect(res.body.upcomingInterviews).toBe(0);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/dashboard/overview');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /progress', () => {
    it('returns active enrollment progress', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('mock-uid', 'prog-1', { status: 'ACTIVE', progress: 50 }),
      ]);
      seedFirestore(COLLECTIONS.PROGRAMS, [
        { id: 'prog-1', title: 'AI Engineering', category: 'AI' },
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/progress')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].programId).toBe('prog-1');
      expect(res.body[0].progress).toBe(50);
    });

    it('returns empty array when no active enrollments', async () => {
      seedFirestore(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('mock-uid', 'prog-1', { status: 'COMPLETED' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/progress')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/dashboard/progress');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /upcoming', () => {
    it('returns upcoming mentorship sessions', async () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString();
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      seedFirestore(COLLECTIONS.MENTORSHIP_SESSIONS, [
        mockMentorshipSession('mentor-1', 'mock-uid', { scheduledAt: futureDate }),
        mockMentorshipSession('mentor-2', 'mock-uid', { scheduledAt: pastDate }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/upcoming')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('returns empty array when no upcoming sessions', async () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString();
      seedFirestore(COLLECTIONS.MENTORSHIP_SESSIONS, [
        mockMentorshipSession('mentor-1', 'mock-uid', { scheduledAt: pastDate }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/upcoming')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/dashboard/upcoming');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /certificates', () => {
    it('returns current user certificates', async () => {
      seedFirestore(COLLECTIONS.CERTIFICATES, [
        mockCertificate('mock-uid', 'p1'),
        mockCertificate('other-user', 'p2'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/certificates')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((c: any) => c.userId === 'mock-uid')).toBe(true);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/dashboard/certificates');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /projects', () => {
    it('returns current user projects', async () => {
      seedFirestore(COLLECTIONS.PROJECTS, [
        mockProject('mock-uid'),
        mockProject('other-user'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/projects')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.userId === 'mock-uid')).toBe(true);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/dashboard/projects');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /placements', () => {
    it('returns user applications and placements', async () => {
      seedFirestore(COLLECTIONS.APPLICATIONS, [
        mockApplication('job-1', 'mock-uid'),
      ]);
      seedFirestore(COLLECTIONS.PLACEMENTS, [
        mockPlacement('app-1', 'job-1', 'mock-uid'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/placements')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.applications).toHaveLength(1);
      expect(res.body.placements).toHaveLength(1);
    });

    it('returns empty arrays when no data', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/dashboard/placements')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.applications).toEqual([]);
      expect(res.body.placements).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/dashboard/placements');
      expect(res.status).toBe(401);
    });
  });
});
