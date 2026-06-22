import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import assignmentRoutes from '../../src/modules/assignments/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockAssignment, mockSubmission } from '../factories/firestore-factories.js';

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
    createDocument: vi.fn(async (c, data) => ({ id: `asgn-${Date.now()}`, ...data })),
    updateDocument: vi.fn(async (c, id, data) => ({ id, ...data })),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/assignments', assignmentRoutes);
  app.use(errorHandler);
  return app;
}

describe('Assignments Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /', () => {
    it('returns current user assignments', async () => {
      seedFirestore(COLLECTIONS.ASSIGNMENTS, [
        { ...mockAssignment('p1'), userId: 'mock-uid' },
        { ...mockAssignment('p1'), userId: 'other-user' },
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((a: any) => a.userId === 'mock-uid')).toBe(true);
    });

    it('returns empty array when no assignments', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/assignments');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /:id', () => {
    it('returns assignment by ID', async () => {
      seedFirestore(COLLECTIONS.ASSIGNMENTS, [
        { ...mockAssignment('p1'), id: 'asgn-1', userId: 'mock-uid' },
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/asgn-1')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('asgn-1');
    });

    it('returns 404 for non-existent assignment', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/nonexistent')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/assignments/any-id');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('creates assignment as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'New Assignment', description: 'Do this', programId: 'prog-1' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments')
        .send({ title: 'New Assignment' });

      expect(res.status).toBe(401);
    });

    it('returns 403 for student role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments')
        .set('Authorization', 'Bearer token')
        .send({ title: 'New Assignment' });

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /:id', () => {
    it('updates assignment', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/assignments/asgn-1')
        .set('Authorization', 'Bearer token')
        .send({ status: 'GRADED', score: 85 });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/assignments/asgn-1')
        .send({ status: 'GRADED' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /submit', () => {
    it('submits assignment', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments/submit')
        .set('Authorization', 'Bearer token')
        .send({ assignmentId: 'asgn-1', submissionUrl: 'https://example.com/submit.pdf', notes: 'Done' });

      expect(res.status).toBe(201);
      expect(res.body.userId).toBe('mock-uid');
      expect(res.body.status).toBe('SUBMITTED');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments/submit')
        .send({ assignmentId: 'asgn-1' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /submissions', () => {
    it('returns all submissions for admin', async () => {
      seedFirestore(COLLECTIONS.ASSIGNMENTS + '_submissions', [
        mockSubmission('asgn-1', 'u1'),
        mockSubmission('asgn-2', 'u2'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/submissions')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('returns empty array when no submissions', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/submissions')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/assignments/submissions');
      expect(res.status).toBe(401);
    });

    it('returns 403 for student role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/submissions')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(403);
    });
  });
});
