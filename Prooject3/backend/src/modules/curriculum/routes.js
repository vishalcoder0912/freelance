import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/modules', asyncHandler(async (req, res) => {
  const { programId } = req.query;
  const filters = programId ? [{ field: 'programId', value: programId }] : [];
  res.json(await queryDocuments(COLLECTIONS.MODULES, filters));
}));

router.get('/modules/:id', asyncHandler(async (req, res) => {
  const mod = await getDocument(COLLECTIONS.MODULES, req.params.id);
  if (!mod) return res.status(404).json({ error: 'Module not found' });
  res.json(mod);
}));

router.post('/modules', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.status(201).json(await createDocument(COLLECTIONS.MODULES, req.body));
}));

router.patch('/modules/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.MODULES, req.params.id, req.body));
}));

router.delete('/modules/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.MODULES, req.params.id);
  res.json({ message: 'Module deleted' });
}));

router.get('/lessons/:id', asyncHandler(async (req, res) => {
  const lesson = await getDocument(COLLECTIONS.LESSONS, req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
}));

router.post('/lessons', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.status(201).json(await createDocument(COLLECTIONS.LESSONS, req.body));
}));

router.patch('/lessons/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.LESSONS, req.params.id, req.body));
}));

router.delete('/lessons/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.LESSONS, req.params.id);
  res.json({ message: 'Lesson deleted' });
}));

export default router;
