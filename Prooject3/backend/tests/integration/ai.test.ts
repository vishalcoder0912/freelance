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
import aiRoutes from '../../src/modules/ai/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockProgram } from '../factories/firestore-factories.js';
import { seedFirestore as seed, clearFirestoreMock as clear } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/ai', aiRoutes);
  app.use(errorHandler);
  return app;
}

describe('AI Integration Tests', () => {
  beforeEach(() => {
    clear();
  });

  describe('POST /api/ai/chat', () => {
    it('responds to resume-related query', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set('Authorization', 'Bearer valid-token')
        .send({ message: 'How is my resume?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('resume');
    });

    it('responds to roadmap query', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set('Authorization', 'Bearer valid-token')
        .send({ message: 'Show me my roadmap schedule' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('roadmap');
    });

    it('responds to interview query', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set('Authorization', 'Bearer valid-token')
        .send({ message: 'Tips for interview DSA prep?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('system design');
    });

    it('responds to salary query', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set('Authorization', 'Bearer valid-token')
        .send({ message: 'What is the expected salary package?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('LPA');
    });

    it('returns default response for generic query', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set('Authorization', 'Bearer valid-token')
        .send({ message: 'Hello there' });

      expect(res.status).toBe(200);
      expect(res.body.response).toBeDefined();
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .send({ message: 'Test' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/ai/generate-roadmap', () => {
    it('generates beginner roadmap', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set('Authorization', 'Bearer valid-token')
        .send({ targetRole: 'AI Engineer', currentLevel: 'beginner' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap).toBeDefined();
      expect(Array.isArray(res.body.roadmap)).toBe(true);
      expect(res.body.roadmap.length).toBe(6);
      expect(res.body.roadmap[0].month).toBe('Month 1');
    });

    it('generates intermediate roadmap', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set('Authorization', 'Bearer valid-token')
        .send({ targetRole: 'Data Scientist', currentLevel: 'intermediate' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap[0].topic).toBe('Advanced Concepts');
    });

    it('generates advanced roadmap', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set('Authorization', 'Bearer valid-token')
        .send({ targetRole: 'Full Stack Developer', currentLevel: 'advanced' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap[0].topic).toBe('Architecture');
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .send({ targetRole: 'AI Engineer', currentLevel: 'beginner' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/ai/course-recommendation', () => {
    it('returns recommendations based on skills', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'Python for ML', skills: ['Python', 'Machine Learning'] }),
        mockProgram({ title: 'React Development', skills: ['React', 'JavaScript'] }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/course-recommendation')
        .set('Authorization', 'Bearer valid-token')
        .send({ skills: ['Python'], targetRole: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.recommendations)).toBe(true);
      expect(res.body.recommendations.length).toBeGreaterThanOrEqual(1);
    });

    it('returns empty recommendations when no match', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'Marketing', skills: ['Marketing'] }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/course-recommendation')
        .set('Authorization', 'Bearer valid-token')
        .send({ skills: ['Kubernetes'], targetRole: 'DevOps' });

      expect(res.status).toBe(200);
      expect(res.body.recommendations.length).toBe(0);
    });
  });

  describe('POST /api/ai/skill-gap-analysis', () => {
    it('analyzes skill gaps for AI Engineer', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set('Authorization', 'Bearer valid-token')
        .send({ currentSkills: ['Python', 'SQL'], targetRole: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.matchScore).toBeDefined();
      expect(res.body.gaps).toBeDefined();
      expect(Array.isArray(res.body.gaps)).toBe(true);
      expect(res.body.totalSkills).toBe(6);
    });

    it('returns high match score for skilled user', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set('Authorization', 'Bearer valid-token')
        .send({
          currentSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'LLMs', 'MLOps'],
          targetRole: 'AI Engineer',
        });

      expect(res.status).toBe(200);
      expect(res.body.matchScore).toBe(100);
      expect(res.body.gaps.length).toBe(0);
    });

    it('handles unknown role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set('Authorization', 'Bearer valid-token')
        .send({ currentSkills: ['Python'], targetRole: 'Unknown Role' });

      expect(res.status).toBe(200);
      expect(res.body.totalSkills).toBe(4);
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .send({ currentSkills: ['Python'], targetRole: 'AI Engineer' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/ai/career-guidance', () => {
    it('provides guidance for career switch', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set('Authorization', 'Bearer valid-token')
        .send({ question: 'I want to switch to tech career' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('Career Analysis');
    });

    it('provides guidance for promotion', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set('Authorization', 'Bearer valid-token')
        .send({ question: 'How to get promotion?' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('leadership');
    });

    it('provides guidance for role selection', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set('Authorization', 'Bearer valid-token')
        .send({ question: 'Which career path is best for me?' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('assessment');
    });

    it('returns default guidance', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set('Authorization', 'Bearer valid-token')
        .send({ question: 'General question about career' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toBeDefined();
    });

    it('returns 401 without auth', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .send({ question: 'Test' });

      expect(res.status).toBe(401);
    });
  });
});
