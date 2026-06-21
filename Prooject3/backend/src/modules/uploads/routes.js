import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { deleteDocument } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.post('/image', authenticate, asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  res.json({ url: `https://storage.googleapis.com/careerveda/uploads/images/${req.file.filename}`, filename: req.file.filename });
}));

router.post('/video', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  res.json({ url: `https://storage.googleapis.com/careerveda/uploads/videos/${req.file.filename}`, filename: req.file.filename });
}));

router.post('/document', authenticate, asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });
  res.json({ url: `https://storage.googleapis.com/careerveda/uploads/documents/${req.file.filename}`, filename: req.file.filename });
}));

router.delete('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const { id } = req.params;
  res.json({ deleted: true, id });
}));

export default router;
