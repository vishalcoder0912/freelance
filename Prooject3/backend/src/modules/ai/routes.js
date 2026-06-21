import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { createDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

const router = Router();

router.post('/chat', authenticate, asyncHandler(async (req, res) => {
  const { message, context } = req.body;
  const response = simulateAIResponse(message, context);
  await createDocument(COLLECTIONS.AI_REPORTS, { userId: req.user.uid, type: 'CHAT', query: message, response, createdAt: new Date().toISOString() });
  res.json({ response });
}));

router.post('/generate-roadmap', authenticate, asyncHandler(async (req, res) => {
  const { targetRole, currentLevel } = req.body;
  const roadmap = generateRoadmap(targetRole, currentLevel);
  res.json({ roadmap });
}));

router.post('/course-recommendation', authenticate, asyncHandler(async (req, res) => {
  const { skills, targetRole } = req.body;
  const programs = await queryDocuments(COLLECTIONS.PROGRAMS);
  const recommendations = programs.filter(p => {
    const pSkills = p.skills || [];
    return pSkills.some(s => skills?.some(us => s.toLowerCase().includes(us.toLowerCase()))) || p.title.toLowerCase().includes(targetRole?.toLowerCase() || '');
  });
  res.json({ recommendations });
}));

router.post('/skill-gap-analysis', authenticate, asyncHandler(async (req, res) => {
  const { currentSkills, targetRole } = req.body;
  const roleSkills = getRoleSkills(targetRole);
  const gaps = roleSkills.filter(s => !currentSkills?.some(cs => cs.toLowerCase().includes(s.toLowerCase())));
  const matchScore = Math.round(((roleSkills.length - gaps.length) / roleSkills.length) * 100);
  res.json({ matchScore, gaps, totalSkills: roleSkills.length, currentSkills: currentSkills || [] });
}));

router.post('/career-guidance', authenticate, asyncHandler(async (req, res) => {
  const { question } = req.body;
  const guidance = getCareerGuidance(question);
  res.json({ guidance });
}));

function simulateAIResponse(message, context) {
  const lower = message.toLowerCase();
  if (lower.includes('resume') || lower.includes('ats')) return 'Your resume currently scores 84%. Adding verified GCP deployments and LLM APIs will push it past 90%.';
  if (lower.includes('roadmap') || lower.includes('schedule')) return 'Your active AI roadmap is set to 12 Months. Completing Deep Learning next will trigger interview slots with top recruiters.';
  if (lower.includes('interview') || lower.includes('dsa')) return 'Focus on system design patterns (distributed caching, Redis) and mock DSA drills to boost your Interview Score.';
  if (lower.includes('salary') || lower.includes('package')) return 'AI Engineers on our platform see an average starting package of ₹24.7 LPA. MLOps expertise yields the highest progression.';
  if (lower.includes('project')) return 'Building a multi-agent recommendation chatbot or resume evaluation engine showcases hands-on capability to hiring partners.';
  return 'I can analyze that for you. Complete the current assessment module to unlock tailored recommendations.';
}

function generateRoadmap(targetRole, currentLevel) {
  const levels = { beginner: ['Core Foundations', 'Framework Basics', 'Intermediate Concepts', 'Advanced Topics', 'Deployment', 'Portfolio'], intermediate: ['Advanced Concepts', 'System Design', 'Integration', 'Performance', 'Deployment', 'Portfolio'], advanced: ['Architecture', 'Optimization', 'Leadership', 'Innovation', 'Mentoring', 'Capstone'] };
  const steps = levels[currentLevel?.toLowerCase()] || levels.beginner;
  return steps.map((topic, i) => ({ month: `Month ${i + 1}`, topic, duration: `${4 + i} weeks` }));
}

function getRoleSkills(targetRole) {
  const skills = { 'ai engineer': ['Python', 'Machine Learning', 'Deep Learning', 'LLMs', 'MLOps', 'PyTorch'], 'data scientist': ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Deep Learning', 'Data Visualization'], 'product manager': ['Product Strategy', 'User Research', 'Agile', 'A/B Testing', 'Analytics', 'Roadmapping'], 'full stack developer': ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'], 'data analyst': ['Python', 'SQL', 'Tableau', 'Excel', 'Statistics', 'Power BI'] };
  return skills[targetRole?.toLowerCase()] || ['Python', 'SQL', 'Communication', 'Problem Solving'];
}

function getCareerGuidance(question) {
  const lower = question.toLowerCase();
  if (lower.includes('switch') || lower.includes('pivot') || lower.includes('transition')) return 'Start with a free Career Analysis to identify your transferable skills and skill gaps. Our AI will generate a personalized 6-month roadmap.';
  if (lower.includes('promotion') || lower.includes('growth')) return 'Focus on building leadership skills and a strong project portfolio. Consider mentorship sessions with industry experts.';
  if (lower.includes('which') || lower.includes('best') || lower.includes('choose')) return 'Take our Career DNA assessment to discover which roles match your current skills and interests best.';
  return 'Explore our career paths and programs to find the right fit for your goals. Each path shows salary ranges, skills needed, and hiring companies.';
}

export default router;
