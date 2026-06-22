import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import certificateRoutes from '../../src/modules/certificates/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { mockCertificate } from '../factories/firestore-factories.js';

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
    createDocument: vi.fn(async (c, data) => ({ id: `cert-${Date.now()}`, ...data })),
    updateDocument: vi.fn(async (c, id, data) => ({ id, ...data })),
    queryDocuments: vi.fn(async (c, filters = []) => getAllFirestoreDocs(c).filter(d => filters.every((f: any) => d[f.field] === f.value))),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/certificates', certificateRoutes);
  app.use(errorHandler);
  return app;
}

describe('Certificates Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /', () => {
    it('returns current user certificates', async () => {
      seedFirestore(COLLECTIONS.CERTIFICATES, [
        mockCertificate('mock-uid', 'p1'),
        mockCertificate('other-user', 'p2'),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.every((c: any) => c.userId === 'mock-uid')).toBe(true);
    });

    it('returns empty array when no certificates', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/certificates');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /:id', () => {
    it('returns certificate by ID', async () => {
      seedFirestore(COLLECTIONS.CERTIFICATES, [
        mockCertificate('mock-uid', 'p1', { id: 'cert-1' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/cert-1')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.id).toBe('cert-1');
    });

    it('returns 404 for non-existent certificate', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/nonexistent')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/certificates/any-id');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('creates certificate as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/certificates')
        .set('Authorization', 'Bearer admin-token')
        .send({ userId: 'u1', programId: 'p1', title: 'AI Engineering' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/certificates')
        .send({ userId: 'u1', programId: 'p1' });

      expect(res.status).toBe(401);
    });

    it('returns 403 for student role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/certificates')
        .set('Authorization', 'Bearer token')
        .send({ userId: 'u1', programId: 'p1' });

      expect(res.status).toBe(403);
    });
  });

  describe('PATCH /:id', () => {
    it('updates certificate as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/certificates/cert-1')
        .set('Authorization', 'Bearer admin-token')
        .send({ isRevoked: true });

      expect(res.status).toBe(200);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/certificates/cert-1')
        .send({ isRevoked: true });

      expect(res.status).toBe(401);
    });

    it('returns 403 for student role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/certificates/cert-1')
        .set('Authorization', 'Bearer token')
        .send({ isRevoked: true });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /download/:id', () => {
    it('returns download URL for certificate', async () => {
      seedFirestore(COLLECTIONS.CERTIFICATES, [
        mockCertificate('mock-uid', 'p1', { id: 'cert-1' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/download/cert-1')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.downloadUrl).toContain('storage.googleapis.com');
      expect(res.body.cert.id).toBe('cert-1');
    });

    it('returns 404 for non-existent certificate', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/download/nonexistent')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Not found');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/download/cert-1');

      expect(res.status).toBe(401);
    });
  });
});
