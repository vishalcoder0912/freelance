import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import userRoutes from '../../src/modules/users/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock } from '../setup/firestore-mock.js';
import { mockUser, mockAdmin } from '../factories/firestore-factories.js';

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
  const { createFirestoreMock, getFirestoreDoc, getAllFirestoreDocs } = await vi.importActual('../setup/firestore-mock.js');
  return {
    getAllDocuments: vi.fn(async (collection) => getAllFirestoreDocs(collection)),
    getDocument: vi.fn(async (collection, id) => getFirestoreDoc(collection, id)),
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
  app.use('/api/users', userRoutes);
  app.use(errorHandler);
  return app;
}

describe('Users Module', () => {
  beforeEach(() => {
    clearFirestoreMock();
  });

  describe('GET /', () => {
    it('returns all users for admin', async () => {
      seedFirestore(COLLECTIONS.USERS, [mockUser(), mockUser(), mockUser()]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
    });

    it('filters users by role', async () => {
      seedFirestore(COLLECTIONS.USERS, [
        mockUser({ role: 'STUDENT' }),
        mockAdmin(),
        mockUser({ role: 'STUDENT' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users?role=STUDENT')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.every((u: any) => u.role === 'STUDENT')).toBe(true);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/users');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /student', () => {
    it('returns only students', async () => {
      seedFirestore(COLLECTIONS.USERS, [
        mockUser({ role: 'STUDENT' }),
        mockAdmin(),
        mockUser({ role: 'STUDENT' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/student')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.every((u: any) => u.role === 'STUDENT')).toBe(true);
    });
  });

  describe('GET /mentor', () => {
    it('returns only mentors', async () => {
      seedFirestore(COLLECTIONS.USERS, [
        mockUser({ role: 'MENTOR' }),
        mockUser({ role: 'MENTOR' }),
        mockAdmin(),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/mentor')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.every((u: any) => u.role === 'MENTOR')).toBe(true);
    });
  });

  describe('GET /recruiter', () => {
    it('returns only recruiters', async () => {
      seedFirestore(COLLECTIONS.USERS, [
        mockUser({ role: 'RECRUITER' }),
        mockUser({ role: 'RECRUITER' }),
        mockAdmin(),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/recruiter')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.every((u: any) => u.role === 'RECRUITER')).toBe(true);
    });
  });

  describe('GET /:id', () => {
    it('returns user by ID for own profile', async () => {
      seedFirestore(COLLECTIONS.USERS, [mockUser({ id: 'my-id', name: 'My Profile' })]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/my-id')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
    });

    it('returns 404 for non-existent user', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/users/nonexistent-id')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/users/any-id');
      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /:id', () => {
    it('updates user by ID as admin', async () => {
      seedFirestore(COLLECTIONS.USERS, [mockAdmin({ id: 'update-id' })]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/users/update-id')
        .set('Authorization', 'Bearer admin-token')
        .send({ role: 'MENTOR' });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    it('deletes user by ID as admin', async () => {
      seedFirestore(COLLECTIONS.USERS, [mockAdmin({ id: 'delete-id' })]);
      const app = createApp();
      const res = await supertest(app)
        .delete('/api/users/delete-id')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('User deleted');
    });
  });
});
