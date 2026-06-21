import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const filters = req.user.role === ROLES.ADMIN ? [] : [{ field: 'userId', value: req.user.uid }];
  res.json(await queryDocuments(COLLECTIONS.PROJECTS, filters));
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const project = await getDocument(COLLECTIONS.PROJECTS, req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json(project);
}));

router.post('/', authenticate, asyncHandler(async (req, res) => {
  const project = await createDocument(COLLECTIONS.PROJECTS, { ...req.body, userId: req.user.uid, status: 'IN_PROGRESS' });
  res.status(201).json(project);
}));

router.patch('/:id', authenticate, asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.PROJECTS, req.params.id, req.body));
}));

router.post('/submit', authenticate, asyncHandler(async (req, res) => {
  const { projectId, submissionUrl } = req.body;
  res.json(await updateDocument(COLLECTIONS.PROJECTS, projectId, { submissionUrl, status: 'SUBMITTED', submittedAt: new Date().toISOString() }));
}));

router.get('/review', authenticate, authorize(ROLES.ADMIN, ROLES.MENTOR), asyncHandler(async (req, res) => {
  res.json(await queryDocuments(COLLECTIONS.PROJECTS, [{ field: 'status', value: 'SUBMITTED' }]));
}));

export default router;
