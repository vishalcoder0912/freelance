import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const filters = req.user.role === ROLES.ADMIN ? [] : [{ field: 'userId', value: req.user.uid }];
  res.json(await queryDocuments(COLLECTIONS.ASSIGNMENTS, filters));
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const assignment = await getDocument(COLLECTIONS.ASSIGNMENTS, req.params.id);
  if (!assignment) return res.status(404).json({ error: 'Not found' });
  res.json(assignment);
}));

router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.MENTOR), asyncHandler(async (req, res) => {
  const assignment = await createDocument(COLLECTIONS.ASSIGNMENTS, req.body);
  res.status(201).json(assignment);
}));

router.patch('/:id', authenticate, asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.ASSIGNMENTS, req.params.id, req.body));
}));

router.post('/submit', authenticate, asyncHandler(async (req, res) => {
  const { assignmentId, submissionUrl, notes } = req.body;
  const submission = await createDocument(COLLECTIONS.ASSIGNMENTS + '_submissions', {
    assignmentId, userId: req.user.uid, submissionUrl, notes, submittedAt: new Date().toISOString(), status: 'SUBMITTED'
  });
  res.status(201).json(submission);
}));

router.get('/submissions', authenticate, authorize(ROLES.ADMIN, ROLES.MENTOR), asyncHandler(async (req, res) => {
  res.json(await getAllDocuments(COLLECTIONS.ASSIGNMENTS + '_submissions'));
}));

export default router;
