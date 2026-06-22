import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import careerAnalysisRoutes from '../../src/modules/career-analysis/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { COLLECTIONS } from '../../src/config/constants.js';
import { clearFirestoreMock, seedFirestore, createFirestoreMock } from '../setup/firestore-mock.js';

vi.mock('../../src/config/admin.js', () => {
  const mockDb = createFirestoreMock();
  return {
    adminAuth: { verifyIdToken: vi.fn(async () => ({ uid: 'mock-uid', email: 'user@test.com', role: 'STUDENT' })) },
    adminDb: mockDb,
  };
});

vi.mock('../../src/services/firestore.js', async () => {
  const { getFirestoreDoc } = await vi.importActual('../setup/firestore-mock.js');
  return {
    createDocument: vi.fn(async (c, data) => ({ id: `ca-${Date.now()}`, ...data })),
    getDocument: vi.fn(async (c, id) => getFirestoreDoc(c, id)),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/career-analysis', careerAnalysisRoutes);
  app.use(errorHandler);
  return app;
}

describe('Career Analysis Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('POST /upload-resume', () => {
    it('uploads resume for career analysis', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/upload-resume')
        .set('Authorization', 'Bearer token')
        .send({ resumeUrl: 'https://storage.example.com/resume.pdf', fileType: 'pdf' });

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.message).toBe('Resume uploaded successfully');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).post('/api/career-analysis/upload-resume');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /analyze', () => {
    it('analyzes career with target role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/analyze')
        .set('Authorization', 'Bearer token')
        .send({ resumeId: 'res-123', targetRole: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('careerPath');
      expect(res.body).toHaveProperty('matchScore');
      expect(res.body).toHaveProperty('recommendedPrograms');
      expect(res.body).toHaveProperty('salaryRange');
      expect(res.body).toHaveProperty('growthPotential');
      expect(res.body).toHaveProperty('skillGaps');
      expect(res.body).toHaveProperty('nextSteps');
      expect(res.body).toHaveProperty('recommendations');
    });

    it('generates valid match score', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/analyze')
        .set('Authorization', 'Bearer token')
        .send({ resumeId: 'res-123' });

      expect(res.body.matchScore).toBeGreaterThanOrEqual(65);
      expect(res.body.matchScore).toBeLessThanOrEqual(95);
    });

    it('returns career path stages', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/analyze')
        .set('Authorization', 'Bearer token')
        .send({ resumeId: 'res-123' });

      expect(res.body.careerPath).toContain('Software Developer');
      expect(res.body.careerPath).toContain('Senior Developer');
    });

    it('returns default role when target not provided', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/career-analysis/analyze')
        .set('Authorization', 'Bearer token')
        .send({ resumeId: 'res-123' });

      expect(res.body.role).toBe('General');
    });
  });

  describe('GET /report/:id', () => {
    it('returns career analysis report', async () => {
      seedFirestore(COLLECTIONS.AI_REPORTS, [{
        id: 'careport-1', userId: 'mock-uid', type: 'CAREER_ANALYSIS',
        report: { matchScore: 85, careerPath: ['Dev', 'Senior Dev'] },
      }]);
      const app = createApp();
      const res = await supertest(app).get('/api/career-analysis/report/careport-1').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });

    it('returns 404 for non-existent report', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/career-analysis/report/nonexistent').set('Authorization', 'Bearer token');
      expect(res.status).toBe(404);
    });
  });
});
