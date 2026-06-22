import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { PrismaClient, NotificationType } from '@prisma/client';
import { NotificationRepository } from '../../../src/modules/notifications/notification.repository.js';
import { UserFactory, NotificationFactory } from '../../factories/index.js';
import { truncateAllTables } from '../../setup/prisma.js';

describe('NotificationRepository', () => {
  let prisma: PrismaClient;
  let repository: NotificationRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new NotificationRepository(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await truncateAllTables();
  });

  describe('create', () => {
    it('should create a notification', async () => {
      const user = await UserFactory.create();

      const notification = await repository.create({
        userId: user.id,
        type: NotificationType.GENERAL,
        title: 'Test Notification',
        message: 'This is a test',
        isRead: false,
      });

      expect(notification).toBeDefined();
      expect(notification.id).toBeDefined();
      expect(notification.userId).toBe(user.id);
      expect(notification.title).toBe('Test Notification');
    });
  });

  describe('findById', () => {
    it('should find notification by id', async () => {
      const user = await UserFactory.create();
      const created = await NotificationFactory.create(user.id);

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
    it('should find multiple notifications', async () => {
      const user = await UserFactory.create();
      await NotificationFactory.create(user.id);
      await NotificationFactory.create(user.id);

      const notifications = await repository.findMany({});

      expect(notifications).toHaveLength(2);
    });
  });

  describe('findByUser', () => {
    it('should find notifications by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await NotificationFactory.create(user1.id);
      await NotificationFactory.create(user1.id);
      await NotificationFactory.create(user2.id);

      const notifications = await repository.findByUser(user1.id);

      expect(notifications).toHaveLength(2);
      expect(notifications.every(n => n.userId === user1.id)).toBe(true);
    });
  });

  describe('findUnreadByUser', () => {
    it('should find unread notifications by user', async () => {
      const user = await UserFactory.create();
      await NotificationFactory.create(user.id, { isRead: false });
      await NotificationFactory.create(user.id, { isRead: false });
      await NotificationFactory.create(user.id, { isRead: true });

      const unread = await repository.findUnreadByUser(user.id);

      expect(unread).toHaveLength(2);
      expect(unread.every(n => n.isRead === false)).toBe(true);
    });
  });

  describe('findByType', () => {
    it('should find notifications by type', async () => {
      const user = await UserFactory.create();
      await NotificationFactory.create(user.id, { type: NotificationType.ASSIGNMENT });
      await NotificationFactory.create(user.id, { type: NotificationType.PAYMENT });

      const assignments = await repository.findByType(user.id, NotificationType.ASSIGNMENT);

      expect(assignments).toHaveLength(1);
      expect(assignments[0].type).toBe(NotificationType.ASSIGNMENT);
    });
  });

  describe('update', () => {
    it('should update notification', async () => {
      const user = await UserFactory.create();
      const created = await NotificationFactory.create(user.id);

      const updated = await repository.update(created.id, { title: 'Updated Title' });

      expect(updated.title).toBe('Updated Title');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const user = await UserFactory.create();
      const created = await NotificationFactory.create(user.id, { isRead: false });

      const marked = await repository.markAsRead(created.id);

      expect(marked.isRead).toBe(true);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const user = await UserFactory.create();
      await NotificationFactory.create(user.id, { isRead: false });
      await NotificationFactory.create(user.id, { isRead: false });
      await NotificationFactory.create(user.id, { isRead: true });

      const count = await repository.markAllAsRead(user.id);

      expect(count).toBe(2);
      const allNotifications = await repository.findByUser(user.id);
      expect(allNotifications.every(n => n.isRead)).toBe(true);
    });
  });

  describe('delete', () => {
    it('should delete notification', async () => {
      const user = await UserFactory.create();
      const created = await NotificationFactory.create(user.id);

      await repository.delete(created.id);

      const found = await repository.findById(created.id);
      expect(found).toBeNull();
    });
  });

  describe('deleteAllByUser', () => {
    it('should delete all notifications by user', async () => {
      const user1 = await UserFactory.create();
      const user2 = await UserFactory.create();
      await NotificationFactory.create(user1.id);
      await NotificationFactory.create(user1.id);
      await NotificationFactory.create(user2.id);

      const count = await repository.deleteAllByUser(user1.id);

      expect(count).toBe(2);
      const remaining = await repository.findByUser(user1.id);
      expect(remaining).toHaveLength(0);
    });
  });

  describe('count', () => {
    it('should count notifications', async () => {
      const user = await UserFactory.create();
      await NotificationFactory.create(user.id);
      await NotificationFactory.create(user.id);

      const count = await repository.count();

      expect(count).toBe(2);
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread count', async () => {
      const user = await UserFactory.create();
      await NotificationFactory.create(user.id, { isRead: false });
      await NotificationFactory.create(user.id, { isRead: false });
      await NotificationFactory.create(user.id, { isRead: true });

      const count = await repository.getUnreadCount(user.id);

      expect(count).toBe(2);
    });
  });

  describe('createBulk', () => {
    it('should create multiple notifications', async () => {
      const user = await UserFactory.create();

      const count = await repository.createBulk([
        { userId: user.id, type: NotificationType.GENERAL, title: 'Notification 1', message: 'Message 1' },
        { userId: user.id, type: NotificationType.PAYMENT, title: 'Notification 2', message: 'Message 2' },
        { userId: user.id, type: NotificationType.ASSIGNMENT, title: 'Notification 3', message: 'Message 3' },
      ]);

      expect(count).toBe(3);
      const all = await repository.findByUser(user.id);
      expect(all).toHaveLength(3);
    });
  });
});
