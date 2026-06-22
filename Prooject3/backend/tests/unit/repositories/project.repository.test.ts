import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { ProjectRepository } from '../../../src/modules/projects/project.repository.js';
import { UserFactory, ProjectFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('ProjectRepository', () => {
  let prisma: PrismaClient;
  let repository: ProjectRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new ProjectRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a project', async () => {
      const user = await UserFactory.create();

      const project = await repository.create({
        userId: user.id,
        title: 'Test Project',
        description: 'Test description',
        githubUrl: 'https://github.com/test/project',
        technologies: ['React', 'Node.js'],
      });

      expect(project).toBeDefined();
      expect(project.id).toBeDefined();
      expect(project.title).toBe('Test Project');
      expect(project.userId).toBe(user.id);
    });
  });

  describe('findById', () => {
    it('should find project by id', async () => {
      const user = await UserFactory.create();
      const created = await ProjectFactory.create(user.id);

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
    it('should find multiple projects', async () => {
      const user = await UserFactory.create();
      await ProjectFactory.create(user.id);
      await ProjectFactory.create(user.id);

      const projects = await repository.findMany({});

      expect(projects).toHaveLength(2);
    });

    it('should support pagination', async () => {
      const user = await UserFactory.create();
      await ProjectFactory.create(user.id);
      await ProjectFactory.create(user.id);
      await ProjectFactory.create(user.id);

      const projects = await repository.findMany({ skip: 0, take: 2 });

      expect(projects).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find projects by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await ProjectFactory.create(user1.id);
      await ProjectFactory.create(user1.id);
      await ProjectFactory.create(user2.id);

      const projects = await repository.findByUser(user1.id);

      expect(projects).toHaveLength(2);
      expect(projects.every(p => p.userId === user1.id)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update project', async () => {
      const user = await UserFactory.create();
      const created = await ProjectFactory.create(user.id);

      const updated = await repository.update(created.id, { title: 'Updated Title' });

      expect(updated.title).toBe('Updated Title');
    });
  });

  describe('review', () => {
    it('should review project', async () => {
      const user = await UserFactory.create();
      const reviewer = await UserFactory.create();
      const created = await ProjectFactory.create(user.id);

      const reviewed = await repository.review(created.id, 90, 'Excellent work', reviewer.id);

      expect(reviewed.score).toBe(90);
      expect(reviewed.feedback).toBe('Excellent work');
      expect(reviewed.reviewedBy).toBe(reviewer.id);
      expect(reviewed.reviewedAt).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should delete project', async () => {
      const user = await UserFactory.create();
      const created = await ProjectFactory.create(user.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count projects', async () => {
      const user = await UserFactory.create();
      await ProjectFactory.create(user.id);
      await ProjectFactory.create(user.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });

    it('should count projects with filter', async () => {
      const user = await UserFactory.create();
      await ProjectFactory.create(user.id, { score: 85 });
      await ProjectFactory.create(user.id, { score: null });

      const count = await repository.count({ score: { not: null } });

      expect(count).toBe(1);
    });
  });

  describe('findByGithubUrl', () => {
    it('should find project by github url', async () => {
      const user = await UserFactory.create();
      const created = await ProjectFactory.create(user.id, {
        githubUrl: 'https://github.com/user/specific-project',
      });

      const found = await repository.findByGithubUrl('https://github.com/user/specific-project');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent github url', async () => {
      const found = await repository.findByGithubUrl('https://github.com/nonexistent/repo');

      expect(found).toBeNull();
    });
  });

  describe('hasSubmitted', () => {
    it('should return true if user has submitted project with github url', async () => {
      const user = await UserFactory.create();
      const githubUrl = 'https://github.com/user/my-project';
      await ProjectFactory.create(user.id, { githubUrl });

      const result = await repository.hasSubmitted(githubUrl, user.id);

      expect(result).toBe(true);
    });

    it('should return false if user has not submitted project', async () => {
      const result = await repository.hasSubmitted('https://github.com/nonexistent/repo', 'user-id');

      expect(result).toBe(false);
    });
  });
});
