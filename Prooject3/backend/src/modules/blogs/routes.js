import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, deleteDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';
import { slugify } from '../../utils/helpers.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  let blogs = await getAllDocuments(COLLECTIONS.BLOGS);
  if (category) blogs = blogs.filter(b => b.category === category);
  if (search) blogs = blogs.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.desc.toLowerCase().includes(search.toLowerCase()));
  res.json(blogs);
}));

router.get('/:slug', asyncHandler(async (req, res) => {
  const blogs = await queryDocuments(COLLECTIONS.BLOGS, [{ field: 'slug', value: req.params.slug }]);
  if (blogs.length === 0) return res.status(404).json({ error: 'Not found' });
  res.json(blogs[0]);
}));

router.post('/', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const data = { ...req.body, slug: slugify(req.body.title), authorId: req.user.uid, publishedAt: new Date().toISOString() };
  res.status(201).json(await createDocument(COLLECTIONS.BLOGS, data));
}));

router.patch('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.BLOGS, req.params.id, req.body));
}));

router.delete('/:id', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  await deleteDocument(COLLECTIONS.BLOGS, req.params.id);
  res.json({ message: 'Blog deleted' });
}));

export default router;
