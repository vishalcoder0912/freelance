import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { AssignmentRepository, SubmissionRepository } from '../../../src/modules/assignments/assignment.repository.js';
import { UserFactory, ProgramFactory, AssignmentFactory, SubmissionFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('AssignmentRepository', () => {
  let prisma: PrismaClient;
  let assignmentRepo: AssignmentRepository;
  let submissionRepo: SubmissionRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    assignmentRepo = new AssignmentRepository(prisma);
    submissionRepo = new SubmissionRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('Assignment CRUD', () => {
    describe('create', () => {
      it('should create an assignment', async () => {
        const program = await ProgramFactory.create();

        const assignment = await assignmentRepo.create({
          programId: program.id,
          title: 'Test Assignment',
          description: 'Test description',
          maxScore: 100,
          isActive: true,
        });

        expect(assignment).toBeDefined();
        expect(assignment.id).toBeDefined();
        expect(assignment.title).toBe('Test Assignment');
        expect(assignment.programId).toBe(program.id);
      });
    });

    describe('findById', () => {
      it('should find assignment by id', async () => {
        const program = await ProgramFactory.create();
        const created = await AssignmentFactory.create(program.id);

        const found = await assignmentRepo.findById(created.id);

        expect(found).toBeDefined();
        expect(found?.id).toBe(created.id);
      });

      it('should return null for non-existent id', async () => {
        const found = await assignmentRepo.findById('non-existent-id');

        expect(found).toBeNull();
      });
    });

    describe('findMany', () => {
      it('should find multiple assignments', async () => {
        const program = await ProgramFactory.create();
        await AssignmentFactory.create(program.id);
        await AssignmentFactory.create(program.id);

        const assignments = await assignmentRepo.findMany({});

        expect(assignments).toHaveLength(2);
      });
    });

    describe('findByProgram', () => {
      it('should find assignments by program', async () => {
        const program1 = await ProgramFactory.create();
        const program2 = await ProgramFactory.create();
        await AssignmentFactory.create(program1.id);
        await AssignmentFactory.create(program1.id);
        await AssignmentFactory.create(program2.id);

        const assignments = await assignmentRepo.findByProgram(program1.id);

        expect(assignments).toHaveLength(2);
        expect(assignments.every(a => a.programId === program1.id)).toBe(true);
      });
    });

    describe('update', () => {
      it('should update assignment', async () => {
        const program = await ProgramFactory.create();
        const created = await AssignmentFactory.create(program.id);

        const updated = await assignmentRepo.update(created.id, { title: 'Updated Title' });

        expect(updated.title).toBe('Updated Title');
      });
    });

    describe('delete', () => {
      it('should delete assignment', async () => {
        const program = await ProgramFactory.create();
        const created = await AssignmentFactory.create(program.id);

        await assignmentRepo.delete(created.id);

        const found = await assignmentRepo.findById(created.id);
        expect(found).toBeNull();
      });
    });

    describe('count', () => {
      it('should count assignments', async () => {
        const program = await ProgramFactory.create();
        await AssignmentFactory.create(program.id);
        await AssignmentFactory.create(program.id);

        const count = await assignmentRepo.count();

        expect(count).toBe(2);
      });
    });

    describe('findActiveByProgram', () => {
      it('should find active assignments by program', async () => {
        const program = await ProgramFactory.create();
        await AssignmentFactory.create(program.id, { isActive: true });
        await AssignmentFactory.create(program.id, { isActive: false });

        const active = await assignmentRepo.findActiveByProgram(program.id);

        expect(active).toHaveLength(1);
        expect(active[0].isActive).toBe(true);
      });
    });
  });

  describe('Submission CRUD', () => {
    describe('create', () => {
      it('should create a submission', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);

        const submission = await submissionRepo.create({
          assignmentId: assignment.id,
          userId: user.id,
          content: 'My submission',
        });

        expect(submission).toBeDefined();
        expect(submission.id).toBeDefined();
        expect(submission.assignmentId).toBe(assignment.id);
        expect(submission.userId).toBe(user.id);
      });
    });

    describe('findById', () => {
      it('should find submission by id', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        const created = await SubmissionFactory.create(assignment.id, user.id);

        const found = await submissionRepo.findById(created.id);

        expect(found).toBeDefined();
        expect(found?.id).toBe(created.id);
      });

      it('should return null for non-existent id', async () => {
        const found = await submissionRepo.findById('non-existent-id');

        expect(found).toBeNull();
      });
    });

    describe('findByAssignmentAndUser', () => {
      it('should find submission by assignment and user', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        const created = await SubmissionFactory.create(assignment.id, user.id);

        const found = await submissionRepo.findByAssignmentAndUser(assignment.id, user.id);

        expect(found).toBeDefined();
        expect(found?.id).toBe(created.id);
      });

      it('should return null for non-existent combination', async () => {
        const found = await submissionRepo.findByAssignmentAndUser('assignment-id', 'user-id');

        expect(found).toBeNull();
      });
    });

    describe('findMany', () => {
      it('should find multiple submissions', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        await SubmissionFactory.create(assignment.id, user.id);

        const submissions = await submissionRepo.findMany({});

        expect(submissions).toHaveLength(1);
      });
    });

    describe('findByAssignment', () => {
      it('should find submissions by assignment', async () => {
        const user1 = await UserFactory.create();
        const user2 = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        await SubmissionFactory.create(assignment.id, user1.id);
        await SubmissionFactory.create(assignment.id, user2.id);

        const submissions = await submissionRepo.findByAssignment(assignment.id);

        expect(submissions).toHaveLength(2);
        expect(submissions.every(s => s.assignmentId === assignment.id)).toBe(true);
      });
    });

    describe('findByUser', () => {
      it('should find submissions by user', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment1 = await AssignmentFactory.create(program.id);
        const assignment2 = await AssignmentFactory.create(program.id);
        await SubmissionFactory.create(assignment1.id, user.id);
        await SubmissionFactory.create(assignment2.id, user.id);

        const submissions = await submissionRepo.findByUser(user.id);

        expect(submissions).toHaveLength(2);
        expect(submissions.every(s => s.userId === user.id)).toBe(true);
      });
    });

    describe('update', () => {
      it('should update submission', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        const created = await SubmissionFactory.create(assignment.id, user.id);

        const updated = await submissionRepo.update(created.id, { content: 'Updated content' });

        expect(updated.content).toBe('Updated content');
      });
    });

    describe('review', () => {
      it('should review submission', async () => {
        const user = await UserFactory.create();
        const reviewer = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        const created = await SubmissionFactory.create(assignment.id, user.id);

        const reviewed = await submissionRepo.review(created.id, 85, 'Good work', reviewer.id);

        expect(reviewed.score).toBe(85);
        expect(reviewed.feedback).toBe('Good work');
        expect(reviewed.reviewedBy).toBe(reviewer.id);
        expect(reviewed.reviewedAt).toBeDefined();
      });
    });

    describe('delete', () => {
      it('should delete submission', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        const created = await SubmissionFactory.create(assignment.id, user.id);

        await submissionRepo.delete(created.id);

        const found = await submissionRepo.findById(created.id);
        expect(found).toBeNull();
      });
    });

    describe('count', () => {
      it('should count submissions', async () => {
        const user = await UserFactory.create();
        const program = await ProgramFactory.create();
        const assignment = await AssignmentFactory.create(program.id);
        await SubmissionFactory.create(assignment.id, user.id);

        const count = await submissionRepo.count();

        expect(count).toBe(1);
      });
    });
  });
});
