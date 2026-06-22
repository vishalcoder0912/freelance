import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, EnrollmentStatus } from '@prisma/client';
import { EnrollmentRepository } from '../../../src/modules/enrollments/enrollment.repository.js';
import { UserFactory, ProgramFactory, EnrollmentFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('EnrollmentRepository', () => {
  let prisma: PrismaClient;
  let repository: EnrollmentRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new EnrollmentRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create an enrollment', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();

      const enrollment = await repository.create({
        userId: user.id,
        programId: program.id,
        status: EnrollmentStatus.ACTIVE,
        progress: 0,
      });

      expect(enrollment).toBeDefined();
      expect(enrollment.id).toBeDefined();
      expect(enrollment.userId).toBe(user.id);
      expect(enrollment.programId).toBe(program.id);
    });
  });

  describe('findById', () => {
    it('should find enrollment by id', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await EnrollmentFactory.create(user.id, program.id);

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByUserAndProgram', () => {
    it('should find enrollment by user and program', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await EnrollmentFactory.create(user.id, program.id);

      const found = await repository.findByUserAndProgram(user.id, program.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent combination', async () => {
      const found = await repository.findByUserAndProgram('user-id', 'program-id');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple enrollments', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      await EnrollmentFactory.create(user.id, program.id);
      await EnrollmentFactory.create(user.id, program.id);

      const enrollments = await repository.findMany({});

      expect(enrollments).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find enrollments by user', async () => {
      const user = await UserFactory.create();
      const program1 = await ProgramFactory.create();
      const program2 = await ProgramFactory.create();
      await EnrollmentFactory.create(user.id, program1.id);
      await EnrollmentFactory.create(user.id, program2.id);

      const enrollments = await repository.findByUser(user.id);

      expect(enrollments).toHaveLength(2);
      expect(enrollments.every(e => e.userId === user.id)).toBe(true);
    });
  });

  describe('findByProgram', () => {
    it('should find enrollments by program', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const program = await ProgramFactory.create();
      await EnrollmentFactory.create(user1.id, program.id);
      await EnrollmentFactory.create(user2.id, program.id);

      const enrollments = await repository.findByProgram(program.id);

      expect(enrollments).toHaveLength(2);
      expect(enrollments.every(e => e.programId === program.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update enrollment', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await EnrollmentFactory.create(user.id, program.id);

      const updated = await repository.update(created.id, { progress: 50 });

      expect(updated.progress).toBe(50);
    });
  });

  describe('updateStatus', () => {
    it('should update enrollment status', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await EnrollmentFactory.create(user.id, program.id);

      const updated = await repository.updateStatus(created.id, EnrollmentStatus.COMPLETED);

      expect(updated.status).toBe(EnrollmentStatus.COMPLETED);
    });
  });

  describe('updateProgress', () => {
    it('should update enrollment progress', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await EnrollmentFactory.create(user.id, program.id);

      const updated = await repository.updateProgress(created.id, 75);

      expect(updated.progress).toBe(75);
    });
  });

  describe('delete', () => {
    it('should delete enrollment', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      const created = await EnrollmentFactory.create(user.id, program.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count enrollments', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      await EnrollmentFactory.create(user.id, program.id);
      await EnrollmentFactory.create(user.id, program.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('findActiveByProgram', () => {
    it('should find active enrollments by program', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const program = await ProgramFactory.create();
      await EnrollmentFactory.create(user1.id, program.id, { status: EnrollmentStatus.ACTIVE });
      await EnrollmentFactory.create(user2.id, program.id, { status: EnrollmentStatus.COMPLETED });

      const active = await repository.findActiveByProgram(program.id);

      expect(active).toHaveLength(1);
      expect(active[0].status).toBe(EnrollmentStatus.ACTIVE);
    });
  });

  describe('findCompletedByUser', () => {
    it('should find completed enrollments by user', async () => {
      const user = await UserFactory.create();
      const program1 = await ProgramFactory.create();
      const program2 = await ProgramFactory.create();
      await EnrollmentFactory.create(user.id, program1.id, { status: EnrollmentStatus.ACTIVE });
      await EnrollmentFactory.create(user.id, program2.id, { status: EnrollmentStatus.COMPLETED });

      const completed = await repository.findCompletedByUser(user.id);

      expect(completed).toHaveLength(1);
      expect(completed[0].status).toBe(EnrollmentStatus.COMPLETED);
    });
  });

  describe('hasEnrolled', () => {
    it('should return true if user is enrolled', async () => {
      const user = await UserFactory.create();
      const program = await ProgramFactory.create();
      await EnrollmentFactory.create(user.id, program.id);

      const result = await repository.hasEnrolled(user.id, program.id);

      expect(result).toBe(true);
    });

    it('should return false if user is not enrolled', async () => {
      const result = await repository.hasEnrolled('user-id', 'program-id');

      expect(result).toBe(false);
    });
  });

  describe('getEnrollmentStats', () => {
    it('should return enrollment statistics', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      const user3 = await UserFactory.create();
      const user4 = await UserFactory.create();
      const program = await ProgramFactory.create();
      await EnrollmentFactory.create(user1.id, program.id, { status: EnrollmentStatus.ACTIVE });
      await EnrollmentFactory.create(user2.id, program.id, { status: EnrollmentStatus.ACTIVE });
      await EnrollmentFactory.create(user3.id, program.id, { status: EnrollmentStatus.COMPLETED });
      await EnrollmentFactory.create(user4.id, program.id, { status: EnrollmentStatus.DROPPED });

      const stats = await repository.getEnrollmentStats(program.id);

      expect(stats.total).toBe(4);
      expect(stats.active).toBe(2);
      expect(stats.completed).toBe(1);
      expect(stats.dropped).toBe(1);
    });
  });
});
