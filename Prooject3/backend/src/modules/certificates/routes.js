import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', authenticate, asyncHandler(async (req, res) => {
  const filters = req.user.role === ROLES.ADMIN ? [] : [{ field: 'userId', value: req.user.uid }];
  res.json(await queryDocuments(COLLECTIONS.CERTIFICATES, filters));
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const cert = await getDocument(COLLECTIONS.CERTIFICATES, req.params.id);
  if (!cert) return res.status(404).json({ error: 'Not found' });
  res.json(cert);
}));

router.post('/', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const cert = await createDocument(COLLECTIONS.CERTIFICATES, req.body);
  res.status(201).json(cert);
}));

router.patch('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.CERTIFICATES, req.params.id, req.body));
}));

router.get('/download/:id', authenticate, asyncHandler(async (req, res) => {
  const cert = await getDocument(COLLECTIONS.CERTIFICATES, req.params.id);
  if (!cert) return res.status(404).json({ error: 'Not found' });
  res.json({ downloadUrl: `https://storage.googleapis.com/careerveda/certificates/${cert.id}.pdf`, cert });
}));

export default router;
