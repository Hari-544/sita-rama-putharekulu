import fs from 'fs/promises';
import crypto from 'crypto';

const BASE = process.env.API_BASE || 'http://localhost:5000';

async function loadSecret() {
  // Prefer environment variable
  if (process.env.RAZORPAY_KEY_SECRET) return process.env.RAZORPAY_KEY_SECRET;

  // Try backend .env file
  try {
    const env = await fs.readFile(new URL('./.env', import.meta.url));
    const match = env.toString().match(/^RAZORPAY_KEY_SECRET=(.+)$/m);
    if (match) return match[1].trim();
  } catch (e) {
    // ignore
  }

  return null;
}

async function run() {
  console.log('Testing backend at', BASE);

  // Test root
  try {
    const res = await fetch(`${BASE}/`);
    const text = await res.text();
    console.log('/ ->', res.status, text.trim());
  } catch (e) {
    console.error('/ -> ERROR', e.message);
  }

  // Test create-order
  let orderId = null;
  try {
    const res = await fetch(`${BASE}/api/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10 }),
    });
    const body = await res.json();
    console.log('/api/payment/create-order ->', res.status, JSON.stringify(body));
    orderId = body.id || body.order_id || null;
  } catch (e) {
    console.error('/api/payment/create-order -> ERROR', e.message);
  }

  // Test verify with generated signature if secret available
  try {
    const secret = await loadSecret();
    if (!secret) {
      console.warn('RAZORPAY_KEY_SECRET not found; skipping valid signature verify test.');
      // fallback: send invalid signature
      const res = await fetch(`${BASE}/api/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: orderId || 'test_order',
          razorpay_payment_id: 'test_payment',
          razorpay_signature: 'invalid_signature',
        }),
      });
      const body = await res.text();
      console.log('/api/payment/verify ->', res.status, body);
    } else {
      const paymentId = 'fake_payment_123';
      const targetOrder = orderId || 'test_order';
      const generated = crypto.createHmac('sha256', secret).update(`${targetOrder}|${paymentId}`).digest('hex');

      const res = await fetch(`${BASE}/api/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: targetOrder,
          razorpay_payment_id: paymentId,
          razorpay_signature: generated,
        }),
      });
      const body = await res.text();
      console.log('/api/payment/verify ->', res.status, body);
    }
  } catch (e) {
    console.error('/api/payment/verify -> ERROR', e.message);
  }
}

// Run and allow Node to exit naturally to avoid Windows libuv assertion on forced exit
run().catch((e) => {
  console.error('Test script failed:', e);
});
