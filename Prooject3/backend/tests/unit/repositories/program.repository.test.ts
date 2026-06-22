import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, DifficultyLevel } from '@prisma/client';
import { ProgramRepository } from '../../../src/modules/programs/program.repository.js';
import { ProgramFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('ProgramRepository', () => {
  let prisma: PrismaClient;
  let repository: ProgramRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new ProgramRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a new program', async () => {
      const programData = {
        title: 'Test Program',
        slug: 'test-program',
        description: 'Test description',
        category: 'Data Science',
        duration: 12,
        level: DifficultyLevel.BEGINNER,
        price: 9999,
        isActive: true,
      };

      const program = await repository.create(programData);

      expect(program).toBeDefined();
      expect(program.id).toBeDefined();
      expect(program.title).toBe('Test Program');
      expect(program.slug).toBe('test-program');
    });
  });

  describe('findById', () => {
    it('should find program by id', async () => {
      const created = await ProgramFactory.create();

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findBySlug', () => {
    it('should find program by slug', async () => {
      const created = await ProgramFactory.create({ slug: 'my-test-slug' });

      const found = await repository.findBySlug('my-test-slug');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent slug', async () => {
      const found = await repository.findBySlug('non-existent-slug');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple programs', async () => {
      await ProgramFactory.createMany(3);

      const programs = await repository.findMany({});

      expect(programs).toHaveLength(3);
    });

    it('should support pagination', async () => {
      await ProgramFactory.createMany(5);

      const programs = await repository.findMany({ skip: 0, take: 2 });

      expect(programs).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update program', async () => {
      const created = await ProgramFactory.create();

      const updated = await repository.update(created.id, { title: 'Updated Title' });

      expect(updated.title).toBe('Updated Title');
    });
  });

  describe('delete', () => {
    it('should delete program', async () => {
      const created = await ProgramFactory.create();

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count programs', async () => {
      await ProgramFactory.createMany(3);

      const count = await repository.count();

      expect(count).toBe(3);
    });
  });

  describe('search', () => {
    it('should search programs by title', async () => {
      await ProgramFactory.create({ title: 'React Development' });
      await ProgramFactory.create({ title: 'Python Basics' });

      const results = await repository.search('React');

      expect(results).toHaveLength(1);
      expect(results[0].title).toContain('React');
    });

    it('should search programs by category', async () => {
      await ProgramFactory.create({ category: 'Data Science' });
      await ProgramFactory.create({ category: 'Engineering' });

      const results = await repository.search('Data Science');

      expect(results).toHaveLength(1);
    });

    it('should not return inactive programs in search', async () => {
      await ProgramFactory.create({ title: 'Active Program', isActive: true });
      await ProgramFactory.create({ title: 'Active React', isActive: false });

      const results = await repository.search('Active');

      expect(results).toHaveLength(1);
      expect(results[0].isActive).toBe(true);
    });
  });

  describe('findByCategory', () => {
    it('should find programs by category', async () => {
      await ProgramFactory.create({ category: 'AI' });
      await ProgramFactory.create({ category: 'AI' });
      await ProgramFactory.create({ category: 'Engineering' });

      const results = await repository.findByCategory('AI');

      expect(results).toHaveLength(2);
      expect(results.every(p => p.category === 'AI')).toBe(true);
    });
  });

  describe('findFeatured', () => {
    it('should find featured programs', async () => {
      await ProgramFactory.create({ isFeatured: true, isActive: true });
      await ProgramFactory.create({ isFeatured: false, isActive: true });
      await ProgramFactory.create({ isFeatured: true, isActive: true });

      const featured = await repository.findFeatured();

      expect(featured).toHaveLength(2);
      expect(featured.every(p => p.isFeatured && p.isActive)).toBe(true);
    });
  });

  describe('incrementStudents', () => {
    it('should increment student count', async () => {
      const created = await ProgramFactory.create({ currentStudents: 0 });

      const updated = await repository.incrementStudents(created.id);

      expect(updated.currentStudents).toBe(1);
    });
  });

  describe('decrementStudents', () => {
    it('should decrement student count', async () => {
      const created = await ProgramFactory.create({ currentStudents: 5 });

      const updated = await repository.decrementStudents(created.id);

      expect(updated.currentStudents).toBe(4);
    });
  });

  describe('updateRating', () => {
    it('should update rating and total reviews', async () => {
      const created = await ProgramFactory.create({ rating: 0, totalReviews: 0 });

      const updated = await repository.updateRating(created.id, 4.5, 10);

      expect(updated.rating).toBe(4.5);
      expect(updated.totalReviews).toBe(10);
    });
  });
});
