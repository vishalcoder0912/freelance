import crypto from 'crypto';

export function verifyRazorpaySignature(orderId, paymentId, signature) {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock_secret')
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

export function generateOrderReceipt(userId, programId) {
  return `order_${userId}_${programId}_${Date.now()}`;
}
