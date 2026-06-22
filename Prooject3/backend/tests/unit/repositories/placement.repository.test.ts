import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { PlacementRepository } from '../../../src/modules/placements/placement.repository.js';
import { UserFactory, EmployerFactory, JobFactory, ApplicationFactory, PlacementFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('PlacementRepository', () => {
  let prisma: PrismaClient;
  let repository: PlacementRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new PlacementRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a placement', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const application = await ApplicationFactory.create(job.id, user.id);

      const placement = await repository.create({
        applicationId: application.id,
        jobId: job.id,
        userId: user.id,
        status: 'PENDING',
        ctc: 1200000,
      });

      expect(placement).toBeDefined();
      expect(placement.id).toBeDefined();
      expect(placement.applicationId).toBe(application.id);
      expect(placement.userId).toBe(user.id);
    });
  });

  describe('findById', () => {
    it('should find placement by id', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const application = await ApplicationFactory.create(job.id, user.id);
      const created = await PlacementFactory.create(application.id, job.id, user.id);

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByApplicationId', () => {
    it('should find placement by application id', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const application = await ApplicationFactory.create(job.id, user.id);
      const created = await PlacementFactory.create(application.id, job.id, user.id);

      const found = await repository.findByApplicationId(application.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent application id', async () => {
      const found = await repository.findByApplicationId('non-existent-application');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple placements', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const app1 = await ApplicationFactory.create(job.id, user.id);
      const app2 = await ApplicationFactory.create(job.id, user.id);
      await PlacementFactory.create(app1.id, job.id, user.id);
      await PlacementFactory.create(app2.id, job.id, user.id);

      const placements = await repository.findMany({});

      expect(placements).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find placements by user', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const app1 = await ApplicationFactory.create(job.id, user.id);
      const app2 = await ApplicationFactory.create(job.id, user.id);
      await PlacementFactory.create(app1.id, job.id, user.id);
      await PlacementFactory.create(app2.id, job.id, user.id);

      const placements = await repository.findByUser(user.id);

      expect(placements).toHaveLength(2);
      expect(placements.every(p => p.userId === user.id)).toBe(true);
    });
  });

  describe('findByJob', () => {
    it('should find placements by job', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const app1 = await ApplicationFactory.create(job.id, user1.id);
      const app2 = await ApplicationFactory.create(job.id, user2.id);
      await PlacementFactory.create(app1.id, job.id, user1.id);
      await PlacementFactory.create(app2.id, job.id, user2.id);

      const placements = await repository.findByJob(job.id);

      expect(placements).toHaveLength(2);
      expect(placements.every(p => p.jobId === job.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update placement', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const application = await ApplicationFactory.create(job.id, user.id);
      const created = await PlacementFactory.create(application.id, job.id, user.id);

      const updated = await repository.update(created.id, { status: 'ACCEPTED' });

      expect(updated.status).toBe('ACCEPTED');
    });
  });

  describe('delete', () => {
    it('should delete placement', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const application = await ApplicationFactory.create(job.id, user.id);
      const created = await PlacementFactory.create(application.id, job.id, user.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count placements', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const app1 = await ApplicationFactory.create(job.id, user.id);
      const app2 = await ApplicationFactory.create(job.id, user.id);
      await PlacementFactory.create(app1.id, job.id, user.id);
      await PlacementFactory.create(app2.id, job.id, user.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('getPlacementStats', () => {
    it('should return placement statistics', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const user3 = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const app1 = await ApplicationFactory.create(job.id, user1.id);
      const app2 = await ApplicationFactory.create(job.id, user2.id);
      const app3 = await ApplicationFactory.create(job.id, user3.id);
      await PlacementFactory.create(app1.id, job.id, user1.id, { status: 'PENDING' });
      await PlacementFactory.create(app2.id, job.id, user2.id, { status: 'ACCEPTED' });
      await PlacementFactory.create(app3.id, job.id, user3.id, { status: 'REJECTED' });

      const stats = await repository.getPlacementStats();

      expect(stats.total).toBe(3);
      expect(stats.pending).toBe(1);
      expect(stats.accepted).toBe(1);
      expect(stats.rejected).toBe(1);
    });
  });

  describe('getPlacementRate', () => {
    it('should calculate placement rate', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const app1 = await ApplicationFactory.create(job.id, user1.id);
      const app2 = await ApplicationFactory.create(job.id, user2.id);
      await PlacementFactory.create(app1.id, job.id, user1.id, { status: 'ACCEPTED' });
      await PlacementFactory.create(app2.id, job.id, user2.id, { status: 'REJECTED' });

      const rate = await repository.getPlacementRate();

      expect(rate).toBe(50);
    });

    it('should return 0 when no placements', async () => {
      const rate = await repository.getPlacementRate();

      expect(rate).toBe(0);
    });
  });

  describe('getAverageCtc', () => {
    it('should calculate average CTC', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const app1 = await ApplicationFactory.create(job.id, user1.id);
      const app2 = await ApplicationFactory.create(job.id, user2.id);
      await PlacementFactory.create(app1.id, job.id, user1.id, { status: 'ACCEPTED', ctc: 1000000 });
      await PlacementFactory.create(app2.id, job.id, user2.id, { status: 'ACCEPTED', ctc: 1500000 });

      const result = await repository.getAverageCtc();

      expect(result.averageCtc).toBe(1250000);
      expect(result.totalPlacements).toBe(2);
    });
  });
});
