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
import enrollmentRoutes from '../../src/modules/enrollments/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockEnrollment } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/enrollments', enrollmentRoutes);
  app.use(errorHandler);
  return app;
}

describe('Enrollments Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/enrollments/my', () => {
    it('returns user enrollments', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('test-uid', 'prog-1'),
        mockEnrollment('test-uid', 'prog-2'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments/my')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('returns empty array when no enrollments', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments/my')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/enrollments/my');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/enrollments', () => {
    it('returns all enrollments for admin', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [mockEnrollment('user-1', 'prog-1')]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns all enrollments for mentor', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [mockEnrollment('user-1', 'prog-1')]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments')
        .set('Authorization', 'Bearer mentor-token');

      expect(res.status).toBe(200);
    });

    it('returns 403 for student', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/enrollments/:id', () => {
    it('returns enrollment by ID for owner', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('test-uid', 'prog-1', { id: 'enroll-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments/enroll-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.userId).toBe('test-uid');
    });

    it('returns enrollment by ID for admin', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('other-uid', 'prog-1', { id: 'enroll-456' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments/enroll-456')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
    });

    it('returns 403 when accessing other user enrollment', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('other-uid', 'prog-1', { id: 'enroll-789' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments/enroll-789')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });

    it('returns 404 when enrollment not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/enrollments/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/enrollments', () => {
    it('creates enrollment when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/enrollments')
        .set('Authorization', 'Bearer valid-token')
        .send({ programId: 'prog-123' });

      expect(res.status).toBe(201);
      expect(res.body.userId).toBe('test-uid');
      expect(res.body.status).toBe('ACTIVE');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/enrollments')
        .send({ programId: 'prog-123' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/enrollments/:id', () => {
    it('updates enrollment when authenticated', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('test-uid', 'prog-1', { id: 'enroll-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/enrollments/enroll-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ progress: 75 });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/enrollments/enroll-123')
        .send({ progress: 75 });

      expect(res.status).toBe(401);
    });
  });

  describe('DELETE /api/enrollments/:id', () => {
    it('deletes enrollment as admin', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('user-1', 'prog-1', { id: 'enroll-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/enrollments/enroll-123')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Enrollment deleted');
    });

    it('returns 403 for non-admin', async () => {
      seed(COLLECTIONS.ENROLLMENTS, [
        mockEnrollment('user-1', 'prog-1', { id: 'enroll-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/enrollments/enroll-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });
});
