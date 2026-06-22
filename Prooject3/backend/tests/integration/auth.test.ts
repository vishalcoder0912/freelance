import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedFirestore, clearFirestoreMock, getFirestoreDoc, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { COLLECTIONS } from '../../src/config/constants.js';

vi.mock('../../src/config/admin.js', async () => {
  const { createFirestoreMock } = await vi.importActual('../setup/firestore-mock.js');
  const mockDb = createFirestoreMock();
  return {
    adminAuth: {
      createUser: vi.fn(async (user) => ({ uid: 'new-user-uid', ...user })),
      getUserByEmail: vi.fn(async (email) => ({ uid: 'test-uid', email, displayName: email?.split('@')[0] || 'User' })),
      verifyIdToken: vi.fn(async (token) => {
        if (token === 'admin-token') return { uid: 'admin-uid', email: 'admin@test.com', role: 'ADMIN' };
        return { uid: 'test-uid', email: 'user@test.com', role: 'STUDENT' };
      }),
      updateUser: vi.fn(async (uid, data) => ({ uid, ...data })),
      setCustomUserClaims: vi.fn(async () => {}),
      generatePasswordResetLink: vi.fn(async () => 'https://careerveda.ai/reset-password'),
    },
    adminDb: mockDb,
    adminStorage: {
      bucket: () => ({
        upload: vi.fn(async () => [{}]),
        file: () => ({ delete: vi.fn(async () => {}), getSignedUrl: vi.fn(async () => ['https://mock.url']) }),
      }),
    },
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
    countDocuments: vi.fn(async (collection, filters = []) => {
      const docs = filters.length > 0
        ? getAllFirestoreDocs(collection).filter(doc => filters.every((f: any) => doc[f.field] === f.value))
        : getAllFirestoreDocs(collection);
      return docs.length;
    }),
  };
});

import supertest from 'supertest';
import express from 'express';
import authRoutes from '../../src/modules/auth/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockUser, mockAdmin } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use(errorHandler);
  return app;
}

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('POST /api/auth/register', () => {
    it('registers a new user with all fields', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@test.com',
          password: 'Test123!',
          name: 'New User',
          role: 'STUDENT',
          careerGoal: 'Software Engineer',
          currentExperience: '3',
          phone: '+911234567890',
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.user.name).toBe('New User');
      expect(res.body.user.email).toBe('newuser@test.com');
      expect(res.body.uid).toBe('new-user-uid');
    });

    it('registers with minimal required fields', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/register')
        .send({ email: 'minimal@test.com', password: 'Pass123!', name: 'Min User' });

      expect(res.status).toBe(201);
      expect(res.body.user.role).toBe('STUDENT');
    });

    it('sets custom claims for role', async () => {
      const { adminAuth } = await import('../../src/config/admin.js');
      const app = createApp();
      await supertest(app)
        .post('/api/auth/register')
        .send({ email: 'role@test.com', password: 'Pass123!', name: 'Role User', role: 'MENTOR' });

      expect(adminAuth.setCustomUserClaims).toHaveBeenCalledWith('new-user-uid', { role: 'MENTOR' });
    });
  });

  describe('POST /api/auth/login', () => {
    it('logs in with valid email', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/login')
        .send({ email: 'user@test.com' });

      expect(res.status).toBe(200);
      expect(res.body.uid).toBeDefined();
      expect(res.body.email).toBe('user@test.com');
    });

    it('returns user data with name', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/login')
        .send({ email: 'test@test.com' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name');
    });
  });

  describe('POST /api/auth/google', () => {
    it('authenticates with Google ID token', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'test-uid', email: 'user@test.com' })]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/google')
        .send({ idToken: 'google-token', name: 'Google User', email: 'google@test.com' });

      expect(res.status).toBe(200);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBe('google-token');
    });

    it('creates new user if not exists', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/google')
        .send({ idToken: 'new-google-token', name: 'New Google', email: 'newgoogle@test.com' });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('newgoogle@test.com');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('logs out successfully', async () => {
      const app = createApp();
      const res = await supertest(app).post('/api/auth/logout');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Logged out successfully');
    });
  });

  describe('POST /api/auth/forgot-password', () => {
    it('sends password reset email', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'user@test.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password reset email sent');
      expect(res.body.link).toContain('careerveda.ai');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('resets password with valid code', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/reset-password')
        .send({ oobCode: 'reset-code-123', newPassword: 'NewPass123!' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Password reset successfully');
    });
  });

  describe('POST /api/auth/send-otp', () => {
    it('sends OTP to valid phone', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/send-otp')
        .send({ phone: '+911234567890' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('OTP sent');
      expect(res.body.otp).toBe('123456');
    });
  });

  describe('POST /api/auth/verify-otp', () => {
    it('verifies correct OTP', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/verify-otp')
        .send({ phone: '+911234567890', otp: '123456' });

      expect(res.status).toBe(200);
      expect(res.body.verified).toBe(true);
    });

    it('rejects incorrect OTP', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/auth/verify-otp')
        .send({ phone: '+911234567890', otp: '000000' });

      expect(res.status).toBe(400);
      expect(res.body.verified).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('returns user profile when authenticated', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'test-uid', name: 'Auth User', email: 'auth@test.com' })]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
    });

    it('returns 401 when not authenticated', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/auth/me');

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('No token provided');
    });

    it('returns 404 when user not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('User not found');
    });
  });

  describe('PATCH /api/auth/profile', () => {
    it('updates user profile when authenticated', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'test-uid', name: 'Old Name' })]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Updated Name', phone: '+919999999999' });

      expect(res.status).toBe(200);
    });

    it('updates profile with optional fields', async () => {
      seed(COLLECTIONS.USERS, [mockUser({ id: 'test-uid' })]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({ careerGoal: 'AI Engineer', bio: 'Experienced developer', skills: ['Python', 'ML'] });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/auth/profile')
        .send({ name: 'No Auth' });

      expect(res.status).toBe(401);
    });
  });
});
