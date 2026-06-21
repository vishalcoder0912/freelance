import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import programRoutes from '../../src/modules/programs/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockProgram, mockAdmin } from '../factories/firestore-factories.js';

vi.mock('../../src/config/admin.js', () => {
  const mockDb = createFirestoreMock();
  return {
    adminAuth: {
      verifyIdToken: vi.fn(async () => ({ uid: 'mock-admin', email: 'admin@test.com', role: 'ADMIN' })),
    },
    adminDb: mockDb,
  };
});

vi.mock('../../src/services/firestore.js', async () => {
  const { getAllFirestoreDocs, getFirestoreDoc } = await vi.importActual('../setup/firestore-mock.js');
  return {
    getAllDocuments: vi.fn(async (collection) => getAllFirestoreDocs(collection)),
    getDocument: vi.fn(async (collection, id) => getFirestoreDoc(collection, id)),
    createDocument: vi.fn(async (collection, data) => {
      const id = `prog-${Date.now()}`;
      return { id, ...data };
    }),
    updateDocument: vi.fn(async (collection, id, data) => ({ id, ...data })),
    deleteDocument: vi.fn(async (collection, id) => ({ id, deleted: true })),
    queryDocuments: vi.fn(async (collection, filters = []) => {
      return getAllFirestoreDocs(collection).filter(doc => {
        return filters.every((f: any) => doc[f.field] === f.value);
      });
    }),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/programs', programRoutes);
  app.use(errorHandler);
  return app;
}

describe('Programs Module', () => {
  beforeEach(() => {
    clearFirestoreMock();
  });

  describe('GET /', () => {
    it('returns all programs', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [mockProgram(), mockProgram(), mockProgram()]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });

    it('filters by category', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ category: 'AI' }),
        mockProgram({ category: 'Data Science' }),
        mockProgram({ category: 'AI' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs?category=AI');

      expect(res.status).toBe(200);
      expect(res.body.every((p: any) => p.category === 'AI')).toBe(true);
    });

    it('filters by level', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ level: 'BEGINNER' }),
        mockProgram({ level: 'ADVANCED' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs?level=ADVANCED');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('filters by duration', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ duration: '6 months' }),
        mockProgram({ duration: '12 months' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs?duration=12 months');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('searches by title', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'AI Engineering' }),
        mockProgram({ title: 'Data Science' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs?search=engineering');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('returns empty array when no programs exist', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/programs');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /search', () => {
    it('searches programs by query', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'AI Engineering', skills: ['Python', 'ML'] }),
        mockProgram({ title: 'Product Management', skills: ['Strategy', 'Analytics'] }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/search?q=python');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('returns empty array when query is empty', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/programs/search');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('searches by description', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ desc: 'AI and machine learning program' }),
        mockProgram({ desc: 'Business management program' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/search?q=AI');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /categories', () => {
    it('returns unique categories', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ category: 'AI' }),
        mockProgram({ category: 'Data Science' }),
        mockProgram({ category: 'AI' }),
        mockProgram({ category: 'Engineering' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/categories');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toContain('AI');
      expect(res.body).toContain('Data Science');
      expect(res.body).toContain('Engineering');
    });
  });

  describe('GET /:slug', () => {
    it('returns program by slug', async () => {
      seedFirestore(COLLECTIONS.PROGRAMS, [
        mockProgram({ slug: 'ai-engineering', title: 'AI Engineering' }),
      ]);
      const app = createApp();
      const res = await supertest(app).get('/api/programs/ai-engineering');

      expect(res.status).toBe(200);
      expect(res.body.slug).toBe('ai-engineering');
    });

    it('returns 404 for non-existent slug', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/programs/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Program not found');
    });
  });

  describe('POST /', () => {
    it('creates a new program as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/programs')
        .set('Authorization', 'Bearer admin-token')
        .send({
          title: 'New AI Program',
          category: 'AI',
          duration: '6 months',
          level: 'BEGINNER',
          price: 49999,
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('generates slug from title', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/programs')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'New AI Program' });

      expect(res.body.slug).toBe('new-ai-program');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/programs')
        .send({ title: 'No Auth Program' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /:id', () => {
    it('updates program as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/programs/prog-123')
        .set('Authorization', 'Bearer admin-token')
        .send({ title: 'Updated Program' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deletes program as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/programs/prog-123')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Program deleted');
    });
  });
});
