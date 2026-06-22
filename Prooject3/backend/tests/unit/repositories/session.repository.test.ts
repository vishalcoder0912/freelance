import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { MentorSessionRepository } from '../../../src/modules/mentorship/session.repository.js';
import { UserFactory, MentorSessionFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('MentorSessionRepository', () => {
  let prisma: PrismaClient;
  let repository: MentorSessionRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new MentorSessionRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a mentor session', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();

      const session = await repository.create({
        mentorId: mentor.id,
        studentId: student.id,
        scheduledAt: new Date('2024-12-01T10:00:00Z'),
        duration: 60,
        topic: 'Career guidance',
        status: 'SCHEDULED',
      });

      expect(session).toBeDefined();
      expect(session.id).toBeDefined();
      expect(session.mentorId).toBe(mentor.id);
      expect(session.studentId).toBe(student.id);
      expect(session.topic).toBe('Career guidance');
    });
  });

  describe('findById', () => {
    it('should find mentor session by id', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const created = await MentorSessionFactory.create(mentor.id, student.id);

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
    it('should find multiple mentor sessions', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      await MentorSessionFactory.create(mentor.id, student.id);
      await MentorSessionFactory.create(mentor.id, student.id);

      const sessions = await repository.findMany({});

      expect(sessions).toHaveLength(2);
    });
  });

  describe('findByMentor', () => {
    it('should find sessions by mentor', async () => {
      const mentor1 = await UserFactory.createMentor();
      const mentor2 = await UserFactory.createMentor();
      const student = await UserFactory.create();
      await MentorSessionFactory.create(mentor1.id, student.id);
      await MentorSessionFactory.create(mentor1.id, student.id);
      await MentorSessionFactory.create(mentor2.id, student.id);

      const sessions = await repository.findByMentor(mentor1.id);

      expect(sessions).toHaveLength(2);
      expect(sessions.every(s => s.mentorId === mentor1.id)).toBe(true);
    });
  });

  describe('findByStudent', () => {
    it('should find sessions by student', async () => {
      const mentor = await UserFactory.createMentor();
      const student1 = await UserFactory.create();
      const student2 = await UserFactory.create();
      await MentorSessionFactory.create(mentor.id, student1.id);
      await MentorSessionFactory.create(mentor.id, student1.id);
      await MentorSessionFactory.create(mentor.id, student2.id);

      const sessions = await repository.findByStudent(student1.id);

      expect(sessions).toHaveLength(2);
      expect(sessions.every(s => s.studentId === student1.id)).toBe(true);
    });
  });

  describe('findUpcoming', () => {
    it('should find upcoming sessions', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      await MentorSessionFactory.create(mentor.id, student.id, {
        scheduledAt: new Date(Date.now() + 86400000),
        status: 'SCHEDULED',
      });
      await MentorSessionFactory.create(mentor.id, student.id, {
        scheduledAt: new Date(Date.now() - 86400000),
        status: 'SCHEDULED',
      });

      const upcoming = await repository.findUpcoming(mentor.id);

      expect(upcoming).toHaveLength(1);
      expect(upcoming[0].scheduledAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('update', () => {
    it('should update mentor session', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const created = await MentorSessionFactory.create(mentor.id, student.id);

      const updated = await repository.update(created.id, { topic: 'Updated topic' });

      expect(updated.topic).toBe('Updated topic');
    });
  });

  describe('complete', () => {
    it('should complete session', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const created = await MentorSessionFactory.create(mentor.id, student.id);

      const completed = await repository.complete(created.id, 'Session notes', 5);

      expect(completed.status).toBe('COMPLETED');
      expect(completed.notes).toBe('Session notes');
      expect(completed.rating).toBe(5);
    });

    it('should complete session without optional params', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const created = await MentorSessionFactory.create(mentor.id, student.id);

      const completed = await repository.complete(created.id);

      expect(completed.status).toBe('COMPLETED');
    });
  });

  describe('cancel', () => {
    it('should cancel session', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const created = await MentorSessionFactory.create(mentor.id, student.id);

      const cancelled = await repository.cancel(created.id);

      expect(cancelled.status).toBe('CANCELLED');
    });
  });

  describe('delete', () => {
    it('should delete mentor session', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const created = await MentorSessionFactory.create(mentor.id, student.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count mentor sessions', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      await MentorSessionFactory.create(mentor.id, student.id);
      await MentorSessionFactory.create(mentor.id, student.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('hasConflict', () => {
    it('should return true when there is a conflict', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const scheduledAt = new Date('2024-12-01T10:00:00Z');
      await MentorSessionFactory.create(mentor.id, student.id, {
        scheduledAt,
        duration: 60,
        status: 'SCHEDULED',
      });

      const hasConflict = await repository.hasConflict(mentor.id, scheduledAt, 60);

      expect(hasConflict).toBe(true);
    });

    it('should return false when there is no conflict', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const scheduledAt = new Date('2024-12-01T10:00:00Z');
      await MentorSessionFactory.create(mentor.id, student.id, {
        scheduledAt,
        duration: 60,
        status: 'COMPLETED',
      });

      const hasConflict = await repository.hasConflict(mentor.id, new Date('2024-12-01T12:00:00Z'), 60);

      expect(hasConflict).toBe(false);
    });

    it('should exclude specific session from conflict check', async () => {
      const mentor = await UserFactory.createMentor();
      const student = await UserFactory.create();
      const scheduledAt = new Date('2024-12-01T10:00:00Z');
      const existing = await MentorSessionFactory.create(mentor.id, student.id, {
        scheduledAt,
        duration: 60,
        status: 'SCHEDULED',
      });

      const hasConflict = await repository.hasConflict(mentor.id, scheduledAt, 60, existing.id);

      expect(hasConflict).toBe(false);
    });
  });
});
