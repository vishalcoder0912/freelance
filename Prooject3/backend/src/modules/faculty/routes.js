import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  res.json(await getAllDocuments(COLLECTIONS.FACULTY));
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const faculty = await getDocument(COLLECTIONS.FACULTY, req.params.id);
  if (!faculty) return res.status(404).json({ error: 'Not found' });
  res.json(faculty);
}));

router.post('/', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.status(201).json(await createDocument(COLLECTIONS.FACULTY, req.body));
}));

router.patch('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.FACULTY, req.params.id, req.body));
}));

router.delete('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.FACULTY, req.params.id);
  res.json({ message: 'Faculty deleted' });
}));

export default router;
