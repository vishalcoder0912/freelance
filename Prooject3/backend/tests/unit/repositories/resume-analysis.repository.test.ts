import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { ResumeAnalysisRepository } from '../../../src/modules/resume/resume.repository.js';
import { UserFactory, ResumeAnalysisFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('ResumeAnalysisRepository', () => {
  let prisma: PrismaClient;
  let repository: ResumeAnalysisRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new ResumeAnalysisRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a resume analysis', async () => {
      const user = await UserFactory.create();

      const analysis = await repository.create({
        userId: user.id,
        fileName: 'resume.pdf',
        atsScore: 75.5,
        keywords: ['JavaScript', 'React'],
        suggestions: ['Add more details'],
      });

      expect(analysis).toBeDefined();
      expect(analysis.id).toBeDefined();
      expect(analysis.userId).toBe(user.id);
      expect(analysis.fileName).toBe('resume.pdf');
    });
  });

  describe('findById', () => {
    it('should find resume analysis by id', async () => {
      const user = await UserFactory.create();
      const created = await ResumeAnalysisFactory.create(user.id);

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple resume analyses', async () => {
      const user = await UserFactory.create();
      await ResumeAnalysisFactory.create(user.id);
      await ResumeAnalysisFactory.create(user.id);

      const analyses = await repository.findMany({});

      expect(analyses).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find resume analyses by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await ResumeAnalysisFactory.create(user1.id);
      await ResumeAnalysisFactory.create(user1.id);
      await ResumeAnalysisFactory.create(user2.id);

      const analyses = await repository.findByUser(user1.id);

      expect(analyses).toHaveLength(2);
      expect(analyses.every(a => a.userId === user1.id)).toBe(true);
    });
  });

  describe('findLatestByUser', () => {
    it('should find latest resume analysis by user', async () => {
      const user = await UserFactory.create();
      const old = await ResumeAnalysisFactory.create(user.id, {
        createdAt: new Date('2024-01-01'),
      });
      const latest = await ResumeAnalysisFactory.create(user.id, {
        createdAt: new Date('2024-06-01'),
      });

      const found = await repository.findLatestByUser(user.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(latest.id);
    });

    it('should return null for user with no analyses', async () => {
      const found = await repository.findLatestByUser('user-with-no-analyses');

      expect(found).toBeNull();
    });
  });

  describe('update', () => {
    it('should update resume analysis', async () => {
      const user = await UserFactory.create();
      const created = await ResumeAnalysisFactory.create(user.id);

      const updated = await repository.update(created.id, { atsScore: 85.0 });

      expect(updated.atsScore).toBe(85.0);
    });
  });

  describe('delete', () => {
    it('should delete resume analysis', async () => {
      const user = await UserFactory.create();
      const created = await ResumeAnalysisFactory.create(user.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count resume analyses', async () => {
      const user = await UserFactory.create();
      await ResumeAnalysisFactory.create(user.id);
      await ResumeAnalysisFactory.create(user.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });

    it('should count with filter', async () => {
      const user = await UserFactory.create();
      await ResumeAnalysisFactory.create(user.id, { atsScore: 80 });
      await ResumeAnalysisFactory.create(user.id, { atsScore: 60 });

      const count = await repository.count({ atsScore: { gte: 70 } });

      expect(count).toBe(1);
    });
  });

  describe('getAverageAtsScore', () => {
    it('should calculate average ATS score', async () => {
      const user = await UserFactory.create();
      await ResumeAnalysisFactory.create(user.id, { atsScore: 70 });
      await ResumeAnalysisFactory.create(user.id, { atsScore: 90 });

      const avg = await repository.getAverageAtsScore(user.id);

      expect(avg).toBe(80);
    });

    it('should return 0 for user with no analyses', async () => {
      const avg = await repository.getAverageAtsScore('user-with-no-analyses');

      expect(avg).toBe(0);
    });
  });
});
