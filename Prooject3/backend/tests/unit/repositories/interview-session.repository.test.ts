import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { UserFactory, InterviewSessionFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('InterviewSession (direct Prisma)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create an interview session', async () => {
      const user = await UserFactory.create();

      const session = await prisma.interviewSession.create({
        data: {
          userId: user.id,
          type: 'technical',
          questions: [
            { question: 'What is React?', type: 'technical' },
            { question: 'Explain closures', type: 'technical' },
          ],
          answers: [
            { answer: 'React is a UI library', score: 8 },
            { answer: 'Closures are functions with lexical scope', score: 7 },
          ],
          score: 7.5,
          feedback: 'Good performance',
          duration: 30,
        },
      });

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.userId).toBe(user.id);
      expect(session.type).toBe('technical');
    });
  });

  describe('findById', () => {
    it('should find interview session by id', async () => {
      const user = await UserFactory.create();
      const created = await InterviewSessionFactory.create(user.id);

      const found = await prisma.interviewSession.findUnique({ where: { id: created.id } });

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await prisma.interviewSession.findUnique({ where: { id: 'non-existent-id' } });

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple interview sessions', async () => {
      const user = await UserFactory.create();
      await InterviewSessionFactory.create(user.id);
      await InterviewSessionFactory.create(user.id);

      const sessions = await prisma.interviewSession.findMany({});

      expect(sessions).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find interview sessions by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await InterviewSessionFactory.create(user1.id);
      await InterviewSessionFactory.create(user1.id);
      await InterviewSessionFactory.create(user2.id);

      const sessions = await prisma.interviewSession.findMany({
        where: { userId: user1.id },
      });

      expect(sessions).toHaveLength(2);
      expect(sessions.every(s => s.userId === user1.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update interview session', async () => {
      const user = await UserFactory.create();
      const created = await InterviewSessionFactory.create(user.id);

      const updated = await prisma.interviewSession.update({
        where: { id: created.id },
        data: { score: 9.0, feedback: 'Excellent' },
      });

      expect(updated.score).toBe(9.0);
      expect(updated.feedback).toBe('Excellent');
    });
  });

  describe('delete', () => {
    it('should delete interview session', async () => {
      const user = await UserFactory.create();
      const created = await InterviewSessionFactory.create(user.id);

      await prisma.interviewSession.delete({ where: { id: created.id } });

      const found = await prisma.interviewSession.findUnique({ where: { id: created.id } });
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count interview sessions', async () => {
      const user = await UserFactory.create();
      await InterviewSessionFactory.create(user.id);
      await InterviewSessionFactory.create(user.id);

      const count = await prisma.interviewSession.count();

      expect(count).toBe(2);
    });
  });

  describe('find by type', () => {
    it('should find sessions by type', async () => {
      const user = await UserFactory.create();
      await InterviewSessionFactory.create(user.id, { type: 'technical' });
      await InterviewSessionFactory.create(user.id, { type: 'behavioral' });
      await InterviewSessionFactory.create(user.id, { type: 'technical' });

      const sessions = await prisma.interviewSession.findMany({
        where: { type: 'technical' },
      });

      expect(sessions).toHaveLength(2);
      expect(sessions.every(s => s.type === 'technical')).toBe(true);
    });
  });

  describe('update questions', () => {
    it('should update questions JSON array', async () => {
      const user = await UserFactory.create();
      const created = await InterviewSessionFactory.create(user.id);

      const newQuestions = [
        { question: 'New question 1', type: 'system_design' },
        { question: 'New question 2', type: 'behavioral' },
      ];
      const updated = await prisma.interviewSession.update({
        where: { id: created.id },
        data: { questions: newQuestions },
      });

      expect(updated.questions).toHaveLength(2);
    });
  });

  describe('update answers', () => {
    it('should update answers JSON array', async () => {
      const user = await UserFactory.create();
      const created = await InterviewSessionFactory.create(user.id);

      const newAnswers = [
        { answer: 'New answer 1', score: 9 },
        { answer: 'New answer 2', score: 8 },
      ];
      const updated = await prisma.interviewSession.update({
        where: { id: created.id },
        data: { answers: newAnswers },
      });

      expect(updated.answers).toHaveLength(2);
    });
  });

  describe('aggregate score', () => {
    it('should calculate average score', async () => {
      const user = await UserFactory.create();
      await InterviewSessionFactory.create(user.id, { score: 7 });
      await InterviewSessionFactory.create(user.id, { score: 9 });

      const result = await prisma.interviewSession.aggregate({
        _avg: { score: true },
      });

      expect(result._avg.score).toBe(8);
    });
  });
});
