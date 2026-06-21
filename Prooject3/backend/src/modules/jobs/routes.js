import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, updateDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  const { type, search, location } = req.query;
  let jobs = await getAllDocuments(COLLECTIONS.JOBS);
  if (type) jobs = jobs.filter(j => j.type === type);
  if (location) jobs = jobs.filter(j => j.location?.toLowerCase().includes(location.toLowerCase()));
  if (search) jobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company?.toLowerCase().includes(search.toLowerCase()));
  res.json(jobs);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const job = await getDocument(COLLECTIONS.JOBS, req.params.id);
  if (!job) return res.status(404).json({ error: 'Not found' });
  res.json(job);
}));

router.post('/', authenticate, authorize(ROLES.ADMIN, ROLES.RECRUITER), asyncHandler(async (req, res) => {
  const job = await createDocument(COLLECTIONS.JOBS, { ...req.body, postedBy: req.user.uid, postedAt: new Date().toISOString(), status: 'ACTIVE' });
  res.status(201).json(job);
}));

router.post('/apply', authenticate, asyncHandler(async (req, res) => {
  const { jobId, resumeUrl, coverLetter } = req.body;
  const application = await createDocument(COLLECTIONS.APPLICATIONS, {
    jobId, userId: req.user.uid, resumeUrl, coverLetter, status: 'PENDING', appliedAt: new Date().toISOString()
  });
  res.status(201).json(application);
}));

router.get('/applications', authenticate, asyncHandler(async (req, res) => {
  const filters = req.user.role === ROLES.ADMIN ? [] : [{ field: 'userId', value: req.user.uid }];
  res.json(await queryDocuments(COLLECTIONS.APPLICATIONS, filters));
}));

router.patch('/applications/:id', authenticate, authorize(ROLES.ADMIN, ROLES.RECRUITER), asyncHandler(async (req, res) => {
  res.json(await updateDocument(COLLECTIONS.APPLICATIONS, req.params.id, req.body));
}));

router.get('/placement-stats', asyncHandler(async (req, res) => {
  const placements = await getAllDocuments(COLLECTIONS.PLACEMENTS);
  const total = placements.length;
  const avgPackage = total > 0 ? placements.reduce((sum, p) => sum + (parseInt(p.package) || 0), 0) / total : 0;
  const byCompany = {};
  placements.forEach(p => { byCompany[p.company] = (byCompany[p.company] || 0) + 1; });
  res.json({ totalPlacements: total, averagePackage: `₹${Math.round(avgPackage/100000)} LPA`, topCompanies: Object.entries(byCompany).sort((a, b) => b[1] - a[1]).slice(0, 5) });
}));

export default router;
