import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { queryDocuments, getDocument } from '../../services/firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

const router = Router();

router.get('/overview', authenticate, asyncHandler(async (req, res) => {
  const enrollments = await queryDocuments(COLLECTIONS.ENROLLMENTS, [{ field: 'userId', value: req.user.uid }]);
  const assignments = await queryDocuments(COLLECTIONS.ASSIGNMENTS, [{ field: 'userId', value: req.user.uid }]);
  const projects = await queryDocuments(COLLECTIONS.PROJECTS, [{ field: 'userId', value: req.user.uid }]);
  const certificates = await queryDocuments(COLLECTIONS.CERTIFICATES, [{ field: 'userId', value: req.user.uid }]);
  const applications = await queryDocuments(COLLECTIONS.APPLICATIONS, [{ field: 'userId', value: req.user.uid }]);
  res.json({
    totalEnrollments: enrollments.length, activeEnrollments: enrollments.filter(e => e.status === 'ACTIVE').length,
    pendingAssignments: assignments.filter(a => a.status !== 'SUBMITTED').length,
    completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
    totalCertificates: certificates.length, activeApplications: applications.filter(a => a.status !== 'REJECTED').length,
    upcomingInterviews: applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length
  });
}));

router.get('/progress', authenticate, asyncHandler(async (req, res) => {
  const enrollments = await queryDocuments(COLLECTIONS.ENROLLMENTS, [{ field: 'userId', value: req.user.uid }, { field: 'status', value: 'ACTIVE' }]);
  const progress = await Promise.all(enrollments.map(async (e) => {
    const program = await getDocument(COLLECTIONS.PROGRAMS, e.programId);
    return { programId: e.programId, programName: program?.title, progress: e.progress || 0, status: e.status };
  }));
  res.json(progress);
}));

router.get('/upcoming', authenticate, asyncHandler(async (req, res) => {
  const now = new Date().toISOString();
  const sessions = await queryDocuments(COLLECTIONS.MENTORSHIP_SESSIONS, [{ field: 'studentId', value: req.user.uid }]);
  const upcoming = sessions.filter(s => s.scheduledAt > now).sort((a, b) => a.scheduledAt > b.scheduledAt ? 1 : -1).slice(0, 5);
  res.json(upcoming);
}));

router.get('/certificates', authenticate, asyncHandler(async (req, res) => {
  res.json(await queryDocuments(COLLECTIONS.CERTIFICATES, [{ field: 'userId', value: req.user.uid }]));
}));

router.get('/projects', authenticate, asyncHandler(async (req, res) => {
  res.json(await queryDocuments(COLLECTIONS.PROJECTS, [{ field: 'userId', value: req.user.uid }]));
}));

router.get('/placements', authenticate, asyncHandler(async (req, res) => {
  const applications = await queryDocuments(COLLECTIONS.APPLICATIONS, [{ field: 'userId', value: req.user.uid }]);
  const placements = await queryDocuments(COLLECTIONS.PLACEMENTS, [{ field: 'userId', value: req.user.uid }]);
  res.json({ applications, placements });
}));

export default router;
