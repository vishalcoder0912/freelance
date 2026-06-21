import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { createDocument, getDocument } from '../../services/firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

const router = Router();

router.post('/upload-resume', authenticate, asyncHandler(async (req, res) => {
  const { resumeUrl, fileType } = req.body;
  const data = await createDocument(COLLECTIONS.AI_REPORTS, { userId: req.user.uid, type: 'CAREER_ANALYSIS_UPLOAD', resumeUrl, fileType, createdAt: new Date().toISOString() });
  res.json({ id: data.id, message: 'Resume uploaded successfully' });
}));

router.post('/analyze', authenticate, asyncHandler(async (req, res) => {
  const { resumeId, targetRole } = req.body;
  const report = {
    careerPath: ['Software Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'],
    matchScore: Math.floor(Math.random() * 30) + 65,
    recommendedPrograms: ['Full Stack Development', 'Cloud Architecture', 'Leadership Programs'],
    salaryRange: '₹8-15 LPA',
    growthPotential: 'High - 40% YoY growth in tech sector',
    skillGaps: ['Advanced React', 'Node.js', 'AWS', 'Leadership'],
    nextSteps: ['Complete React Advanced Course', 'Build Portfolio Project', 'Join Tech Community'],
    role: targetRole || 'General',
    recommendations: [
      'Focus on full-stack development skills',
      'Build a strong portfolio of real-world projects',
      'Network with industry professionals',
      'Consider cloud certification'
    ]
  };
  await createDocument(COLLECTIONS.AI_REPORTS, { userId: req.user.uid, type: 'CAREER_ANALYSIS', report, createdAt: new Date().toISOString() });
  res.json(report);
}));

router.get('/report/:id', authenticate, asyncHandler(async (req, res) => {
  const report = await getDocument(COLLECTIONS.AI_REPORTS, req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
}));

export default router;