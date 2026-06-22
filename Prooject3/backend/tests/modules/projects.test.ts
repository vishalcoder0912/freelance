import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import projectRoutes from '../../src/modules/projects/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockProject } from '../factories/firestore-factories.js';

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
    createDocument: vi.fn(async (c, data) => ({ id: `proj-${Date.now()}`, ...data })),
    updateDocument: vi.fn(async (c, id, data) => ({ id, ...data })),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/projects', projectRoutes);
  app.use(errorHandler);
  return app;
}

describe('Projects Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /', () => {
    it('returns current user projects', async () => {
      seedFirestore(COLLECTIONS.PROJECTS, [
        mockProject('mock-uid'),
        mockProject('other-user'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.userId === 'mock-uid')).toBe(true);
    });

    it('returns empty array when no projects', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/projects');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /:id', () => {
    it('returns project by ID', async () => {
      seedFirestore(COLLECTIONS.PROJECTS, [
        mockProject('mock-uid', { id: 'proj-1' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/proj-1')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('proj-1');
    });

    it('returns 404 for non-existent project', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/nonexistent')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/projects/any-id');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('creates new project', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer token')
        .send({ title: 'AI Chatbot', description: 'Build a chatbot' });

      expect(res.status).toBe(201);
      expect(res.body.userId).toBe('mock-uid');
      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects')
        .send({ title: 'AI Chatbot' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /:id', () => {
    it('updates project', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/projects/proj-1')
        .set('Authorization', 'Bearer token')
        .send({ title: 'Updated Project' });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/projects/proj-1')
        .send({ title: 'Updated' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /submit', () => {
    it('submits project', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects/submit')
        .set('Authorization', 'Bearer token')
        .send({ projectId: 'proj-1', submissionUrl: 'https://github.com/user/project' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SUBMITTED');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects/submit')
        .send({ projectId: 'proj-1' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /review', () => {
    it('returns submitted projects for admin', async () => {
      seedFirestore(COLLECTIONS.PROJECTS, [
        mockProject('u1', { status: 'SUBMITTED' }),
        mockProject('u2', { status: 'IN_PROGRESS' }),
        mockProject('u3', { status: 'SUBMITTED' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/review')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.every((p: any) => p.status === 'SUBMITTED')).toBe(true);
    });

    it('returns empty array when no submitted projects', async () => {
      seedFirestore(COLLECTIONS.PROJECTS, [
        mockProject('u1', { status: 'IN_PROGRESS' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/review')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/projects/review');
      expect(res.status).toBe(401);
    });

    it('returns 403 for student role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/review')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(403);
    });
  });
});
