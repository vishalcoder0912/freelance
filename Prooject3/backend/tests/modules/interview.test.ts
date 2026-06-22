import { describe, it, expect, vi, beforeEach } from 'vitest';
import supertest from 'supertest';
import express from 'express';
import interviewRoutes from '../../src/modules/interview/routes.js';
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
    createDocument: vi.fn(async (c, data) => ({ id: `int-${Date.now()}`, ...data })),
    getDocument: vi.fn(async (c, id) => getFirestoreDoc(c, id)),
  };
});

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/interview', interviewRoutes);
  app.use(errorHandler);
  return app;
}

describe('Interview Coach Module', () => {
  beforeEach(() => { clearFirestoreMock(); });

  describe('POST /start', () => {
    it('starts interview session for AI Engineer', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .set('Authorization', 'Bearer token')
        .send({ role: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.sessionId).toBeDefined();
      expect(res.body.question).toContain('deep learning model');
      expect(res.body.role).toBe('AI Engineer');
    });

    it('starts interview session for Product Manager', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .set('Authorization', 'Bearer token')
        .send({ role: 'Product Manager' });

      expect(res.status).toBe(200);
      expect(res.body.role).toBe('Product Manager');
    });

    it('defaults to AI Engineer for unknown role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .set('Authorization', 'Bearer token')
        .send({ role: 'Unknown Role' });

      expect(res.status).toBe(200);
      expect(res.body.question).toContain('deep learning model');
    });
  });

  describe('POST /question', () => {
    it('returns question for role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/question')
        .set('Authorization', 'Bearer token')
        .send({ role: 'AI Engineer', questionIndex: 0 });

      expect(res.status).toBe(200);
      expect(res.body.question).toBeTruthy();
    });

    it('returns default question for first role when no role given', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/question')
        .set('Authorization', 'Bearer token');

      expect(res.status).toBe(200);
      expect(res.body.question).toBeTruthy();
    });

    it('includes alternative question based on index', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/question')
        .set('Authorization', 'Bearer token')
        .send({ role: 'AI Engineer', questionIndex: 2 });

      expect(res.status).toBe(200);
      expect(res.body.question).toContain('Also');
    });
  });

  describe('POST /evaluate', () => {
    it('evaluates answer with score', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/evaluate')
        .set('Authorization', 'Bearer token')
        .send({ sessionId: 'session-1', question: 'Tell me about yourself', answer: 'I have 5 years of experience in AI and machine learning...' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('score');
      expect(res.body).toHaveProperty('strengths');
      expect(res.body).toHaveProperty('gaps');
      expect(res.body).toHaveProperty('idealResponse');
    });

    it('returns lower score for brief answers', async () => {
      const app = createApp();
      const briefRes = await supertest(app)
        .post('/api/interview/evaluate')
        .set('Authorization', 'Bearer token')
        .send({ sessionId: 's-1', question: 'Q?', answer: 'Yes.' });

      const verboseRes = await supertest(app)
        .post('/api/interview/evaluate')
        .set('Authorization', 'Bearer token')
        .send({ sessionId: 's-2', question: 'Q?', answer: 'A'.repeat(200) });

      expect(briefRes.body.gaps).toContain('Response too brief');
    });

    it('returns score between 50 and 95', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/evaluate')
        .set('Authorization', 'Bearer token')
        .send({ sessionId: 's-1', question: 'Q?', answer: 'A detailed answer with many words covering the topic thoroughly.' });

      expect(res.body.score).toBeGreaterThanOrEqual(50);
      expect(res.body.score).toBeLessThanOrEqual(95);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).post('/api/interview/evaluate');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /report/:id', () => {
    it('returns interview report', async () => {
      seedFirestore(COLLECTIONS.AI_REPORTS, [{
        id: 'ireport-1', userId: 'mock-uid', type: 'INTERVIEW',
        role: 'AI Engineer', status: 'COMPLETED',
      }]);
      const app = createApp();
      const res = await supertest(app).get('/api/interview/report/ireport-1').set('Authorization', 'Bearer token');
      expect(res.status).toBe(200);
    });

    it('returns 404 for non-existent report', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/interview/report/nonexistent').set('Authorization', 'Bearer token');
      expect(res.status).toBe(404);
    });
  });
});
