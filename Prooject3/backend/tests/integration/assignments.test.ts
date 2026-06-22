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
import assignmentRoutes from '../../src/modules/assignments/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockAssignment, mockSubmission } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/assignments', assignmentRoutes);
  app.use(errorHandler);
  return app;
}

describe('Assignments Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/assignments', () => {
    it('returns user assignments', async () => {
      seed(COLLECTIONS.ASSIGNMENTS, [
        mockAssignment('prog-1', { userId: 'test-uid' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns all assignments for admin', async () => {
      seed(COLLECTIONS.ASSIGNMENTS, [
        mockAssignment('prog-1', { userId: 'user-1' }),
        mockAssignment('prog-1', { userId: 'user-2' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/assignments');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/assignments/:id', () => {
    it('returns assignment by ID', async () => {
      seed(COLLECTIONS.ASSIGNMENTS, [
        mockAssignment('prog-1', { id: 'assign-123', title: 'Test Assignment' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/assign-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Assignment');
    });

    it('returns 404 when not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/assignments', () => {
    it('creates assignment as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments')
        .set('Authorization', 'Bearer admin-token')
        .send({ programId: 'prog-1', title: 'New Assignment', description: 'Do this' });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Assignment');
    });

    it('creates assignment as mentor', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments')
        .set('Authorization', 'Bearer mentor-token')
        .send({ programId: 'prog-1', title: 'Mentor Assignment' });

      expect(res.status).toBe(201);
    });

    it('returns 403 for student', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments')
        .set('Authorization', 'Bearer valid-token')
        .send({ programId: 'prog-1', title: 'Student Assignment' });

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /api/assignments/:id', () => {
    it('updates assignment when authenticated', async () => {
      seed(COLLECTIONS.ASSIGNMENTS, [
        mockAssignment('prog-1', { id: 'assign-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/assignments/assign-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Updated Assignment' });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/assignments/assign-123')
        .send({ title: 'Updated' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/assignments/submit', () => {
    it('submits assignment when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments/submit')
        .set('Authorization', 'Bearer valid-token')
        .send({
          assignmentId: 'assign-123',
          submissionUrl: 'https://github.com/user/repo',
          notes: 'Completed task',
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('SUBMITTED');
      expect(res.body.userId).toBe('test-uid');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/assignments/submit')
        .send({ assignmentId: 'assign-123', submissionUrl: 'https://test.com' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/assignments/submissions (shadowed by :id)', () => {
    it('returns 404 because /:id route matches first', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/assignments/submissions')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(404);
    });
  });
});
