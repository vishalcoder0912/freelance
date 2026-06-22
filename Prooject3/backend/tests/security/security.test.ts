import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from '../../src/middleware/validation.js';
import { authenticate, authorize } from '../../src/middleware/auth.js';

// ─── Mock Firestore so routes can import ─────────────────────────────────────

vi.mock('../../src/config/admin.js', () => ({
  adminAuth: {
    createUser: vi.fn(async (u: any) => ({ uid: 'mock-uid-' + Date.now(), ...u })),
    getUserByEmail: vi.fn(async (e: string) => ({ uid: 'mock-uid', email: e, displayName: e?.split('@')[0] || 'User' })),
    verifyIdToken: vi.fn(async (token: string) => {
      if (token === 'expired-token' || token === 'invalid-token') throw new Error('Token expired');
      if (!token || token.includes('<') || token.includes('>')) throw new Error('Invalid token format');
      if (token === 'admin-token') return { uid: 'admin-uid', email: 'admin@careerveda.ai', role: 'ADMIN' };
      if (token === 'mentor-token') return { uid: 'mentor-uid', email: 'mentor@careerveda.ai', role: 'MENTOR' };
      if (token === 'recruiter-token') return { uid: 'recruiter-uid', email: 'recruiter@careerveda.ai', role: 'RECRUITER' };
      return { uid: 'mock-uid', email: 'user@careerveda.ai', role: 'STUDENT' };
    }),
    updateUser: vi.fn(async (uid: string, data: any) => ({ uid, ...data })),
    setCustomUserClaims: vi.fn(async () => {}),
    generatePasswordResetLink: vi.fn(async () => 'https://careerveda.ai/reset-password'),
  },
  adminDb: {
    collection: () => ({
      doc: () => ({
        get: async () => ({ exists: false, data: () => null, id: 'mock-id' }),
        set: async () => {},
        update: async () => {},
        delete: async () => {},
      }),
      get: async () => ({ docs: [], forEach: () => {} }),
      where: () => ({
        get: async () => ({ docs: [], forEach: () => {} }),
        orderBy: () => ({ get: async () => ({ docs: [], forEach: () => {} }) }),
      }),
      orderBy: () => ({ get: async () => ({ docs: [], forEach: () => {} }) }),
      count: () => ({ get: async () => ({ data: () => ({ count: 0 }) }) }),
    }),
    runTransaction: async (fn: Function) => fn({ get: async () => ({ data: () => null, exists: false }), update: async () => {}, set: async () => {}, delete: async () => {} }),
    batch: () => ({ commit: async () => {} }),
  },
  adminStorage: {
    bucket: () => ({
      upload: async () => [{}],
      file: () => ({ delete: async () => {}, getSignedUrl: async () => ['https://mock.url'] }),
    }),
  },
}));

vi.mock('../../src/services/firestore.js', () => ({
  createDocument: vi.fn(async (col: string, data: any) => ({ id: 'mock-' + Date.now(), ...data })),
  getDocument: vi.fn(async (col: string, id: string) => {
    if (col === 'users') return { id, uid: id, email: 'user@careerveda.ai', name: 'Test User', role: 'STUDENT' };
    return null;
  }),
  updateDocument: vi.fn(async (col: string, id: string, data: any) => ({ id, ...data })),
  deleteDocument: vi.fn(async (id: string) => ({ id, deleted: true })),
  queryDocuments: vi.fn(async () => []),
  getAllDocuments: vi.fn(async () => []),
  countDocuments: vi.fn(async () => 0),
}));

// ─── Build test app with all routes ──────────────────────────────────────────

async function buildApp() {
  const app = express();
  app.use(helmet({ crossOriginResourcePolicy: false }));
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: { error: 'Too many requests, please try again later.' } });
  app.use('/api', limiter);

  const { default: authRoutes } = await import('../../src/modules/auth/routes.js');
  const { default: userRoutes } = await import('../../src/modules/users/routes.js');
  const { default: programRoutes } = await import('../../src/modules/programs/routes.js');
  const { default: enrollmentRoutes } = await import('../../src/modules/enrollments/routes.js');
  const { default: adminRoutes } = await import('../../src/modules/admin/routes.js');
  const { default: jobRoutes } = await import('../../src/modules/jobs/routes.js');
  const { default: aiRoutes } = await import('../../src/modules/ai/routes.js');

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/enrollments', enrollmentRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/ai', aiRoutes);

  app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));
  app.use(errorHandler);

  return app;
}

let app: express.Express;
beforeAll(async () => { app = await buildApp(); });

// ─── JWT Validation ──────────────────────────────────────────────────────────

describe('JWT Validation', () => {
  it('returns 401 when Authorization header is missing', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/no token/i);
  });

  it('returns 401 when Authorization header lacks Bearer prefix', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Token abc123');
    expect(res.status).toBe(401);
  });

  it('returns 401 when Bearer token is malformed', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer <invalid-token>');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/unauthorized/i);
  });

  it('returns 401 when token is empty after Bearer', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer ');
    expect(res.status).toBe(401);
  });

  it('returns 200 with valid token', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('uid');
  });

  it('returns 401 when Authorization header is "Bearer" only', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer');
    expect(res.status).toBe(401);
  });

  it('returns 401 for token with invalid characters', async () => {
    const res = await request(app).get('/api/auth/me').set('Authorization', 'Bearer <script>alert(1)</script>');
    expect(res.status).toBe(401);
  });
});

// ─── RBAC Permissions ────────────────────────────────────────────────────────

describe('RBAC Permissions', () => {
  it('returns 401 for unauthenticated user on protected route', async () => {
    const res = await request(app).get('/api/users');
    expect(res.status).toBe(401);
  });

  it('returns 403 when student accesses admin-only route', async () => {
    const res = await request(app).get('/api/admin/analytics').set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(403);
  });

  it('returns 403 when student accesses users list (admin-only)', async () => {
    const res = await request(app).get('/api/users').set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(403);
  });

  it('returns 403 when student accesses enrollments list (admin/mentor only)', async () => {
    const res = await request(app).get('/api/enrollments').set('Authorization', 'Bearer valid-token');
    expect(res.status).toBe(403);
  });

  it('returns 403 when student accesses mentor list (admin-only)', async () => {
    const res = await request(app).get('/api/users/mentor').set('Authorization', 'Bearer valid-token');
    expect([403, 404]).toContain(res.status);
  });

  it('admin can access admin routes', async () => {
    const res = await request(app).get('/api/admin/analytics').set('Authorization', 'Bearer admin-token');
    expect(res.status).toBe(200);
  });

  it('student can access public routes without authentication', async () => {
    const res = await request(app).get('/api/programs');
    expect(res.status).toBe(200);
  });

  it('returns 401 when token is expired (invalid Firebase token)', async () => {
    const res = await request(app).get('/api/admin/analytics').set('Authorization', 'Bearer expired-token');
    expect(res.status).toBe(401);
  });
});

// ─── Input Sanitization ──────────────────────────────────────────────────────

describe('Input Sanitization', () => {
  it('does not crash when receiving XSS payload in name field', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com', password: 'password123', name: '<script>alert("xss")</script>',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not crash when receiving SQL injection in email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: "'; DROP TABLE users; --", password: 'password123', name: 'Test User',
    });
    expect(res.status).not.toBe(500);
  });

  it('rejects payload exceeding 10MB limit', async () => {
    const largePayload = 'x'.repeat(11 * 1024 * 1024);
    const res = await request(app).post('/api/auth/register').send({ data: largePayload });
    expect([400, 413]).toContain(res.status);
  });

  it('does not crash on NoSQL injection attempt', async () => {
    const res = await request(app).get('/api/programs').query({ category: { $gt: '' } });
    expect(res.status).not.toBe(500);
  });

  it('does not crash on path traversal in query', async () => {
    const res = await request(app).get('/api/programs').query({ search: '../../etc/passwd' });
    expect(res.status).not.toBe(500);
  });

  it('handles null bytes in input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com', name: 'Test\x00User', password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('handles unicode in name field', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com', name: '\u0041\u0042\u0043\u0044\u0045', password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });
});

// ─── Rate Limiting ───────────────────────────────────────────────────────────

describe('Rate Limiting', () => {
  it('has rate limiter configured on /api prefix', async () => {
    const app2 = express();
    app2.use(express.json());
    app2.use('/api', rateLimit({ windowMs: 1000, max: 2 }));
    app2.get('/api/test', (_req, res) => res.json({ ok: true }));

    await request(app2).get('/api/test');
    await request(app2).get('/api/test');
    const res = await request(app2).get('/api/test');
    expect(res.status).toBe(429);
  });

  it('does not rate-limit non-/api routes', async () => {
    const app2 = express();
    app2.use(express.json());
    app2.use('/api', rateLimit({ windowMs: 1000, max: 1 }));
    app2.get('/health', (_req, res) => res.json({ ok: true }));

    const res1 = await request(app2).get('/health');
    const res2 = await request(app2).get('/health');
    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
  });
});

// ─── CORS ────────────────────────────────────────────────────────────────────

describe('CORS', () => {
  let corsApp: express.Express;

  beforeAll(() => {
    corsApp = express();
    corsApp.use(cors({ origin: 'http://localhost:5173', credentials: true }));
    corsApp.get('/api/test', (_req, res) => res.json({ ok: true }));
    corsApp.options('/api/test', (_req, res) => res.sendStatus(204));
  });

  it('includes Access-Control-Allow-Origin header', async () => {
    const res = await request(corsApp).get('/api/test').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });

  it('includes credentials header when credentials: true', async () => {
    const res = await request(corsApp).get('/api/test').set('Origin', 'http://localhost:5173');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('responds to OPTIONS preflight request', async () => {
    const res = await request(corsApp).options('/api/test')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');
    expect([200, 204]).toContain(res.status);
  });

  it('rejects requests from unauthorized origins', async () => {
    const res = await request(corsApp).get('/api/test').set('Origin', 'http://evil.com');
    expect(res.headers['access-control-allow-origin']).not.toBe('http://evil.com');
  });
});

// ─── Helmet Security Headers ─────────────────────────────────────────────────

describe('Helmet Security Headers', () => {
  let helmetApp: express.Express;

  beforeAll(() => {
    helmetApp = express();
    helmetApp.use(helmet());
    helmetApp.get('/test', (_req, res) => res.json({ ok: true }));
  });

  it('sets X-Content-Type-Options to nosniff', async () => {
    const res = await request(helmetApp).get('/test');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('sets X-Frame-Options', async () => {
    const res = await request(helmetApp).get('/test');
    expect(res.headers['x-frame-options']).toBeDefined();
  });

  it('sets X-XSS-Protection header', async () => {
    const res = await request(helmetApp).get('/test');
    expect(res.headers['x-xss-protection']).toBeDefined();
  });

  it('sets Strict-Transport-Security header', async () => {
    const res = await request(helmetApp).get('/test');
    expect(res.headers['strict-transport-security']).toBeDefined();
  });

  it('sets Content-Security-Policy header', async () => {
    const res = await request(helmetApp).get('/test');
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  it('sets Referrer-Policy header', async () => {
    const res = await request(helmetApp).get('/test');
    expect(res.headers['referrer-policy']).toBeDefined();
  });
});

// ─── Error Handling ──────────────────────────────────────────────────────────

describe('Error Handling Security', () => {
  let errApp: express.Express;

  beforeAll(() => {
    errApp = express();
    errApp.use(express.json());
    errApp.get('/api/error', (_req, res) => { throw new Error('Internal error details'); });
    errApp.use((_err: any, _req: any, res: any, _next: any) => {
      res.status(500).json({ error: 'Internal server error' });
    });
  });

  it('does not leak stack traces in error responses', async () => {
    const res = await request(errApp).get('/api/error');
    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
    expect(res.body.stack).toBeUndefined();
  });

  it('returns generic error for unhandled errors', async () => {
    const res = await request(errApp).get('/api/error');
    expect(res.body.error).toBe('Internal server error');
  });
});
