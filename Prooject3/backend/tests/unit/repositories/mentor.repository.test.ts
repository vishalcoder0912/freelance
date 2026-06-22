import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { EmployerRepository, MentorProfileRepository } from '../../../src/modules/mentorship/mentor.repository.js';
import { UserFactory, EmployerFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('EmployerRepository', () => {
  let prisma: PrismaClient;
  let repository: EmployerRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new EmployerRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create an employer', async () => {
      const employer = await repository.create({
        name: 'Test Corp',
        email: 'hr@testcorp.com',
        website: 'https://testcorp.com',
        industry: 'Technology',
        size: '51-200',
        location: 'Bangalore',
        description: 'A tech company',
        isVerified: true,
        isActive: true,
      });

      expect(employer).toBeDefined();
      expect(employer.id).toBeDefined();
      expect(employer.name).toBe('Test Corp');
      expect(employer.email).toBe('hr@testcorp.com');
    });
  });

  describe('findById', () => {
    it('should find employer by id', async () => {
      const created = await EmployerFactory.create();

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find employer by email', async () => {
      const created = await EmployerFactory.create({ email: 'findme@company.com' });

      const found = await repository.findByEmail('findme@company.com');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent email', async () => {
      const found = await repository.findByEmail('nonexistent@company.com');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple employers', async () => {
      await EmployerFactory.create();
      await EmployerFactory.create();

      const employers = await repository.findMany({});

      expect(employers).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update employer', async () => {
      const created = await EmployerFactory.create();

      const updated = await repository.update(created.id, { name: 'Updated Corp' });

      expect(updated.name).toBe('Updated Corp');
    });
  });

  describe('delete', () => {
    it('should delete employer', async () => {
      const created = await EmployerFactory.create();

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count employers', async () => {
      await EmployerFactory.create();
      await EmployerFactory.create();

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('findActive', () => {
    it('should find active employers', async () => {
      await EmployerFactory.create({ isActive: true });
      await EmployerFactory.create({ isActive: true });
      await EmployerFactory.create({ isActive: false });

      const active = await repository.findActive();

      expect(active).toHaveLength(2);
      expect(active.every(e => e.isActive)).toBe(true);
    });
  });

  describe('verify', () => {
    it('should verify employer', async () => {
      const created = await EmployerFactory.create({ isVerified: false });

      const verified = await repository.verify(created.id);

      expect(verified.isVerified).toBe(true);
    });
  });
});

describe('MentorProfileRepository', () => {
  let prisma: PrismaClient;
  let repository: MentorProfileRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new MentorProfileRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a mentor profile', async () => {
      const user = await UserFactory.createMentor();

      const profile = await repository.create({
        userId: user.id,
        bio: 'Experienced mentor',
        expertise: ['React', 'Node.js'],
        experience: 5,
        linkedin: 'https://linkedin.com/in/mentor',
        isAvailable: true,
      });

      expect(profile).toBeDefined();
      expect(profile.id).toBeDefined();
      expect(profile.userId).toBe(user.id);
      expect(profile.bio).toBe('Experienced mentor');
    });
  });

  describe('findById', () => {
    it('should find mentor profile by id', async () => {
      const user = await UserFactory.createMentor();
      const created = await prisma.mentorProfile.create({
        data: { userId: user.id, bio: 'Test bio' },
      });

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find mentor profile by user id', async () => {
      const user = await UserFactory.createMentor();
      const created = await prisma.mentorProfile.create({
        data: { userId: user.id, bio: 'Test bio' },
      });

      const found = await repository.findByUserId(user.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent user id', async () => {
      const found = await repository.findByUserId('non-existent-user');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple mentor profiles', async () => {
      const user1 = await UserFactory.createMentor();
      const user2 = await UserFactory.createMentor();
      await prisma.mentorProfile.create({ data: { userId: user1.id } });
      await prisma.mentorProfile.create({ data: { userId: user2.id } });

      const profiles = await repository.findMany({});

      expect(profiles).toHaveLength(2);
    });
  });

  describe('update', () => {
    it('should update mentor profile', async () => {
      const user = await UserFactory.createMentor();
      const created = await prisma.mentorProfile.create({
        data: { userId: user.id, bio: 'Old bio' },
      });

      const updated = await repository.update(created.id, { bio: 'New bio' });

      expect(updated.bio).toBe('New bio');
    });
  });

  describe('delete', () => {
    it('should delete mentor profile', async () => {
      const user = await UserFactory.createMentor();
      const created = await prisma.mentorProfile.create({
        data: { userId: user.id },
      });

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count mentor profiles', async () => {
      const user1 = await UserFactory.createMentor();
      const user2 = await UserFactory.createMentor();
      await prisma.mentorProfile.create({ data: { userId: user1.id } });
      await prisma.mentorProfile.create({ data: { userId: user2.id } });

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('findAvailable', () => {
    it('should find available mentors', async () => {
      const user1 = await UserFactory.createMentor();
      const user2 = await UserFactory.createMentor();
      await prisma.mentorProfile.create({ data: { userId: user1.id, isAvailable: true } });
      await prisma.mentorProfile.create({ data: { userId: user2.id, isAvailable: false } });

      const available = await repository.findAvailable();

      expect(available).toHaveLength(1);
      expect(available[0].isAvailable).toBe(true);
    });
  });

  describe('incrementSessions', () => {
    it('should increment total sessions', async () => {
      const user = await UserFactory.createMentor();
      const created = await prisma.mentorProfile.create({
        data: { userId: user.id, totalSessions: 5 },
      });

      const updated = await repository.incrementSessions(created.id);

      expect(updated.totalSessions).toBe(6);
    });
  });

  describe('updateRating', () => {
    it('should update rating', async () => {
      const user = await UserFactory.createMentor();
      const created = await prisma.mentorProfile.create({
        data: { userId: user.id, rating: 0 },
      });

      const updated = await repository.updateRating(created.id, 4.5);

      expect(updated.rating).toBe(4.5);
    });
  });
});
