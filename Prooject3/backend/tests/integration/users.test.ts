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
import userRoutes from '../../src/modules/users/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockUser, mockAdmin, mockMentor, mockRecruiter } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/users', userRoutes);
  app.use(errorHandler);
  return app;
}

describe('Users Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/users', () => {
    it('returns all users for admin', async () => {
      seed(COLLECTIONS.USERS, [mockUser(), mockUser()]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });

    it('filters users by role', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ role: 'STUDENT' }), mockMentor()]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users?role=MENTOR')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.every((u: any) => u.role === 'MENTOR')).toBe(true);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/users');

      expect(res.status).toBe(401);
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/:id', () => {
    it('returns user by ID for admin', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'user-123', name: 'Test User' })]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/user-123')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Test User');
    });

    it('returns user by ID for self', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'test-uid', name: 'Self User' })]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/test-uid')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Self User');
    });

    it('returns 403 when accessing other user profile', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'other-uid' })]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/other-uid')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });

    it('returns 404 when user not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/nonexistent')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('updates user as admin', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'user-123' })]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/users/user-123')
        .set('Authorization', 'Bearer admin-token')
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(200);
    });

    it('returns 403 for non-admin', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'user-123' })]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/users/user-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Updated Name' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('deletes user as admin', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'user-123' })]);
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/users/user-123')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User deleted');
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/users/user-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/student (shadowed by :id)', () => {
    it('returns 404 because /:id route matches first', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/student')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/users/mentor (shadowed by :id)', () => {
    it('returns 404 because /:id route matches first', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/mentor')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/users/recruiter (shadowed by :id)', () => {
    it('returns 404 because /:id route matches first', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/recruiter')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(404);
    });
  });
});
