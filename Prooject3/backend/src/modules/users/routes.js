import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

// GET /api/users
router.get('/', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const { role } = req.query;
  const users = role ? await queryDocuments(COLLECTIONS.USERS, [{ field: 'role', value: role }]) : await getAllDocuments(COLLECTIONS.USERS);
  res.json(users);
}));

// GET /api/users/:id
router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const user = await getDocument(COLLECTIONS.USERS, req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (req.user.role !== ROLES.ADMIN && req.user.uid !== req.params.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(user);
}));

// PATCH /api/users/:id
router.patch('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const user = await updateDocument(COLLECTIONS.USERS, req.params.id, req.body);
  res.json(user);
}));

// DELETE /api/users/:id
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.USERS, req.params.id);
  res.json({ message: 'User deleted' });
}));

// GET /api/users/student
router.get('/student', authenticate, asyncHandler(async (req, res) => {
  const students = await queryDocuments(COLLECTIONS.USERS, [{ field: 'role', value: 'STUDENT' }]);
  res.json(students);
}));

// GET /api/users/mentor
router.get('/mentor', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const mentors = await queryDocuments(COLLECTIONS.USERS, [{ field: 'role', value: 'MENTOR' }]);
  res.json(mentors);
}));

// GET /api/users/recruiter
router.get('/recruiter', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const recruiters = await queryDocuments(COLLECTIONS.USERS, [{ field: 'role', value: 'RECRUITER' }]);
  res.json(recruiters);
}));

export default router;
