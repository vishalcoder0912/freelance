import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, JobType } from '@prisma/client';
import { JobRepository } from '../../../src/modules/jobs/job.repository.js';
import { UserFactory, EmployerFactory, JobFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('JobRepository', () => {
  let prisma: PrismaClient;
  let repository: JobRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new JobRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a job', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();

      const job = await repository.create({
        employerId: employer.id,
        recruiterId: recruiter.id,
        title: 'Software Engineer',
        description: 'Test description',
        requirements: ['React', 'Node.js'],
        responsibilities: ['Write code'],
        location: 'Bangalore',
        jobType: JobType.FULL_TIME,
        isActive: true,
      });

      expect(job).toBeDefined();
      expect(job.id).toBeDefined();
      expect(job.title).toBe('Software Engineer');
      expect(job.employerId).toBe(employer.id);
    });
  });

  describe('findById', () => {
    it('should find job by id', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const created = await JobFactory.create(employer.id, recruiter.id);

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
    it('should find multiple jobs', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter.id);
      await JobFactory.create(employer.id, recruiter.id);

      const jobs = await repository.findMany({});

      expect(jobs).toHaveLength(2);
    });
  });

  describe('findByEmployer', () => {
    it('should find jobs by employer', async () => {
      const employer1 = await EmployerFactory.create();
      const employer2 = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer1.id, recruiter.id);
      await JobFactory.create(employer1.id, recruiter.id);
      await JobFactory.create(employer2.id, recruiter.id);

      const jobs = await repository.findByEmployer(employer1.id);

      expect(jobs).toHaveLength(2);
      expect(jobs.every(j => j.employerId === employer1.id)).toBe(true);
    });
  });

  describe('findByRecruiter', () => {
    it('should find jobs by recruiter', async () => {
      const employer = await EmployerFactory.create();
      const recruiter1 = await UserFactory.createRecruiter();
      const recruiter2 = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter1.id);
      await JobFactory.create(employer.id, recruiter1.id);
      await JobFactory.create(employer.id, recruiter2.id);

      const jobs = await repository.findByRecruiter(recruiter1.id);

      expect(jobs).toHaveLength(2);
      expect(jobs.every(j => j.recruiterId === recruiter1.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update job', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const created = await JobFactory.create(employer.id, recruiter.id);

      const updated = await repository.update(created.id, { title: 'Senior Engineer' });

      expect(updated.title).toBe('Senior Engineer');
    });
  });

  describe('delete', () => {
    it('should delete job', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      const created = await JobFactory.create(employer.id, recruiter.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count jobs', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter.id);
      await JobFactory.create(employer.id, recruiter.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('search', () => {
    it('should search jobs by title', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter.id, { title: 'React Developer' });
      await JobFactory.create(employer.id, recruiter.id, { title: 'Python Developer' });

      const results = await repository.search('React');

      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('React');
    });

    it('should not return inactive jobs in search', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter.id, { title: 'Active React', isActive: true });
      await JobFactory.create(employer.id, recruiter.id, { title: 'Inactive React', isActive: false });

      const results = await repository.search('React');

      expect(results).toHaveLength(1);
      expect(results[0].isActive).toBe(true);
    });
  });

  describe('findByType', () => {
    it('should find jobs by type', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter.id, { jobType: JobType.FULL_TIME });
      await JobFactory.create(employer.id, recruiter.id, { jobType: JobType.INTERNSHIP });

      const fullTimeJobs = await repository.findByType(JobType.FULL_TIME);

      expect(fullTimeJobs).toHaveLength(1);
      expect(fullTimeJobs[0].jobType).toBe(JobType.FULL_TIME);
    });
  });

  describe('findActiveJobs', () => {
    it('should find active jobs', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter.id, { isActive: true });
      await JobFactory.create(employer.id, recruiter.id, { isActive: false });

      const activeJobs = await repository.findActiveJobs();

      expect(activeJobs).toHaveLength(1);
      expect(activeJobs[0].isActive).toBe(true);
    });
  });

  describe('findJobsWithApplications', () => {
    it('should find jobs with application count', async () => {
      const employer = await EmployerFactory.create();
      const recruiter = await UserFactory.createRecruiter();
      await JobFactory.create(employer.id, recruiter.id, { isActive: true });

      const jobs = await repository.findJobsWithApplications();

      expect(jobs).toHaveLength(1);
      expect(jobs[0]._count).toBeDefined();
    });
  });
});
