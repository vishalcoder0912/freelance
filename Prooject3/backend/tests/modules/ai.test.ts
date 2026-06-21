import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createFirestoreMock, seedFirestore, clearFirestoreMock } from '../setup/firestore-mock.js';
import { COLLECTIONS } from '../../src/config/constants.js';

vi.mock('../../src/config/admin.js', () => {
  const { createFirestoreMock } = vi.importActual('../setup/firestore-mock.js');
  const mockDb = createFirestoreMock();
  return {
    adminAuth: {
      createUser: vi.fn(async (user) => ({ uid: 'mock-uid-' + Date.now(), ...user })),
      getUserByEmail: vi.fn(async (email) => ({ uid: 'mock-uid', email, displayName: email?.split('@')[0] || 'User' })),
      verifyIdToken: vi.fn(async (token) => ({ uid: 'mock-uid', email: 'user@careerveda.ai', role: 'STUDENT' })),
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
  const { createFirestoreMock, seedFirestore, clearFirestoreMock, getFirestoreDoc, getAllFirestoreDocs } = await vi.importActual('../setup/firestore-mock.js');
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
import aiRoutes from '../../src/modules/ai/routes.js';
import { errorHandler } from '../../src/middleware/validation.js';
import { mockProgram } from '../factories/firestore-factories.js';
import { seedFirestore as seed } from '../setup/firestore-mock.js';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/ai', aiRoutes);
  app.use(errorHandler);
  return app;
}

function authHeader() {
  return { Authorization: 'Bearer valid-token' };
}

describe('AI Module', () => {
  beforeEach(() => {
    clearFirestoreMock();
  });

  describe('POST /chat - simulateAIResponse', () => {
    it('responds with resume advice when message contains "resume"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'Can you review my resume?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('84%');
    });

    it('responds with ATS advice when message contains "ats"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'Help me with ATS optimization' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('84%');
    });

    it('responds with roadmap info when message contains "roadmap"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'Show me my roadmap' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('12 Months');
    });

    it('responds with schedule info when message contains "schedule"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'What is my schedule?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('roadmap');
    });

    it('responds with interview tips when message contains "interview"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'I have an interview next week' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('system design');
    });

    it('responds with DSA tips when message contains "dsa"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'How to improve DSA skills?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('DSA');
    });

    it('responds with salary info when message contains "salary"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'What is the average salary?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('24.7 LPA');
    });

    it('responds with package info when message contains "package"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'Tell me about the package' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('package');
    });

    it('responds with project suggestion when message contains "project"', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'Suggest a project idea' });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('chatbot');
    });

    it('returns fallback response for unrecognized messages', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'Hello, how are you?' });

      expect(res.status).toBe(200);
      expect(res.body.response).toBe('I can analyze that for you. Complete the current assessment module to unlock tailored recommendations.');
    });

    it('passes context object alongside message', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .set(authHeader())
        .send({ message: 'project', context: { level: 'beginner' } });

      expect(res.status).toBe(200);
      expect(res.body.response).toContain('chatbot');
    });

    it('returns 401 without auth token', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/chat')
        .send({ message: 'hello' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /generate-roadmap - generateRoadmap', () => {
    it('returns 6 steps for beginner starting with Core Foundations', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set(authHeader())
        .send({ targetRole: 'AI Engineer', currentLevel: 'beginner' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap).toHaveLength(6);
      expect(res.body.roadmap[0].topic).toBe('Core Foundations');
    });

    it('returns 6 steps for intermediate level', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set(authHeader())
        .send({ targetRole: 'AI Engineer', currentLevel: 'intermediate' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap).toHaveLength(6);
      expect(res.body.roadmap[0].topic).toBe('Advanced Concepts');
    });

    it('returns steps starting with Architecture for advanced level', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set(authHeader())
        .send({ targetRole: 'AI Engineer', currentLevel: 'advanced' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap).toHaveLength(6);
      expect(res.body.roadmap[0].topic).toBe('Architecture');
    });

    it('defaults to beginner for unknown level', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set(authHeader())
        .send({ targetRole: 'AI Engineer', currentLevel: 'expert' });

      expect(res.status).toBe(200);
      expect(res.body.roadmap[0].topic).toBe('Core Foundations');
    });

    it('each step has month, topic, and duration fields', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .set(authHeader())
        .send({ targetRole: 'AI Engineer', currentLevel: 'beginner' });

      expect(res.status).toBe(200);
      res.body.roadmap.forEach((step: any, i: number) => {
        expect(step).toHaveProperty('month', `Month ${i + 1}`);
        expect(step).toHaveProperty('topic');
        expect(step).toHaveProperty('duration', `${4 + i} weeks`);
      });
    });

    it('returns 401 without auth token', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/generate-roadmap')
        .send({ targetRole: 'AI Engineer', currentLevel: 'beginner' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /course-recommendation', () => {
    it('returns programs matching given skills', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ skills: ['Python', 'ML', 'React'] }),
        mockProgram({ skills: ['Java', 'Spring'] }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/course-recommendation')
        .set(authHeader())
        .send({ skills: ['Python'], targetRole: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.recommendations).toHaveLength(1);
    });

    it('matches program by targetRole in title', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ title: 'AI Engineer Bootcamp', skills: [] }),
        mockProgram({ title: 'Web Development', skills: [] }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/course-recommendation')
        .set(authHeader())
        .send({ skills: [], targetRole: 'AI Engineer' });

      expect(res.status).toBe(200);
      expect(res.body.recommendations).toHaveLength(1);
    });

    it('returns empty array when no programs match', async () => {
      seed(COLLECTIONS.PROGRAMS, [
        mockProgram({ skills: ['Java'], title: 'Java Basics' }),
      ]);
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/course-recommendation')
        .set(authHeader())
        .send({ skills: ['Rust'], targetRole: 'Unknown Role' });

      expect(res.status).toBe(200);
      expect(res.body.recommendations).toHaveLength(0);
    });

    it('returns 401 without auth token', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/course-recommendation')
        .send({ skills: ['Python'], targetRole: 'AI Engineer' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /skill-gap-analysis - getRoleSkills', () => {
    it('returns ai engineer skills', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({ currentSkills: [], targetRole: 'ai engineer' });

      expect(res.status).toBe(200);
      expect(res.body.totalSkills).toBe(6);
      expect(res.body.gaps).toEqual(['Python', 'Machine Learning', 'Deep Learning', 'LLMs', 'MLOps', 'PyTorch']);
    });

    it('returns data scientist skills', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({ currentSkills: [], targetRole: 'data scientist' });

      expect(res.status).toBe(200);
      expect(res.body.totalSkills).toBe(6);
      expect(res.body.gaps).toContain('Python');
      expect(res.body.gaps).toContain('Statistics');
      expect(res.body.gaps).toContain('Data Visualization');
    });

    it('returns product manager skills', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({ currentSkills: [], targetRole: 'product manager' });

      expect(res.status).toBe(200);
      expect(res.body.totalSkills).toBe(6);
      expect(res.body.gaps).toContain('Product Strategy');
      expect(res.body.gaps).toContain('A/B Testing');
    });

    it('returns full stack developer skills', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({ currentSkills: [], targetRole: 'full stack developer' });

      expect(res.status).toBe(200);
      expect(res.body.totalSkills).toBe(6);
      expect(res.body.gaps).toContain('React');
      expect(res.body.gaps).toContain('Node.js');
      expect(res.body.gaps).toContain('AWS');
    });

    it('returns data analyst skills', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({ currentSkills: [], targetRole: 'data analyst' });

      expect(res.status).toBe(200);
      expect(res.body.totalSkills).toBe(6);
      expect(res.body.gaps).toContain('Tableau');
      expect(res.body.gaps).toContain('Power BI');
    });

    it('returns default skills for unknown role', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({ currentSkills: [], targetRole: 'unknown role' });

      expect(res.status).toBe(200);
      expect(res.body.totalSkills).toBe(4);
      expect(res.body.gaps).toEqual(['Python', 'SQL', 'Communication', 'Problem Solving']);
    });

    it('computes matchScore correctly with partial skill match', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({ currentSkills: ['Python', 'Machine Learning'], targetRole: 'ai engineer' });

      expect(res.status).toBe(200);
      expect(res.body.matchScore).toBe(33);
      expect(res.body.gaps).toHaveLength(4);
    });

    it('returns 100 matchScore when all skills match', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .set(authHeader())
        .send({
          currentSkills: ['Python', 'Machine Learning', 'Deep Learning', 'LLMs', 'MLOps', 'PyTorch'],
          targetRole: 'ai engineer',
        });

      expect(res.status).toBe(200);
      expect(res.body.matchScore).toBe(100);
      expect(res.body.gaps).toHaveLength(0);
    });

    it('returns 401 without auth token', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/skill-gap-analysis')
        .send({ currentSkills: [], targetRole: 'ai engineer' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /career-guidance - getCareerGuidance', () => {
    it('provides career switch guidance for "switch" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'I want to switch my career' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('transferable skills');
    });

    it('provides pivot guidance for "pivot" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'How can I pivot to AI?' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('Career Analysis');
    });

    it('provides transition guidance for "transition" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'Tips for career transition' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('6-month roadmap');
    });

    it('provides promotion guidance for "promotion" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'How do I get a promotion?' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('leadership skills');
    });

    it('provides growth guidance for "growth" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'Career growth advice' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('portfolio');
    });

    it('provides career choice guidance for "which" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'Which career should I choose?' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('Career DNA assessment');
    });

    it('provides career choice guidance for "best" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'What is the best career for me?' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('Career DNA assessment');
    });

    it('provides career choice guidance for "choose" keyword', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'Help me choose a career path' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('Career DNA assessment');
    });

    it('returns default guidance for unrecognized questions', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .set(authHeader())
        .send({ question: 'Tell me about yourself' });

      expect(res.status).toBe(200);
      expect(res.body.guidance).toContain('Explore our career paths');
    });

    it('returns 401 without auth token', async () => {
      const app = createApp();
      const res = await supertest(app)
        .post('/api/ai/career-guidance')
        .send({ question: 'Career advice' });

      expect(res.status).toBe(401);
    });
  });
});
