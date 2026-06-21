import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import resumeRoutes from '../../src/modules/resume/routes.js';
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
    createDocument: vi.fn(async (c, data) => ({ id: `res-${Date.now()}`, ...data })),
    getDocument: vi.fn(async (c, id) => getFirestoreDoc(c, id)),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/resume', resumeRoutes);
  app.use(errorHandler);
  return app;
}

describe('Resume Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('GET /upload-resume', () => {
    it('returns upload instructions', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/resume/upload-resume').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
      expect(res.body.message).toContain('Upload resume via POST');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/resume/upload-resume');
      expect(res.status).toBe(401);
    });
  });

  describe('POST /upload-resume', () => {
    it('uploads resume successfully', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/upload-resume')
        .set('Authorization', 'Bearer token')
        .send({ resumeUrl: 'https://storage.example.com/resume.pdf', fileType: 'pdf' });

      expect(res.status).toBe(200);
      expect(res.body.id).toBeDefined();
      expect(res.body.message).toBe('Resume uploaded successfully');
    });
  });

  describe('POST /analyze', () => {
    it('analyzes resume with target role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/analyze')
        .set('Authorization', 'Bearer token')
        .send({ resumeId: 'res-123', targetRole: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('atsScore');
      expect(res.body).toHaveProperty('keywordMatch');
      expect(res.body).toHaveProperty('formattingScore');
      expect(res.body).toHaveProperty('missingKeywords');
      expect(res.body).toHaveProperty('strengths');
      expect(res.body).toHaveProperty('improvements');
      expect(res.body).toHaveProperty('roleMatch');
      expect(res.body).toHaveProperty('role', 'AI Engineer');
    });

    it('analyzes resume without target role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/analyze')
        .set('Authorization', 'Bearer token')
        .send({ resumeId: 'res-123' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('General');
    });

    it('generates scores within valid ranges', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/resume/analyze')
        .set('Authorization', 'Bearer token')
        .send({ resumeId: 'res-123' });

      expect(res.body.atsScore).toBeGreaterThanOrEqual(60);
      expect(res.body.atsScore).toBeLessThanOrEqual(100);
      expect(res.body.keywordMatch).toBeGreaterThanOrEqual(60);
      expect(res.body.formattingScore).toBeGreaterThanOrEqual(75);
    });
  });

  describe('GET /report/:id', () => {
    it('returns report by ID', async () => {
      seedFirestore(COLLECTIONS.AI_REPORTS, [{
        id: 'report-1', userId: 'mock-uid', type: 'RESUME_ANALYSIS',
        report: { atsScore: 85 },
        createdAt: new Date().toISOString(),
      }]);
      const app = createApp();
      const res = await supertest(app).get('/api/resume/report/report-1').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });

    it('returns 404 for non-existent report', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/resume/report/nonexistent').set('Authorization', 'Bearer token');
      expect(res.status).toBe(404);
    });
  });
});
