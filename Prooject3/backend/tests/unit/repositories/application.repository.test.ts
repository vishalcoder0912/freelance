import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, ApplicationStatus } from '@prisma/client';
import { ApplicationRepository } from '../../../src/modules/jobs/application.repository.js';
import { UserFactory, EmployerFactory, JobFactory, ApplicationFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('ApplicationRepository', () => {
  let prisma: PrismaClient;
  let repository: ApplicationRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new ApplicationRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create an application', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);

      const application = await repository.create({
        jobId: job.id,
        userId: user.id,
        status: ApplicationStatus.PENDING,
        resumeUrl: 'https://example.com/resume.pdf',
        coverLetter: 'I am interested',
      });

      expect(application).toBeDefined();
      expect(application.id).toBeDefined();
      expect(application.jobId).toBe(job.id);
      expect(application.userId).toBe(user.id);
    });
  });

  describe('findById', () => {
    it('should find application by id', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const created = await ApplicationFactory.create(job.id, user.id);

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByJobAndUser', () => {
    it('should find application by job and user', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const created = await ApplicationFactory.create(job.id, user.id);

      const found = await repository.findByJobAndUser(job.id, user.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent combination', async () => {
      const found = await repository.findByJobAndUser('job-id', 'user-id');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple applications', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      await ApplicationFactory.create(job.id, user.id);

      const applications = await repository.findMany({});

      expect(applications).toHaveLength(1);
    });
  });

  describe('findByUser', () => {
    it('should find applications by user', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job1 = await JobFactory.create(employer.id, recruiter.id);
      const job2 = await JobFactory.create(employer.id, recruiter.id);
      await ApplicationFactory.create(job1.id, user.id);
      await ApplicationFactory.create(job2.id, user.id);

      const applications = await repository.findByUser(user.id);

      expect(applications).toHaveLength(2);
      expect(applications.every(a => a.userId === user.id)).toBe(true);
    });
  });

  describe('findByJob', () => {
    it('should find applications by job', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      await ApplicationFactory.create(job.id, user1.id);
      await ApplicationFactory.create(job.id, user2.id);

      const applications = await repository.findByJob(job.id);

      expect(applications).toHaveLength(2);
      expect(applications.every(a => a.jobId === job.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update application', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const created = await ApplicationFactory.create(job.id, user.id);

      const updated = await repository.update(created.id, { notes: 'Updated notes' });

      expect(updated.notes).toBe('Updated notes');
    });
  });

  describe('updateStatus', () => {
    it('should update application status', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const created = await ApplicationFactory.create(job.id, user.id);

      const updated = await repository.updateStatus(created.id, ApplicationStatus.SHORTLISTED);

      expect(updated.status).toBe(ApplicationStatus.SHORTLISTED);
    });
  });

  describe('delete', () => {
    it('should delete application', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      const created = await ApplicationFactory.create(job.id, user.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count applications', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      await ApplicationFactory.create(job.id, user.id);

      const count = await repository.count();

      expect(count).toBe(1);
    });
  });

  describe('hasApplied', () => {
    it('should return true if user has applied', async () => {
      const user = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      await ApplicationFactory.create(job.id, user.id);

      const result = await repository.hasApplied(job.id, user.id);

      expect(result).toBe(true);
    });

    it('should return false if user has not applied', async () => {
      const result = await repository.hasApplied('job-id', 'user-id');

      expect(result).toBe(false);
    });
  });

  describe('getApplicationStats', () => {
    it('should return application statistics', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const user3 = await UserFactory.create();
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const job = await JobFactory.create(employer.id, recruiter.id);
      await ApplicationFactory.create(job.id, user1.id, { status: ApplicationStatus.PENDING });
      await ApplicationFactory.create(job.id, user2.id, { status: ApplicationStatus.SHORTLISTED });
      await ApplicationFactory.create(job.id, user3.id, { status: ApplicationStatus.REJECTED });

      const stats = await repository.getApplicationStats(job.id);

      expect(stats.total).toBe(3);
      expect(stats.pending).toBe(1);
      expect(stats.shortlisted).toBe(1);
      expect(stats.rejected).toBe(1);
    });
  });
});
