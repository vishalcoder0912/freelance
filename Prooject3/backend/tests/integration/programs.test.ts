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
    countDocuments: vi.fn(async () => 0),
  };
});

import supertest from 'supertest';
import express from 'express';
import programRoutes from '../../src/modules/programs/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockProgram } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/programs', programRoutes);
  app.use(errorHandler);
  return app;
}

describe('Programs Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/programs', () => {
    it('returns all programs (public)', async () => {
      seed(COLLECTIONS.PROGRAMS, [mockProgram(), mockProgram()]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('filters programs by category', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ category: 'AI' }),
        mockProgram({ category: 'Data Science' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs?category=AI');

      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.category === 'AI')).toBe(true);
    });

    it('filters programs by level', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ level: 'BEGINNER' }),
        mockProgram({ level: 'ADVANCED' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs?level=BEGINNER');

      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.level === 'BEGINNER')).toBe(true);
    });

    it('searches programs by title', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'Python for Beginners' }),
        mockProgram({ title: 'React Masterclass' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs?search=python');

      expect(res.status).toBe(200);
      expect(res.body.some((p: any) => p.title.toLowerCase().includes('python'))).toBe(true);
    });
  });

  describe('GET /api/programs/search', () => {
    it('searches programs by query', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'Python for Data Science', skills: ['Python', 'ML'] }),
        mockProgram({ title: 'React Development', skills: ['React', 'JavaScript'] }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/search?q=python');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('searches by skills', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'ML Course', skills: ['Machine Learning', 'Python'] }),
        mockProgram({ title: 'Web Dev', skills: ['React', 'Node.js'] }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/search?q=machine+learning');

      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it('returns empty array when no query', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/programs/search');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/programs/categories', () => {
    it('returns unique categories', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ category: 'AI' }),
        mockProgram({ category: 'AI' }),
        mockProgram({ category: 'Data Science' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/categories');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(new Set(res.body).size).toBe(res.body.length);
    });
  });

  describe('GET /api/programs/:slug', () => {
    it('returns program by slug', async () => {
      seed(COLLECTIONS.PROGRAMS, [mockProgram({ slug: 'python-course' })]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/python-course');

      expect(res.status).toBe(200);
      expect(res.body.slug).toBe('python-course');
    });

    it('returns 404 for non-existent slug', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/programs/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Program not found');
    });
  });

  describe('POST /api/programs', () => {
    it('creates program as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/programs')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'New Program', desc: 'Program description', category: 'AI' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Program');
      expect(res.body.slug).toBe('new-program');
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/programs')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'New Program', desc: 'Program description' });

      expect(res.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/programs')
        .send({ title: 'New Program', desc: 'Program description' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/programs/:id', () => {
    it('updates program as admin', async () => {
      seed(COLLECTIONS.PROGRAMS, [mockProgram({ id: 'prog-123' })]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/programs/prog-123')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'Updated Program' });

      expect(res.status).toBe(200);
    });

    it('returns 403 for non-admin', async () => {
      seed(COLLECTIONS.PROGRAMS, [mockProgram({ id: 'prog-123' })]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/programs/prog-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Updated Program' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/programs/:id', () => {
    it('deletes program as admin', async () => {
      seed(COLLECTIONS.PROGRAMS, [mockProgram({ id: 'prog-123' })]);
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/programs/prog-123')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Program deleted');
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/programs/prog-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });
});
