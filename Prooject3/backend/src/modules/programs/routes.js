import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';
import { slugify } from '../../utils/helpers.js';

const router = Router();

// GET /api/programs
router.get('/', asyncHandler(async (req, res) => {
  const { category, level, duration, search } = req.query;
  let programs = await getAllDocuments(COLLECTIONS.PROGRAMS);
  if (category) programs = programs.filter(p => p.category === category);
  if (level) programs = programs.filter(p => p.level === level);
  if (duration) programs = programs.filter(p => p.duration === duration);
  if (search) programs = programs.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));
  res.json(programs);
}));

// GET /api/programs/search
router.get('/search', asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  const programs = await getAllDocuments(COLLECTIONS.PROGRAMS);
  const filtered = programs.filter(p => p.title.toLowerCase().includes(q.toLowerCase()) || p.desc.toLowerCase().includes(q.toLowerCase()) || (p.skills || []).some(s => s.toLowerCase().includes(q.toLowerCase())));
  res.json(filtered);
}));

// GET /api/programs/categories
router.get('/categories', asyncHandler(async (req, res) => {
  const programs = await getAllDocuments(COLLECTIONS.PROGRAMS);
  const categories = [...new Set(programs.map(p => p.category).filter(Boolean))];
  res.json(categories);
}));

// GET /api/programs/:slug
router.get('/:slug', asyncHandler(async (req, res) => {
  const programs = await queryDocuments(COLLECTIONS.PROGRAMS, [{ field: 'slug', value: req.params.slug }]);
  if (programs.length === 0) return res.status(404).json({ error: 'Program not found' });
  res.json(programs[0]);
}));

// POST /api/programs
router.post('/', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const data = { ...req.body, slug: slugify(req.body.title) };
  const program = await createDocument(COLLECTIONS.PROGRAMS, data);
  res.status(201).json(program);
}));

// PATCH /api/programs/:id
router.patch('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const program = await updateDocument(COLLECTIONS.PROGRAMS, req.params.id, req.body);
  res.json(program);
}));

// DELETE /api/programs/:id
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.PROGRAMS, req.params.id);
  res.json({ message: 'Program deleted' });
}));

export default router;
