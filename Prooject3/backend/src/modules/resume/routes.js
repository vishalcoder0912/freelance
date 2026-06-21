import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { createDocument, getDocument } from '../../services/firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

const router = Router();

router.get('/upload-resume', authenticate, asyncHandler(async (req, res) => {
  res.json({ message: 'Upload resume via POST with multipart/form-data' });
}));

router.post('/upload-resume', authenticate, asyncHandler(async (req, res) => {
  const { resumeUrl, fileType } = req.body;
  const data = await createDocument(COLLECTIONS.AI_REPORTS, { userId: req.user.uid, type: 'RESUME_UPLOAD', resumeUrl, fileType, createdAt: new Date().toISOString() });
  res.json({ id: data.id, message: 'Resume uploaded successfully' });
}));

router.post('/analyze', authenticate, asyncHandler(async (req, res) => {
  const { resumeId, targetRole } = req.body;
  const report = {
    atsScore: Math.floor(Math.random() * 30) + 60,
    keywordMatch: Math.floor(Math.random() * 30) + 60,
    formattingScore: Math.floor(Math.random() * 20) + 75,
    missingKeywords: ['PyTorch', 'Kubernetes', 'MLOps', 'Redis'],
    strengths: ['Strong React experience', 'Good project portfolio', 'Clear career progression'],
    improvements: ['Add quantifiable metrics', 'Include cloud certifications', 'Optimize for ATS parsing'],
    roleMatch: Math.floor(Math.random() * 20) + 75,
    role: targetRole || 'General',
    suggestions: [
      'Add specific technologies mentioned in job descriptions',
      'Use action verbs and quantify achievements',
      'Include links to GitHub, portfolio, and LinkedIn'
    ]
  };
  await createDocument(COLLECTIONS.AI_REPORTS, { userId: req.user.uid, type: 'RESUME_ANALYSIS', report, createdAt: new Date().toISOString() });
  res.json(report);
}));

router.get('/report/:id', authenticate, asyncHandler(async (req, res) => {
  const report = await getDocument(COLLECTIONS.AI_REPORTS, req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
}));

export default router;
