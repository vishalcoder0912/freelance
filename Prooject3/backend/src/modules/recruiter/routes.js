import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/dashboard', authenticate, authorize(ROLES.RECRUITER, ROLES.ADMIN), asyncHandler(async (req, res) => {
  const jobs = await queryDocuments(COLLECTIONS.JOBS, [{ field: 'postedBy', value: req.user.uid }]);
  const applications = await getAllDocuments(COLLECTIONS.APPLICATIONS);
  const myJobIds = jobs.map(j => j.id);
  const myApp = applications.filter(a => myJobIds.includes(a.jobId));
  res.json({ totalJobs: jobs.length, activeJobs: jobs.filter(j => j.status === 'ACTIVE').length, totalApplications: myApp.length, shortlisted: myApp.filter(a => a.status === 'SHORTLISTED').length });
}));

router.post('/jobs', authenticate, authorize(ROLES.RECRUITER, ROLES.ADMIN), asyncHandler(async (req, res) => {
  const { createDocument } = await import('../../services/firestore.js');
  const job = await createDocument(COLLECTIONS.JOBS, { ...req.body, postedBy: req.user.uid, postedAt: new Date().toISOString(), status: 'ACTIVE' });
  res.status(201).json(job);
}));

router.get('/candidates', authenticate, authorize(ROLES.RECRUITER, ROLES.ADMIN), asyncHandler(async (req, res) => {
  const applications = await getAllDocuments(COLLECTIONS.APPLICATIONS);
  const userIds = [...new Set(applications.map(a => a.userId))];
  const users = await Promise.all(userIds.map(uid => getDocument(COLLECTIONS.USERS, uid)));
  res.json(users.filter(Boolean));
}));

router.get('/applications', authenticate, authorize(ROLES.RECRUITER, ROLES.ADMIN), asyncHandler(async (req, res) => {
  const jobs = await queryDocuments(COLLECTIONS.JOBS, [{ field: 'postedBy', value: req.user.uid }]);
  const jobIds = jobs.map(j => j.id);
  const applications = await getAllDocuments(COLLECTIONS.APPLICATIONS);
  res.json(applications.filter(a => jobIds.includes(a.jobId)));
}));

router.patch('/applications/:id', authenticate, authorize(ROLES.RECRUITER, ROLES.ADMIN), asyncHandler(async (req, res) => {
  const { updateDocument } = await import('../../services/firestore.js');
  res.json(await updateDocument(COLLECTIONS.APPLICATIONS, req.params.id, req.body));
}));

export default router;
