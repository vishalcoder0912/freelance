import { describe, it, expect, vi, beforeEach } from 'vitest';
import { seedFirestore, clearFirestoreMock, getFirestoreDoc, getAllFirestoreDocs } from '../setup/firestore-mock.js';
import { COLLECTIONS } from '../../src/config/constants.js';

vi.mock('../../src/config/admin.js', async () => {
  const { createFirestoreMock } = await vi.importActual('../setup/firestore-mock.js');
  const mockDb = createFirestoreMock();
  return {
    adminAuth: {
      verifyIdToken: vi.fn(async () => ({ uid: 'test-uid', email: 'user@test.com', role: 'STUDENT' })),
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
import resumeRoutes from '../../src/modules/resume/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockAiReport } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/resume', resumeRoutes);
  app.use(errorHandler);
  return app;
}

describe('Resume Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('GET /api/resume/upload-resume', () => {
    it('returns upload instructions', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/resume/upload-resume')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Upload resume');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/resume/upload-resume');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/resume/upload-resume', () => {
    it('uploads resume when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/upload-resume')
        .set('Authorization', 'Bearer valid-token')
        .send({
          resumeUrl: 'https://storage.example.com/resume.pdf',
          fileType: 'pdf',
        });

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.message).toBe('Resume uploaded successfully');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/upload-resume')
        .send({ resumeUrl: 'https://test.com', fileType: 'pdf' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/resume/analyze', () => {
    it('analyzes resume when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/analyze')
        .set('Authorization', 'Bearer valid-token')
        .send({
          resumeId: 'resume-123',
          targetRole: 'AI Engineer',
        });

      expect(res.status).toBe(200);
      expect(res.body.atsScore).toBeDefined();
      expect(res.body.atsScore).toBeGreaterThanOrEqual(60);
      expect(res.body.atsScore).toBeLessThanOrEqual(90);
      expect(res.body.keywordMatch).toBeDefined();
      expect(res.body.formattingScore).toBeDefined();
      expect(res.body.missingKeywords).toBeDefined();
      expect(Array.isArray(res.body.missingKeywords)).toBe(true);
      expect(res.body.strengths).toBeDefined();
      expect(Array.isArray(res.body.strengths)).toBe(true);
      expect(res.body.improvements).toBeDefined();
      expect(Array.isArray(res.body.improvements)).toBe(true);
      expect(res.body.roleMatch).toBeDefined();
      expect(res.body.role).toBe('AI Engineer');
      expect(res.body.suggestions).toBeDefined();
      expect(Array.isArray(res.body.suggestions)).toBe(true);
    });

    it('analyzes with default role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/analyze')
        .set('Authorization', 'Bearer valid-token')
        .send({ resumeId: 'resume-123' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('General');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/analyze')
        .send({ resumeId: 'resume-123' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/resume/report/:id', () => {
    it('returns resume analysis report', async () => {
      seed(COLLECTIONS.AI_REPORTS, [
        mockAiReport('test-uid', {
          id: 'report-123',
          type: 'RESUME_ANALYSIS',
          report: { atsScore: 85 },
        }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/resume/report/report-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.type).toBe('RESUME_ANALYSIS');
    });

    it('returns 404 when report not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/resume/report/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/resume/report/report-123');

      expect(res.status).toBe(401);
    });
  });
});
