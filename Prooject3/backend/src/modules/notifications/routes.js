import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  res.json(await queryDocuments(COLLECTIONS.NOTIFICATIONS, [{ field: 'userId', value: req.user.uid }]));
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const notification = await createDocument(COLLECTIONS.NOTIFICATIONS, { ...req.body, userId: req.user.uid, read: false, createdAt: new Date().toISOString() });
  res.status(201).json(notification);
}));

router.patch('/read', authenticate, asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const notifications = await queryDocuments(COLLECTIONS.NOTIFICATIONS, [{ field: 'userId', value: req.user.uid }]);
  const toUpdate = notifications.filter(n => ids?.includes(n.id));
  await Promise.all(toUpdate.map(n => updateDocument(COLLECTIONS.NOTIFICATIONS, n.id, { read: true })));
  res.json({ message: `${toUpdate.length} notifications marked as read` });
}));

router.delete('/:id', authenticate, asyncHandler(async (req, res) => {
  const notification = await getDocument(COLLECTIONS.NOTIFICATIONS, req.params.id);
  if (!notification) return res.status(404).json({ error: 'Not found' });
  if (notification.userId !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
  await deleteDocument(COLLECTIONS.NOTIFICATIONS, req.params.id);
  res.json({ message: 'Notification deleted' });
}));

export default router;
