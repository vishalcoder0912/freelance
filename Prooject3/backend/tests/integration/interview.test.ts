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
import interviewRoutes from '../../src/modules/interview/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockInterviewSession, mockAiReport } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/interview', interviewRoutes);
  app.use(errorHandler);
  return app;
}

describe('Interview Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('POST /api/interview/start', () => {
    it('starts interview session for AI Engineer', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .set('Authorization', 'Bearer valid-token')
        .send({ role: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.sessionId).toBeDefined();
      expect(res.body.question).toBeDefined();
      expect(res.body.question).toContain('deep learning');
      expect(res.body.role).toBe('AI Engineer');
    });

    it('starts interview session for Product Manager', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .set('Authorization', 'Bearer valid-token')
        .send({ role: 'Product Manager' });

      expect(res.status).toBe(200);
      expect(res.body.question).toContain('product decision');
    });

    it('starts interview session for Data Scientist', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .set('Authorization', 'Bearer valid-token')
        .send({ role: 'Data Scientist' });

      expect(res.status).toBe(200);
      expect(res.body.question).toContain('boosting');
    });

    it('defaults to AI Engineer question', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .set('Authorization', 'Bearer valid-token')
        .send({ role: 'Unknown Role' });

      expect(res.status).toBe(200);
      expect(res.body.question).toContain('deep learning');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/start')
        .send({ role: 'AI Engineer' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/interview/question', () => {
    it('returns question for specified role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/question')
        .set('Authorization', 'Bearer valid-token')
        .send({ role: 'AI Engineer', questionIndex: 0 });

      expect(res.status).toBe(200);
      expect(res.body.question).toBeDefined();
      expect(res.body.question).toContain('deep learning');
    });

    it('returns alternative question based on index', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/question')
        .set('Authorization', 'Bearer valid-token')
        .send({ role: 'Full Stack Developer', questionIndex: 1 });

      expect(res.status).toBe(200);
      expect(res.body.question).toContain('agile methodologies');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/question')
        .send({ role: 'AI Engineer', questionIndex: 0 });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/interview/evaluate', () => {
    it('evaluates answer and returns score', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/evaluate')
        .set('Authorization', 'Bearer valid-token')
        .send({
          sessionId: 'session-123',
          question: 'How would you deploy a model?',
          answer: 'I would use Docker containers with Kubernetes orchestration for scaling. The model would be served via FastAPI with proper caching strategies.',
        });

      expect(res.status).toBe(200);
      expect(res.body.score).toBeDefined();
      expect(res.body.score).toBeGreaterThanOrEqual(50);
      expect(res.body.score).toBeLessThanOrEqual(95);
      expect(res.body.strengths).toBeDefined();
      expect(Array.isArray(res.body.strengths)).toBe(true);
      expect(res.body.gaps).toBeDefined();
      expect(Array.isArray(res.body.gaps)).toBe(true);
      expect(res.body.idealResponse).toBeDefined();
    });

    it('handles brief answer', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/evaluate')
        .set('Authorization', 'Bearer valid-token')
        .send({
          sessionId: 'session-123',
          question: 'Tell me about DSA',
          answer: 'I know arrays and linked lists.',
        });

      expect(res.status).toBe(200);
      expect(res.body.gaps).toContain('Response too brief');
    });

    it('handles empty answer', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/evaluate')
        .set('Authorization', 'Bearer valid-token')
        .send({
          sessionId: 'session-123',
          question: 'Tell me about your experience',
          answer: '',
        });

      expect(res.status).toBe(200);
      expect(res.body.score).toBeDefined();
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/interview/evaluate')
        .send({ sessionId: 'session-123', question: 'Q', answer: 'A' });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/interview/report/:id', () => {
    it('returns interview report', async () => {
      seed(COLLECTIONS.AI_REPORTS, [
        mockAiReport('test-uid', {
          id: 'report-123',
          type: 'INTERVIEW',
          role: 'AI Engineer',
        }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .get('/api/interview/report/report-123')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(200);
      expect(res.body.type).toBe('INTERVIEW');
    });

    it('returns 404 when report not found', async () => {
      const app = createApp();
      const res = await supertest(app)
        .get('/api/interview/report/nonexistent')
        .set('Authorization', 'Bearer valid-token');

      expect(res.status).toBe(404);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app).get('/api/interview/report/report-123');

      expect(res.status).toBe(401);
    });
  });
});
