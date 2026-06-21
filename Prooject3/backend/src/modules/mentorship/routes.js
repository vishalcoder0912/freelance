import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getAllDocuments(COLLECTIONS.MENTORS));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const mentor = await getDocument(COLLECTIONS.MENTORS, req.params.id);
  if (!mentor) return res.status(404).json({ error: 'Not found' });
  res.json(mentor);
}));

router.post('/bookings', authenticate, asyncHandler(async (req, res) => {
  const { mentorId, scheduledAt, topic, notes } = req.body;
  const booking = await createDocument(COLLECTIONS.MENTORSHIP_SESSIONS, {
    mentorId, studentId: req.user.uid, scheduledAt, topic, notes, status: 'PENDING', createdAt: new Date().toISOString()
  });
  res.status(201).json(booking);
}));

router.get('/bookings', authenticate, asyncHandler(async (req, res) => {
  const filters = req.user.role === ROLES.ADMIN ? [] : 
    req.user.role === ROLES.MENTOR ? [{ field: 'mentorId', value: req.user.uid }] :
    [{ field: 'studentId', value: req.user.uid }];
  res.json(await queryDocuments(COLLECTIONS.MENTORSHIP_SESSIONS, filters));
}));

router.patch('/bookings/:id', authenticate, asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.MENTORSHIP_SESSIONS, req.params.id, req.body));
}));

router.delete('/bookings/:id', authenticate, asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.MENTORSHIP_SESSIONS, req.params.id);
  res.json({ message: 'Booking cancelled' });
}));

export default router;
