import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, Role } from '@prisma/client';
import { UserRepository } from '../../../src/modules/users/user.repository.js';
import { UserFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('UserRepository', () => {
  let prisma: PrismaClient;
  let repository: UserRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new UserRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedpassword',
        name: 'Test User',
        role: Role.STUDENT,
      };

      const user = await repository.create(userData);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe(Role.STUDENT);
    });

    it('should create user with optional fields', async () => {
      const userData = {
        email: 'test2@example.com',
        password: 'hashedpassword',
        name: 'Test User 2',
        phone: '1234567890',
        avatar: 'https://example.com/avatar.jpg',
        role: Role.MENTOR,
      };

      const user = await repository.create(userData);

      expect(user.phone).toBe('1234567890');
      expect(user.avatar).toBe('https://example.com/avatar.jpg');
      expect(user.role).toBe(Role.MENTOR);
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const created = await UserFactory.create();

      const found = await repository.findById(created.id);

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
      expect(found?.email).toBe(created.email);
    });

    it('should return null for non-existent id', async () => {
      const found = await repository.findById('non-existent-id');

      expect(found).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const created = await UserFactory.create({ email: 'findme@example.com' });

      const found = await repository.findByEmail('findme@example.com');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent email', async () => {
      const found = await repository.findByEmail('nonexistent@example.com');

      expect(found).toBeNull();
    });
  });

  describe('findByFirebaseUid', () => {
    it('should find user by firebase uid', async () => {
      const created = await UserFactory.create({ firebaseUid: 'firebase-uid-123' });

      const found = await repository.findByFirebaseUid('firebase-uid-123');

      expect(found).toBeDefined();
      expect(found?.id).toBe(created.id);
    });

    it('should return null for non-existent firebase uid', async () => {
      const found = await repository.findByFirebaseUid('non-existent-uid');

      expect(found).toBeNull();
    });
  });

  describe('findMany', () => {
    it('should find multiple users', async () => {
      await UserFactory.createMany(3);

      const users = await repository.findMany({});

      expect(users).toHaveLength(3);
    });

    it('should support pagination', async () => {
      await UserFactory.createMany(5);

      const users = await repository.findMany({ skip: 0, take: 2 });

      expect(users).toHaveLength(2);
    });

    it('should filter by role', async () => {
      await UserFactory.create({ role: Role.STUDENT });
      await UserFactory.create({ role: Role.MENTOR });
      await UserFactory.create({ role: Role.STUDENT });

      const students = await repository.findMany({ where: { role: Role.STUDENT } });

      expect(students).toHaveLength(2);
      expect(students.every(u => u.role === Role.STUDENT)).toBe(true);
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const created = await UserFactory.create();

      const updated = await repository.update(created.id, { name: 'Updated Name' });

      expect(updated.name).toBe('Updated Name');
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      const created = await UserFactory.create();

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count users', async () => {
      await UserFactory.createMany(3);

      const count = await repository.count();

      expect(count).toBe(3);
    });

    it('should count users with filter', async () => {
      await UserFactory.create({ role: Role.STUDENT });
      await UserFactory.create({ role: Role.MENTOR });

      const count = await repository.count({ role: Role.STUDENT });

      expect(count).toBe(1);
    });
  });

  describe('findByRole', () => {
    it('should find users by role', async () => {
      await UserFactory.create({ role: Role.STUDENT });
      await UserFactory.create({ role: Role.MENTOR });
      await UserFactory.create({ role: Role.STUDENT });

      const mentors = await repository.findByRole(Role.MENTOR);

      expect(mentors).toHaveLength(1);
      expect(mentors[0].role).toBe(Role.MENTOR);
    });
  });

  describe('incrementLoginAttempts', () => {
    it('should increment login attempts', async () => {
      const created = await UserFactory.create({ loginAttempts: 0 });

      const updated = await repository.incrementLoginAttempts(created.id);

      expect(updated.loginAttempts).toBe(1);
    });

    it('should increment from existing value', async () => {
      const created = await UserFactory.create({ loginAttempts: 2 });

      const updated = await repository.incrementLoginAttempts(created.id);

      expect(updated.loginAttempts).toBe(3);
    });
  });

  describe('resetLoginAttempts', () => {
    it('should reset login attempts to 0', async () => {
      const created = await UserFactory.create({ loginAttempts: 5 });

      const updated = await repository.resetLoginAttempts(created.id);

      expect(updated.loginAttempts).toBe(0);
      expect(updated.lastLoginAt).toBeDefined();
    });
  });

  describe('lockAccount', () => {
    it('should lock account with reason', async () => {
      const created = await UserFactory.create();

      const locked = await repository.lockAccount(created.id, 'Too many attempts');

      expect(locked.isLocked).toBe(true);
      expect(locked.lockedAt).toBeDefined();
      expect(locked.lockedReason).toBe('Too many attempts');
    });
  });

  describe('unlockAccount', () => {
    it('should unlock account', async () => {
      const created = await UserFactory.create();
      await repository.lockAccount(created.id, 'Reason');

      const unlocked = await repository.unlockAccount(created.id);

      expect(unlocked.isLocked).toBe(false);
      expect(unlocked.lockedAt).toBeNull();
      expect(unlocked.lockedReason).toBeNull();
      expect(unlocked.loginAttempts).toBe(0);
    });
  });

  describe('setResetToken', () => {
    it('should set reset token', async () => {
      const created = await UserFactory.create();
      const expiry = new Date(Date.now() + 3600000);

      const updated = await repository.setResetToken(created.id, 'reset-token-123', expiry);

      expect(updated.resetToken).toBe('reset-token-123');
      expect(updated.resetTokenExpiry).toBeDefined();
    });
  });

  describe('clearResetToken', () => {
    it('should clear reset token', async () => {
      const created = await UserFactory.create();
      await repository.setResetToken(created.id, 'token', new Date());

      const cleared = await repository.clearResetToken(created.id);

      expect(cleared.resetToken).toBeNull();
      expect(cleared.resetTokenExpiry).toBeNull();
    });
  });

  describe('setOtp', () => {
    it('should set OTP', async () => {
      const created = await UserFactory.create();
      const expiry = new Date(Date.now() + 300000);

      const updated = await repository.setOtp(created.id, '123456', expiry);

      expect(updated.otp).toBe('123456');
      expect(updated.otpExpiry).toBeDefined();
    });
  });

  describe('verifyOtp', () => {
    it('should verify valid OTP', async () => {
      const created = await UserFactory.create({ isEmailVerified: false });
      const expiry = new Date(Date.now() + 300000);
      await repository.setOtp(created.id, '123456', expiry);

      const result = await repository.verifyOtp(created.id, '123456');

      expect(result).toBe(true);
      const user = await repository.findById(created.id);
      expect(user?.otp).toBeNull();
      expect(user?.isEmailVerified).toBe(true);
    });

    it('should return false for invalid OTP', async () => {
      const created = await UserFactory.create();
      const expiry = new Date(Date.now() + 300000);
      await repository.setOtp(created.id, '123456', expiry);

      const result = await repository.verifyOtp(created.id, '000000');

      expect(result).toBe(false);
    });

    it('should return false for expired OTP', async () => {
      const created = await UserFactory.create();
      const expiry = new Date(Date.now() - 1000);
      await repository.setOtp(created.id, '123456', expiry);

      const result = await repository.verifyOtp(created.id, '123456');

      expect(result).toBe(false);
    });

    it('should return false for non-existent user', async () => {
      const result = await repository.verifyOtp('non-existent', '123456');

      expect(result).toBe(false);
    });
  });
});
