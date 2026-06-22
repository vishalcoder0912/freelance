import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, authorize } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/validation.js';
import razorpay from '../../config/razorpay.js';
import { verifyRazorpaySignature, generateOrderReceipt } from '../../utils/paymentHelpers.js';

const router = Router();
const prisma = new PrismaClient();

router.post('/create-order', authenticate, asyncHandler(async (req, res) => {
  const { amount, programId, currency = 'INR' } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  if (!programId) {
    return res.status(400).json({ error: 'Program ID is required' });
  }

  const program = await prisma.program.findUnique({ where: { id: programId } });
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency,
    receipt: generateOrderReceipt(req.user.uid, programId),
    notes: { userId: req.user.uid, programId },
  });

  const payment = await prisma.payment.create({
    data: {
      userId: req.user.uid,
      amount,
      currency,
      status: 'PENDING',
      razorpayOrderId: razorpayOrder.id,
      metadata: { programId, razorpayOrder },
    },
  });

  res.json({
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    paymentRecordId: payment.id,
    key: process.env.RAZORPAY_KEY_ID,
  });
}));

router.post('/verify', authenticate, asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature, paymentRecordId } = req.body;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ error: 'Missing payment verification parameters' });
  }

  const isValid = verifyRazorpaySignature(orderId, paymentId, signature);
  if (!isValid) {
    return res.status(400).json({ error: 'Invalid payment signature' });
  }

  const payment = paymentRecordId
    ? await prisma.payment.findUnique({ where: { id: paymentRecordId } })
    : await prisma.payment.findFirst({ where: { razorpayOrderId: orderId } });

  if (!payment) {
    return res.status(404).json({ error: 'Payment record not found' });
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'COMPLETED',
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
    },
  });

  const metadata = payment.metadata;
  if (metadata?.programId) {
    await prisma.enrollment.upsert({
      where: { userId_programId: { userId: payment.userId, programId: metadata.programId } },
      update: { status: 'ACTIVE' },
      create: { userId: payment.userId, programId: metadata.programId, status: 'ACTIVE' },
    });
  }

  res.json({ verified: true, payment: updatedPayment });
}));

router.get('/history', authenticate, asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { userId: req.user.uid },
    orderBy: { createdAt: 'desc' },
  });
  res.json(payments);
}));

router.get('/invoices', authenticate, asyncHandler(async (req, res) => {
  const payments = await prisma.payment.findMany({
    where: { userId: req.user.uid, status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
  });
  res.json(payments);
}));

router.get('/:id', authenticate, asyncHandler(async (req, res) => {
  const payment = await prisma.payment.findUnique({ where: { id: req.params.id } });
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  if (payment.userId !== req.user.uid && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(payment);
}));

router.post('/refund', authenticate, authorize('ADMIN'), asyncHandler(async (req, res) => {
  const { paymentId, amount, reason } = req.body;

  const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
  if (!payment) {
    return res.status(404).json({ error: 'Payment not found' });
  }
  if (payment.status !== 'COMPLETED') {
    return res.status(400).json({ error: 'Can only refund completed payments' });
  }

  const refundAmount = amount || Number(payment.amount);

  const razorpayRefund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    amount: Math.round(refundAmount * 100),
    notes: { reason: reason || 'Refund requested' },
  });

  const isPartial = refundAmount < Number(payment.amount);
  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: isPartial ? 'PARTIAL_REFUND' : 'REFUNDED',
      refundId: razorpayRefund.id,
      refundAmount,
      refundReason: reason,
    },
  });

  res.json({ refund: updatedPayment, razorpayRefund });
}));

export default router;
