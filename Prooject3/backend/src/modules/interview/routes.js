import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { createDocument, getDocument } from '../../services/firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

const router = Router();

const QUESTIONS = {
  'AI Engineer': 'How would you deploy a deep learning model to serve real-time predictions with low latency?',
  'Product Manager': 'Tell me about a time you had to make a product decision without having complete user metrics.',
  'Data Scientist': 'Can you describe the difference between boosting and bagging algorithms?',
  'Full Stack Developer': 'Explain how server components differ from client components in terms of data fetching.',
  'DevOps Engineer': 'Describe your CI/CD pipeline design for a microservices architecture.',
  'Business Analyst': 'How would you approach requirements gathering for a new feature?'
};

router.post('/start', authenticate, asyncHandler(async (req, res) => {
  const { role } = req.body;
  const question = QUESTIONS[role] || QUESTIONS['AI Engineer'];
  const session = await createDocument(COLLECTIONS.AI_REPORTS, { userId: req.user.uid, type: 'INTERVIEW', role, status: 'IN_PROGRESS', startedAt: new Date().toISOString() });
  res.json({ sessionId: session.id, question, role });
}));

router.post('/question', authenticate, asyncHandler(async (req, res) => {
  const { role, questionIndex } = req.body;
  const roles = Object.keys(QUESTIONS);
  const selectedRole = role || roles[0];
  const question = QUESTIONS[selectedRole];
  const alternative = `Tell me about your experience with ${['system design', 'agile methodologies', 'data pipelines', 'REST APIs', 'cloud infrastructure', 'team leadership'][questionIndex || 0]}.`;
  res.json({ question: `${question} Also, ${alternative}` });
}));

router.post('/evaluate', authenticate, asyncHandler(async (req, res) => {
  const { sessionId, question, answer } = req.body;
  const wordCount = (answer || '').split(/\s+/).filter(Boolean).length;
  const score = Math.min(95, Math.max(50, Math.round(50 + wordCount * 0.5 + Math.random() * 20)));
  const evaluation = {
    score, strengths: ['Clear communication', 'Structured approach', `Mentioned ${wordCount > 50 ? 'specific technologies' : 'relevant concepts'}`],
    gaps: wordCount < 30 ? ['Response too brief', 'Missing specific examples'] : ['Could include more metrics', 'Consider STAR format'],
    idealResponse: 'An ideal response highlights specific technologies, quantifies impact with metrics, and follows a clear structure.'
  };
  res.json(evaluation);
}));

router.get('/report/:id', authenticate, asyncHandler(async (req, res) => {
  const report = await getDocument(COLLECTIONS.AI_REPORTS, req.params.id);
  if (!report) return res.status(404).json({ error: 'Report not found' });
  res.json(report);
}));

export default router;
