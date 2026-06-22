import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { UserFactory, CareerAnalysisFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('CareerAnalysis (direct Prisma)', () => {
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
    it('should create a career analysis', async () => {
      const user = await UserFactory.create();

      const analysis = await prisma.careerAnalysis.create({
        data: {
          userId: user.id,
          careerScore: 75.5,
          skillGaps: ['Leadership', 'Communication'],
          recommendations: ['Take leadership course', 'Practice public speaking'],
        },
      });

      expect(analysis).toBeDefined();
      expect(analysis.id).toBeDefined();
      expect(analysis.userId).toBe(user.id);
      expect(analysis.careerScore).toBe(75.5);
    });
  });

  describe('findById', () => {
    it('should find career analysis by id', async () => {
      const user = await UserFactory.create();
      const created = await CareerAnalysisFactory.create(user.id);

      const found = await prisma.careerAnalysis.findUnique({ where: { id: created.id } });

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await prisma.careerAnalysis.findUnique({ where: { id: 'non-existent-id' } });

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple career analyses', async () => {
      const user = await UserFactory.create();
      await CareerAnalysisFactory.create(user.id);
      await CareerAnalysisFactory.create(user.id);

      const analyses = await prisma.careerAnalysis.findMany({});

      expect(analyses).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find career analyses by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await CareerAnalysisFactory.create(user1.id);
      await CareerAnalysisFactory.create(user1.id);
      await CareerAnalysisFactory.create(user2.id);

      const analyses = await prisma.careerAnalysis.findMany({
        where: { userId: user1.id },
      });

      expect(analyses).toHaveLength(2);
      expect(analyses.every(a => a.userId === user1.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update career analysis', async () => {
      const user = await UserFactory.create();
      const created = await CareerAnalysisFactory.create(user.id);

      const updated = await prisma.careerAnalysis.update({
        where: { id: created.id },
        data: { careerScore: 85.0 },
      });

      expect(updated.careerScore).toBe(85.0);
    });
  });

  describe('delete', () => {
    it('should delete career analysis', async () => {
      const user = await UserFactory.create();
      const created = await CareerAnalysisFactory.create(user.id);

      await prisma.careerAnalysis.delete({ where: { id: created.id } });

      const found = await prisma.careerAnalysis.findUnique({ where: { id: created.id } });
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count career analyses', async () => {
      const user = await UserFactory.create();
      await CareerAnalysisFactory.create(user.id);
      await CareerAnalysisFactory.create(user.id);

      const count = await prisma.careerAnalysis.count();

      expect(count).toBe(2);
    });

    it('should count with filter', async () => {
      const user = await UserFactory.create();
      await CareerAnalysisFactory.create(user.id, { careerScore: 80 });
      await CareerAnalysisFactory.create(user.id, { careerScore: 60 });

      const count = await prisma.careerAnalysis.count({
        where: { careerScore: { gte: 70 } },
      });

      expect(count).toBe(1);
    });
  });

  describe('update skillGaps', () => {
    it('should update skill gaps array', async () => {
      const user = await UserFactory.create();
      const created = await CareerAnalysisFactory.create(user.id);

      const updated = await prisma.careerAnalysis.update({
        where: { id: created.id },
        data: { skillGaps: ['New Skill 1', 'New Skill 2', 'New Skill 3'] },
      });

      expect(updated.skillGaps).toHaveLength(3);
      expect(updated.skillGaps).toContain('New Skill 1');
    });
  });

  describe('update recommendations', () => {
    it('should update recommendations array', async () => {
      const user = await UserFactory.create();
      const created = await CareerAnalysisFactory.create(user.id);

      const updated = await prisma.careerAnalysis.update({
        where: { id: created.id },
        data: { recommendations: ['Updated recommendation'] },
      });

      expect(updated.recommendations).toHaveLength(1);
      expect(updated.recommendations).toContain('Updated recommendation');
    });
  });

  describe('update salaryPrediction', () => {
    it('should update salary prediction JSON', async () => {
      const user = await UserFactory.create();
      const created = await CareerAnalysisFactory.create(user.id);

      const salaryPrediction = { min: 500000, max: 1500000, currency: 'INR' };
      const updated = await prisma.careerAnalysis.update({
        where: { id: created.id },
        data: { salaryPrediction },
      });

      expect(updated.salaryPrediction).toEqual(salaryPrediction);
    });
  });

  describe('update roadmap', () => {
    it('should update roadmap JSON', async () => {
      const user = await UserFactory.create();
      const created = await CareerAnalysisFactory.create(user.id);

      const roadmap = { phases: [{ name: 'Phase 1', duration: '3 months' }] };
      const updated = await prisma.careerAnalysis.update({
        where: { id: created.id },
        data: { roadmap },
      });

      expect(updated.roadmap).toEqual(roadmap);
    });
  });
});
