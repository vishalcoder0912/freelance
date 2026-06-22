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
import careerAnalysisRoutes from '../../src/modules/career-analysis/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockAiReport } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/career-analysis', careerAnalysisRoutes);
  app.use(errorHandler);
  return app;
}

describe('Career Analysis Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('POST /api/career-analysis/upload-resume', () => {
    it('uploads resume for analysis when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/upload-resume')
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
        .post('/api/career-analysis/upload-resume')
        .send({ resumeUrl: 'https://test.com', fileType: 'pdf' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/career-analysis/analyze', () => {
    it('analyzes career when authenticated', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/analyze')
        .set('Authorization', 'Bearer valid-token')
        .send({
          resumeId: 'resume-123',
          targetRole: 'Full Stack Developer',
        });

      expect(res.status).toBe(200);
      expect(res.body.careerPath).toBeDefined();
      expect(Array.isArray(res.body.careerPath)).toBe(true);
      expect(res.body.careerPath.length).toBe(4);
      expect(res.body.matchScore).toBeDefined();
      expect(res.body.matchScore).toBeGreaterThanOrEqual(65);
      expect(res.body.matchScore).toBeLessThanOrEqual(95);
      expect(res.body.recommendedPrograms).toBeDefined();
      expect(Array.isArray(res.body.recommendedPrograms)).toBe(true);
      expect(res.body.salaryRange).toBeDefined();
      expect(res.body.salaryRange).toContain('LPA');
      expect(res.body.growthPotential).toBeDefined();
      expect(res.body.skillGaps).toBeDefined();
      expect(Array.isArray(res.body.skillGaps)).toBe(true);
      expect(res.body.nextSteps).toBeDefined();
      expect(Array.isArray(res.body.nextSteps)).toBe(true);
      expect(res.body.role).toBe('Full Stack Developer');
      expect(res.body.recommendations).toBeDefined();
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });

    it('analyzes with default role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/analyze')
        .set('Authorization', 'Bearer valid-token')
        .send({ resumeId: 'resume-123' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('General');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/analyze')
        .send({ resumeId: 'resume-123' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/career-analysis/report/:id', () => {
    it('returns career analysis report', async () => {
      seed(COLLECTIONS.AI_REPORTS, [
        mockAiReport('test-uid', {
          id: 'report-123',
          type: 'CAREER_ANALYSIS',
          report: { careerPath: ['Developer', 'Lead'] },
        }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/career-analysis/report/report-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.type).toBe('CAREER_ANALYSIS');
    });

    it('returns 404 when report not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/career-analysis/report/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/career-analysis/report/report-123');

      expect(res.status).toBe(401);
    });
  });
});
