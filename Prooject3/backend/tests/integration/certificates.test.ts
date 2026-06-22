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
import certificateRoutes from '../../src/modules/certificates/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockCertificate } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/certificates', certificateRoutes);
  app.use(errorHandler);
  return app;
}

describe('Certificates Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/certificates', () => {
    it('returns user certificates', async () => {
      seed(COLLECTIONS.CERTIFICATES, [
        mockCertificate('test-uid', 'prog-1', { id: 'cert-1' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('returns all certificates for admin', async () => {
      seed(COLLECTIONS.CERTIFICATES, [
        mockCertificate('user-1', 'prog-1', { id: 'cert-1' }),
        mockCertificate('user-2', 'prog-2', { id: 'cert-2' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates')
        .set('Authorization', 'Bearer admin-token');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/certificates');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/certificates/:id', () => {
    it('returns certificate by ID', async () => {
      seed(COLLECTIONS.CERTIFICATES, [
        mockCertificate('test-uid', 'prog-1', { id: 'cert-123', title: 'AI Certificate' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/cert-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('AI Certificate');
    });

    it('returns 404 when not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/certificates', () => {
    it('creates certificate as admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/certificates')
        .set('Authorization', 'Bearer admin-token')
        .send({
          userId: 'user-123',
          programId: 'prog-123',
          title: 'Completion Certificate',
          certificateId: 'CV-ABC123',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Completion Certificate');
    });

    it('returns 403 for non-admin', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/certificates')
        .set('Authorization', 'Bearer valid-token')
        .send({ userId: 'user-123', programId: 'prog-123', title: 'Cert' });

      expect(res.status).toBe(403);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/certificates')
        .send({ userId: 'user-123', programId: 'prog-123', title: 'Cert' });

      expect(res.status).toBe(401);
    });
  });

  describe('PATCH /api/certificates/:id', () => {
    it('updates certificate as admin', async () => {
      seed(COLLECTIONS.CERTIFICATES, [
        mockCertificate('user-1', 'prog-1', { id: 'cert-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/certificates/cert-123')
        .set('Authorization', 'Bearer admin-token')
        .send({ isRevoked: true });

      expect(res.status).toBe(200);
    });

    it('returns 403 for non-admin', async () => {
      seed(COLLECTIONS.CERTIFICATES, [
        mockCertificate('user-1', 'prog-1', { id: 'cert-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .patch('/api/certificates/cert-123')
        .set('Authorization', 'Bearer valid-token')
        .send({ isRevoked: true });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/certificates/download/:id', () => {
    it('returns download URL for certificate', async () => {
      seed(COLLECTIONS.CERTIFICATES, [
        mockCertificate('test-uid', 'prog-1', { id: 'cert-123' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/download/cert-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.downloadUrl).toContain('cert-123.pdf');
      expect(res.body.cert).toBeDefined();
    });

    it('returns 404 when certificate not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/certificates/download/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });
  });
});
