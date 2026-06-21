import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import { getAllDocuments, getDocument, createDocument, queryDocuments } from '../../services/firestore.js';
import { COLLECTIONS, ROLES } from '../../config/constants.js';

const router = Router();

router.post('/create-order', authenticate, asyncHandler(async (req, res) => {
  const { amount, programId, currency = 'INR' } = req.body;
  const order = await createDocument(COLLECTIONS.PAYMENTS, { userId: req.user.uid, amount, programId, currency, status: 'PENDING', createdAt: new Date().toISOString() });
  res.json({ orderId: order.id, amount, currency, key: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock' });
}));

router.post('/verify', authenticate, asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;
  const { updateDocument } = await import('../../services/firestore.js');
  const payment = await updateDocument(COLLECTIONS.PAYMENTS, orderId, { paymentId, signature, status: 'COMPLETED', completedAt: new Date().toISOString() });
  res.json({ verified: true, payment });
}));

router.get('/history', authenticate, asyncHandler(async (req, res) => {
  res.json(await queryDocuments(COLLECTIONS.PAYMENTS, [{ field: 'userId', value: req.user.uid }]));
}));

router.get('/invoices', authenticate, asyncHandler(async (req, res) => {
  const payments = await queryDocuments(COLLECTIONS.PAYMENTS, [{ field: 'userId', value: req.user.uid }, { field: 'status', value: 'COMPLETED' }]);
  res.json(payments);
}));

export default router;
