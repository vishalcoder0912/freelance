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
        if (token === 'mentor-token') return { uid: 'mentor-uid', email: 'mentor@test.com', role: 'MENTOR' };
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
    countDocuments: vi.fn(async () => 0),
  };
});

import supertest from 'supertest';
import express from 'express';
import projectRoutes from '../../src/modules/projects/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockProject } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/projects', projectRoutes);
  app.use(errorHandler);
  return app;
}

describe('Projects Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/projects', () => {
    it('returns user projects', async () => {
      seed(COLLECTIONS.PROJECTS, [
        mockProject('test-uid', { id: 'proj-1' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns all projects for admin', async () => {
      seed(COLLECTIONS.PROJECTS, [
        mockProject('user-1', { id: 'proj-1' }),
        mockProject('user-2', { id: 'proj-2' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/projects');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/projects/:id', () => {
    it('returns project by ID', async () => {
      seed(COLLECTIONS.PROJECTS, [
        mockProject('test-uid', { id: 'proj-123', title: 'Test Project' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/proj-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Project');
    });

    it('returns 404 when not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/projects', () => {
    it('creates project when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'New Project',
          description: 'Project description',
          githubUrl: 'https://github.com/user/repo',
          technologies: ['React', 'Node.js'],
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Project');
      expect(res.body.userId).toBe('test-uid');
      expect(res.body.status).toBe('IN_PROGRESS');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects')
        .send({ title: 'Project' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/projects/:id', () => {
    it('updates project when authenticated', async () => {
      seed(COLLECTIONS.PROJECTS, [
        mockProject('test-uid', { id: 'proj-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/projects/proj-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Updated Project' });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/projects/proj-123')
        .send({ title: 'Updated' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/projects/submit', () => {
    it('submits project when authenticated', async () => {
      seed(COLLECTIONS.PROJECTS, [
        mockProject('test-uid', { id: 'proj-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects/submit')
        .set('Authorization', 'Bearer valid-token')
        .send({
          projectId: 'proj-123',
          submissionUrl: 'https://deployed-app.com',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('SUBMITTED');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/projects/submit')
        .send({ projectId: 'proj-123', submissionUrl: 'https://test.com' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/projects/review (shadowed by :id)', () => {
    it('returns 404 because /:id route matches first', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/projects/review')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(404);
    });
  });
});
