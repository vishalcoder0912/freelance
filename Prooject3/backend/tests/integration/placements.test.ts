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
        if (token === 'recruiter-token') return { uid: 'recruiter-uid', email: 'recruiter@test.com', role: 'RECRUITER' };
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
import jobRoutes from '../../src/modules/jobs/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockJob, mockApplication, mockPlacement } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/jobs', jobRoutes);
  app.use(errorHandler);
  return app;
}

describe('Placements Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/jobs', () => {
    it('returns all jobs (public)', async () => {
      seed(COLLECTIONS.JOBS, [mockJob(), mockJob()]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('filters jobs by type', async () => {
      seed(COLLECTIONS.JOBS, [
        mockJob({ type: 'FULL_TIME' }),
        mockJob({ type: 'INTERNSHIP' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs?type=FULL_TIME');

      expect(res.status).toBe(200);
      expect(res.body.every((j: any) => j.type === 'FULL_TIME')).toBe(true);
    });

    it('filters jobs by location', async () => {
      seed(COLLECTIONS.JOBS, [
        mockJob({ location: 'Bangalore' }),
        mockJob({ location: 'Mumbai' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs?location=bangalore');

      expect(res.status).toBe(200);
      expect(res.body.every((j: any) => j.location.toLowerCase().includes('bangalore'))).toBe(true);
    });

    it('searches jobs by title', async () => {
      seed(COLLECTIONS.JOBS, [
        mockJob({ title: 'React Developer' }),
        mockJob({ title: 'Python Engineer' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs?search=react');

      expect(res.status).toBe(200);
      expect(res.body.some((j: any) => j.title.toLowerCase().includes('react'))).toBe(true);
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('returns job by ID', async () => {
      seed(COLLECTIONS.JOBS, [mockJob({ id: 'job-123', title: 'Test Job' })]);
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/job-123');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Job');
    });

    it('returns 404 when not found', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/nonexistent');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/jobs', () => {
    it('creates job as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'New Job',
          company: 'Test Corp',
          description: 'Job description',
          location: 'Bangalore',
          type: 'FULL_TIME',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Job');
      expect(res.body.status).toBe('ACTIVE');
    });

    it('creates job as recruiter', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer recruiter-token')
        .send({
          title: 'Recruiter Job',
          company: 'Recruiter Corp',
          description: 'Job description',
          location: 'Mumbai',
          type: 'PART_TIME',
        });

      expect(res.status).toBe(201);
    });

    it('returns 403 for student', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Job' });

      expect(res.status).toBe(403);
    });
  });

  describe('POST /api/jobs/apply', () => {
    it('applies for job when authenticated', async () => {
      seed(COLLECTIONS.JOBS, [mockJob({ id: 'job-123' })]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs/apply')
        .set('Authorization', 'Bearer valid-token')
        .send({
          jobId: 'job-123',
          resumeUrl: 'https://storage.example.com/resume.pdf',
          coverLetter: 'I am interested in this position.',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('PENDING');
      expect(res.body.userId).toBe('test-uid');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/jobs/apply')
        .send({ jobId: 'job-123', resumeUrl: 'https://test.com' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/jobs/applications (shadowed by :id)', () => {
    it('returns 404 because /:id route matches first', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/jobs/applications')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/jobs/applications/:id', () => {
    it('updates application status as admin', async () => {
      seed(COLLECTIONS.APPLICATIONS, [
        mockApplication('job-1', 'user-1', { id: 'app-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/jobs/applications/app-123')
        .set('Authorization', 'Bearer admin-token')
        .send({ status: 'SHORTLISTED' });

      expect(res.status).toBe(200);
    });

    it('updates application status as recruiter', async () => {
      seed(COLLECTIONS.APPLICATIONS, [
        mockApplication('job-1', 'user-1', { id: 'app-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/jobs/applications/app-123')
        .set('Authorization', 'Bearer recruiter-token')
        .send({ status: 'REJECTED' });

      expect(res.status).toBe(200);
    });

    it('returns 403 for student', async () => {
      seed(COLLECTIONS.APPLICATIONS, [
        mockApplication('job-1', 'user-1', { id: 'app-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/jobs/applications/app-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ status: 'ACCEPTED' });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/jobs/placement-stats (shadowed by :id)', () => {
    it('returns 404 because /:id route matches first', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/jobs/placement-stats');

      expect(res.status).toBe(404);
    });
  });
});
