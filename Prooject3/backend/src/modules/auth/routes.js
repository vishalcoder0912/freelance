import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { adminAuth } from '../../config/admin.js';
import { createDocument, getDocument, updateDocument } from '../../services/firestore.js';
import { COLLECTIONS } from '../../config/constants.js';

const router = Router();

// POST /api/auth/register
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password, name, role = 'STUDENT', careerGoal, currentExperience, phone } = req.body;
  const userRecord = await adminAuth.createUser({ email, password, displayName: name });
  await adminAuth.setCustomUserClaims(userRecord.uid, { role });
  const user = await createDocument(COLLECTIONS.USERS, {
    uid: userRecord.uid, name, email, role, careerGoal, currentExperience, phone,
    createdAt: new Date().toISOString()
  });
  res.status(201).json({ user, uid: userRecord.uid });
}));

// POST /api/auth/login
router.post('/login', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userRecord = await adminAuth.getUserByEmail(email);
  res.json({ uid: userRecord.uid, email: userRecord.email, name: userRecord.displayName });
}));

// POST /api/auth/google
router.post('/google', asyncHandler(async (req, res) => {
  const { idToken, name, email } = req.body;
  const decoded = await adminAuth.verifyIdToken(idToken);
  let user = await getDocument(COLLECTIONS.USERS, decoded.uid);
  if (!user) {
    user = await createDocument(COLLECTIONS.USERS, { uid: decoded.uid, name, email, role: 'STUDENT' });
  }
  res.json({ user, token: idToken });
}));

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body;
  const link = await adminAuth.generatePasswordResetLink(email);
  res.json({ message: 'Password reset email sent', link });
}));

// POST /api/auth/reset-password
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { oobCode, newPassword } = req.body;
  await adminAuth.updateUser(oobCode, { password: newPassword });
  res.json({ message: 'Password reset successfully' });
}));

// POST /api/auth/send-otp
router.post('/send-otp', asyncHandler(async (req, res) => {
  const { phone } = req.body;
  // In production, integrate with Twilio or Firebase Phone Auth
  res.json({ message: 'OTP sent', otp: '123456' });
}));

// POST /api/auth/verify-otp
router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { phone, otp } = req.body;
  if (otp === '123456') {
    return res.json({ verified: true, message: 'OTP verified' });
  }
  res.status(400).json({ verified: false, message: 'Invalid OTP' });
}));

// GET /api/auth/me
router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await getDocument(COLLECTIONS.USERS, req.user.uid);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}));

// PATCH /api/auth/profile
router.patch('/profile', authenticate, asyncHandler(async (req, res) => {
  const { name, phone, careerGoal, currentExperience, bio, skills } = req.body;
  const user = await updateDocument(COLLECTIONS.USERS, req.user.uid, { name, phone, careerGoal, currentExperience, bio, skills });
  if (name) await adminAuth.updateUser(req.user.uid, { displayName: name });
  res.json(user);
}));

export default router;
