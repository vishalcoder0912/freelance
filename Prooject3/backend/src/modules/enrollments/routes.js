import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

// GET /api/enrollments/my
router.get('/my', authenticate, asyncHandler(async (req, res) => {
  const enrollments = await queryDocuments(COLLECTIONS.ENROLLMENTS, [{ field: 'userId', value: req.user.uid }]);
  res.json(enrollments);
}));

// GET /api/enrollments
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.MENTOR), asyncHandler(async (req, res) => {
  const enrollments = await getAllDocuments(COLLECTIONS.ENROLLMENTS);
  res.json(enrollments);
}));

// GET /api/enrollments/:id
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const enrollment = await getDocument(COLLECTIONS.ENROLLMENTS, req.params.id);
  if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
  if (req.user.role !== ROLES.ADMIN && enrollment.userId !== req.user.uid) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(enrollment);
}));

// POST /api/enrollments
router.post('/', authenticate, asyncHandler(async (req, res) => {
  const data = { ...req.body, userId: req.user.uid, status: 'ACTIVE', enrolledAt: new Date().toISOString() };
  const enrollment = await createDocument(COLLECTIONS.ENROLLMENTS, data);
  res.status(201).json(enrollment);
}));

// PATCH /api/enrollments/:id
router.patch('/:id', authenticate, asyncHandler(async (req, res) => {
  const enrollment = await updateDocument(COLLECTIONS.ENROLLMENTS, req.params.id, req.body);
  res.json(enrollment);
}));

// DELETE /api/enrollments/:id
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.ENROLLMENTS, req.params.id);
  res.json({ message: 'Enrollment deleted' });
}));

export default router;
