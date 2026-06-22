import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import jobRoutes from '../../src/modules/jobs/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockJob, mockApplication, mockPlacement } from '../factories/firestore-factories.js';

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
    getAllDocuments: vi.fn(async (c) => getAllFirestoreDocs(c)),
    getDocument: vi.fn(async (c, id) => getFirestoreDoc(c, id)),
    createDocument: vi.fn(async (c, data) => ({ id: `job-${Date.now()}`, ...data })),
    updateDocument: vi.fn(async (c, id, data) => ({ id, ...data })),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/jobs', jobRoutes);
  app.use(errorHandler);
  return app;
}

describe('Jobs Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /', () => {
    it('returns all jobs', async () => {
      seedFirestore(COLLECTIONS.JOBS, [mockJob(), mockJob(), mockJob()]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
    });

    it('filters by type', async () => {
      seedFirestore(COLLECTIONS.JOBS, [
        mockJob({ type: 'FULL_TIME' }),
        mockJob({ type: 'INTERNSHIP' }),
        mockJob({ type: 'FULL_TIME' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs?type=FULL_TIME');

      expect(res.status).toBe(200);
      expect(res.body.every((j: any) => j.type === 'FULL_TIME')).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('filters by location', async () => {
      seedFirestore(COLLECTIONS.JOBS, [
        mockJob({ location: 'Bangalore' }),
        mockJob({ location: 'Mumbai' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs?location=bangalore');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('searches by title', async () => {
      seedFirestore(COLLECTIONS.JOBS, [
        mockJob({ title: 'Software Engineer' }),
        mockJob({ title: 'Product Manager' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs?search=engineer');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('searches by company', async () => {
      seedFirestore(COLLECTIONS.JOBS, [
        mockJob({ company: 'Google' }),
        mockJob({ company: 'Microsoft' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs?search=google');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('returns empty array when no jobs exist', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/jobs');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /:id', () => {
    it('returns job by ID', async () => {
      seedFirestore(COLLECTIONS.JOBS, [mockJob({ id: 'job-1' })]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/job-1');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('job-1');
    });

    it('returns 404 for non-existent job', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });
  });

  describe('POST /', () => {
    it('creates job as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'Software Engineer', company: 'Google', type: 'FULL_TIME' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs')
        .send({ title: 'Software Engineer' });

      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin/recruiter role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer token')
        .send({ title: 'Software Engineer' });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /apply', () => {
    it('applies to a job', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs/apply')
        .set('Authorization', 'Bearer token')
        .send({ jobId: 'job-1', resumeUrl: 'https://example.com/resume.pdf', coverLetter: 'I am interested' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.userId).toBe('mock-uid');
      expect(res.body.status).toBe('PENDING');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs/apply')
        .send({ jobId: 'job-1' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /applications', () => {
    it('returns current user applications', async () => {
      seedFirestore(COLLECTIONS.APPLICATIONS, [
        mockApplication('job-1', 'mock-uid'),
        mockApplication('job-2', 'other-user'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/jobs/applications')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((a: any) => a.userId === 'mock-uid')).toBe(true);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/applications');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /applications/:id', () => {
    it('updates application status', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/jobs/applications/app-1')
        .set('Authorization', 'Bearer admin-token')
        .send({ status: 'SHORTLISTED' });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/jobs/applications/app-1')
        .send({ status: 'SHORTLISTED' });

      expect(res.status).toBe(401);
    });

    it('returns 403 for student role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/jobs/applications/app-1')
        .set('Authorization', 'Bearer token')
        .send({ status: 'SHORTLISTED' });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /placement-stats', () => {
    it('returns placement statistics', async () => {
      seedFirestore(COLLECTIONS.PLACEMENTS, [
        mockPlacement('app-1', 'job-1', 'u1', { company: 'Google', package: '1200000' }),
        mockPlacement('app-2', 'job-2', 'u2', { company: 'Microsoft', package: '1500000' }),
        mockPlacement('app-3', 'job-3', 'u3', { company: 'Google', package: '1800000' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/placement-stats');

      expect(res.status).toBe(200);
      expect(res.body.totalPlacements).toBe(3);
      expect(res.body.averagePackage).toBe('₹15 LPA');
      expect(res.body.topCompanies).toHaveLength(2);
      expect(res.body.topCompanies[0][0]).toBe('Google');
      expect(res.body.topCompanies[0][1]).toBe(2);
    });

    it('returns zeros when no placements', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/placement-stats');

      expect(res.status).toBe(200);
      expect(res.body.totalPlacements).toBe(0);
      expect(res.body.averagePackage).toBe('₹0 LPA');
      expect(res.body.topCompanies).toEqual([]);
    });
  });
});
