import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { AuditLogRepository } from '../../../src/modules/admin/audit.repository.js';
import { UserFactory, AuditLogFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('AuditLogRepository', () => {
  let prisma: PrismaClient;
  let repository: AuditLogRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new AuditLogRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create an audit log', async () => {
      const user = await UserFactory.create();

      const log = await repository.create({
        userId: user.id,
        action: 'CREATE',
        entity: 'User',
        entityId: 'entity-123',
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      expect(log).toBeDefined();
      expect(log.id).toBeDefined();
      expect(log.userId).toBe(user.id);
      expect(log.action).toBe('CREATE');
      expect(log.entity).toBe('User');
    });

    it('should create audit log with null userId', async () => {
      const log = await repository.create({
        userId: null,
        action: 'SYSTEM',
        entity: 'System',
        entityId: null,
      });

      expect(log).toBeDefined();
      expect(log.userId).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find audit log by id', async () => {
      const user = await UserFactory.create();
      const created = await AuditLogFactory.create(user.id);

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
    it('should find multiple audit logs', async () => {
      const user = await UserFactory.create();
      await AuditLogFactory.create(user.id);
      await AuditLogFactory.create(user.id);

      const logs = await repository.findMany({});

      expect(logs).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find audit logs by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await AuditLogFactory.create(user1.id);
      await AuditLogFactory.create(user1.id);
      await AuditLogFactory.create(user2.id);

      const logs = await repository.findByUser(user1.id);

      expect(logs).toHaveLength(2);
      expect(logs.every(l => l.userId === user1.id)).toBe(true);
    });
  });

  describe('findByEntity', () => {
    it('should find audit logs by entity', async () => {
      const user = await UserFactory.create();
      await AuditLogFactory.create(user.id, { entity: 'User', entityId: 'entity-1' });
      await AuditLogFactory.create(user.id, { entity: 'User', entityId: 'entity-1' });
      await AuditLogFactory.create(user.id, { entity: 'Program', entityId: 'entity-2' });

      const logs = await repository.findByEntity('User', 'entity-1');

      expect(logs).toHaveLength(2);
      expect(logs.every(l => l.entity === 'User' && l.entityId === 'entity-1')).toBe(true);
    });
  });

  describe('findByAction', () => {
    it('should find audit logs by action', async () => {
      const user = await UserFactory.create();
      await AuditLogFactory.create(user.id, { action: 'CREATE' });
      await AuditLogFactory.create(user.id, { action: 'CREATE' });
      await AuditLogFactory.create(user.id, { action: 'DELETE' });

      const logs = await repository.findByAction('CREATE');

      expect(logs).toHaveLength(2);
      expect(logs.every(l => l.action === 'CREATE')).toBe(true);
    });
  });

  describe('update', () => {
    it('should update audit log', async () => {
      const user = await UserFactory.create();
      const created = await AuditLogFactory.create(user.id);

      const updated = await repository.update(created.id, { ipAddress: '10.0.0.1' });

      expect(updated.ipAddress).toBe('10.0.0.1');
    });
  });

  describe('delete', () => {
    it('should delete audit log', async () => {
      const user = await UserFactory.create();
      const created = await AuditLogFactory.create(user.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('count', () => {
    it('should count audit logs', async () => {
      const user = await UserFactory.create();
      await AuditLogFactory.create(user.id);
      await AuditLogFactory.create(user.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });

    it('should count with filter', async () => {
      const user = await UserFactory.create();
      await AuditLogFactory.create(user.id, { action: 'CREATE' });
      await AuditLogFactory.create(user.id, { action: 'DELETE' });

      const count = await repository.count({ action: 'CREATE' });

      expect(count).toBe(1);
    });
  });

  describe('logAction', () => {
    it('should log action with all parameters', async () => {
      const user = await UserFactory.create();

      const log = await repository.logAction(
        user.id,
        'UPDATE',
        'User',
        'user-123',
        { name: 'Old Name' },
        { name: 'New Name' },
        '192.168.1.1',
        'Mozilla/5.0'
      );

      expect(log).toBeDefined();
      expect(log.action).toBe('UPDATE');
      expect(log.entity).toBe('User');
      expect(log.entityId).toBe('user-123');
      expect(log.oldValues).toEqual({ name: 'Old Name' });
      expect(log.newValues).toEqual({ name: 'New Name' });
      expect(log.ipAddress).toBe('192.168.1.1');
      expect(log.userAgent).toBe('Mozilla/5.0');
    });

    it('should log action with minimal parameters', async () => {
      const log = await repository.logAction(null, 'SYSTEM_EVENT', 'System', null);

      expect(log).toBeDefined();
      expect(log.action).toBe('SYSTEM_EVENT');
      expect(log.userId).toBeNull();
      expect(log.entityId).toBeNull();
    });
  });

  describe('getRecentActivity', () => {
    it('should get recent activity with limit', async () => {
      const user = await UserFactory.create();
      await AuditLogFactory.create(user.id);
      await AuditLogFactory.create(user.id);
      await AuditLogFactory.create(user.id);

      const recent = await repository.getRecentActivity(2);

      expect(recent).toHaveLength(2);
    });

    it('should default to limit 10', async () => {
      const user = await UserFactory.create();
      for (let i = 0; i < 15; i++) {
        await AuditLogFactory.create(user.id);
      }

      const recent = await repository.getRecentActivity();

      expect(recent).toHaveLength(10);
    });
  });
});
