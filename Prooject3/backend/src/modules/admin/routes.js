import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, countDocuments, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.get('/analytics', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const totalUsers = await countDocuments(COLLECTIONS.USERS);
  const totalStudents = await countDocuments(COLLECTIONS.USERS, [{ field: 'role', value: 'STUDENT' }]);
  const totalPrograms = await countDocuments(COLLECTIONS.PROGRAMS);
  const totalEnrollments = await countDocuments(COLLECTIONS.ENROLLMENTS);
  const activeEnrollments = await countDocuments(COLLECTIONS.ENROLLMENTS, [{ field: 'status', value: 'ACTIVE' }]);
  const totalPlacements = await countDocuments(COLLECTIONS.PLACEMENTS);
  const applicants = await countDocuments(COLLECTIONS.APPLICATIONS);
  res.json({ totalUsers, totalStudents, totalPrograms, totalEnrollments: totalEnrollments + activeEnrollments, activeEnrollments, totalPlacements, totalApplicants: applicants });
}));

router.get('/users', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const { role, limit = 50 } = req.query;
  const filters = role ? [{ field: 'role', value: role }] : [];
  res.json(await queryDocuments(COLLECTIONS.USERS, filters, { field: 'createdAt', direction: 'desc' }, parseInt(limit)));
}));

router.get('/revenue', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const payments = await queryDocuments(COLLECTIONS.PAYMENTS, [{ field: 'status', value: 'COMPLETED' }]);
  const totalRevenue = payments.reduce((sum, p) => sum + (parseInt(p.amount) || 0), 0);
  const byMonth = {};
  payments.forEach(p => {
    const month = new Date(p.completedAt || p.createdAt).toISOString().slice(0, 7);
    byMonth[month] = (byMonth[month] || 0) + (parseInt(p.amount) || 0);
  });
  res.json({ totalRevenue, totalTransactions: payments.length, byMonth });
}));

router.get('/enrollments', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const enrollments = await getAllDocuments(COLLECTIONS.ENROLLMENTS);
  const byProgram = {};
  const byMonth = {};
  enrollments.forEach(e => {
    byProgram[e.programId] = (byProgram[e.programId] || 0) + 1;
    const month = new Date(e.createdAt).toISOString().slice(0, 7);
    byMonth[month] = (byMonth[month] || 0) + 1;
  });
  res.json({ total: enrollments.length, byProgram, byMonth });
}));

router.get('/placements', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const placements = await getAllDocuments(COLLECTIONS.PLACEMENTS);
  const byCompany = {};
  const byMonth = {};
  placements.forEach(p => {
    byCompany[p.company] = (byCompany[p.company] || 0) + 1;
    const month = new Date(p.createdAt).toISOString().slice(0, 7);
    byMonth[month] = (byMonth[month] || 0) + 1;
  });
  const avgPackage = placements.length > 0 ? placements.reduce((sum, p) => sum + (parseInt(p.package) || 0), 0) / placements.length : 0;
  res.json({ total: placements.length, averagePackage: Math.round(avgPackage / 100000) + ' LPA', byCompany, byMonth });
}));

router.get('/programs', authenticate, authorize(ROLES.ADMIN), asyncHandler(async (req, res) => {
  const programs = await getAllDocuments(COLLECTIONS.PROGRAMS);
  const programsWithEnrollments = await Promise.all(programs.map(async (p) => ({
    ...p, enrollmentCount: await countDocuments(COLLECTIONS.ENROLLMENTS, [{ field: 'programId', value: p.id }])
  })));
  res.json(programsWithEnrollments);
}));

export default router;
