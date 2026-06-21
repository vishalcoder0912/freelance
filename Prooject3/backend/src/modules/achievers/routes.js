import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { salary, company, program, search } = req.query;
  let achievers = await getAllDocuments(COLLECTIONS.ACHIEVERS);
  if (search) achievers = achievers.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  if (company) achievers = achievers.filter(a => a.company?.toLowerCase() === company.toLowerCase());
  if (program) achievers = achievers.filter(a => a.program?.toLowerCase() === program.toLowerCase());
  if (salary) achievers = achievers.filter(a => parseInt(a.salary) >= parseInt(salary));
  res.json(achievers);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const achiever = await getDocument(COLLECTIONS.ACHIEVERS, req.params.id);
  if (!achiever) return res.status(404).json({ error: 'Not found' });
  res.json(achiever);
}));

router.post('/', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.status(201).json(await createDocument(COLLECTIONS.ACHIEVERS, req.body));
}));

router.patch('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.ACHIEVERS, req.params.id, req.body));
}));

router.delete('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.ACHIEVERS, req.params.id);
  res.json({ message: 'Achiever deleted' });
}));

export default router;
