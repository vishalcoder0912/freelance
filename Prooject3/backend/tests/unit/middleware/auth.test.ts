import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { ROLES } from '../../../src/config/constants.js';

vi.mock('../../../src/config/admin.js', () => ({
  adminAuth: {
    verifyIdToken: vi.fn()
  }
}));

import { authenticate, authorize, optionalAuth } from '../../../src/middleware/auth.js';
import { adminAuth } from '../../../src/config/admin.js';

function mockReq(headers: Record<string, string> = {}) {
  return { headers } as any;
}

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const next = vi.fn();

describe('authenticate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when no Authorization header', async () => {
    const req = mockReq();
    const res = mockRes();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when header does not start with Bearer', async () => {
    const req = mockReq({ authorization: 'Basic abc123' });
    const res = mockRes();

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when header is just "Bearer " with no token', async () => {
    const req = mockReq({ authorization: 'Bearer ' });
    const res = mockRes();

    (adminAuth.verifyIdToken as Mock).mockRejectedValue(new Error('no token'));

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('sets req.user and calls next on valid token', async () => {
    const req = mockReq({ authorization: 'Bearer valid-token-123' });
    const res = mockRes();

    (adminAuth.verifyIdToken as Mock).mockResolvedValue({
      uid: 'user-uid-123',
      email: 'test@example.com',
      name: 'Test User',
      role: ROLES.STUDENT
    });

    await authenticate(req, res, next);

    expect(adminAuth.verifyIdToken).toHaveBeenCalledWith('valid-token-123');
    expect(req.user).toEqual({
      uid: 'user-uid-123',
      email: 'test@example.com',
      name: 'Test User',
      role: ROLES.STUDENT
    });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('defaults role to STUDENT when not present in token', async () => {
    const req = mockReq({ authorization: 'Bearer token' });
    const res = mockRes();

    (adminAuth.verifyIdToken as Mock).mockResolvedValue({
      uid: 'uid',
      email: 'a@b.com',
      name: 'X'
    });

    await authenticate(req, res, next);

    expect(req.user.role).toBe(ROLES.STUDENT);
  });

  it('defaults name to empty string when not present in token', async () => {
    const req = mockReq({ authorization: 'Bearer token' });
    const res = mockRes();

    (adminAuth.verifyIdToken as Mock).mockResolvedValue({
      uid: 'uid',
      email: 'a@b.com'
    });

    await authenticate(req, res, next);

    expect(req.user.name).toBe('');
  });

  it('returns 401 when Firebase verification fails', async () => {
    const req = mockReq({ authorization: 'Bearer expired-token' });
    const res = mockRes();

    (adminAuth.verifyIdToken as Mock).mockRejectedValue(
      new Error('Firebase ID token has expired')
    );

    await authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });
});

describe('authorize', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when req.user is not set', () => {
    const req = { headers: {} } as any;
    const res = mockRes();
    const middleware = authorize(ROLES.ADMIN);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 403 when user role is not allowed', () => {
    const req = { user: { role: ROLES.STUDENT } } as any;
    const res = mockRes();
    const middleware = authorize(ROLES.ADMIN);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: insufficient permissions' });
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next when user role matches', () => {
    const req = { user: { role: ROLES.ADMIN } } as any;
    const res = mockRes();
    const middleware = authorize(ROLES.ADMIN);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('allows access when role matches any of multiple allowed roles', () => {
    const req = { user: { role: ROLES.MENTOR } } as any;
    const res = mockRes();
    const middleware = authorize(ROLES.ADMIN, ROLES.MENTOR, ROLES.RECRUITER);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('returns 403 when role not in multiple allowed roles', () => {
    const req = { user: { role: ROLES.STUDENT } } as any;
    const res = mockRes();
    const middleware = authorize(ROLES.ADMIN, ROLES.MENTOR);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});

describe('optionalAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls next without setting user when no Authorization header', async () => {
    const req = mockReq();
    const res = mockRes();

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('calls next without setting user when header is not Bearer', async () => {
    const req = mockReq({ authorization: 'Basic abc' });
    const res = mockRes();

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  it('sets req.user when valid token is provided', async () => {
    const req = mockReq({ authorization: 'Bearer valid-token' });
    const res = mockRes();

    (adminAuth.verifyIdToken as Mock).mockResolvedValue({
      uid: 'opt-uid',
      email: 'opt@example.com',
      role: ROLES.MENTOR
    });

    await optionalAuth(req, res, next);

    expect(req.user).toEqual({
      uid: 'opt-uid',
      email: 'opt@example.com',
      role: ROLES.MENTOR
    });
    expect(next).toHaveBeenCalled();
  });

  it('continues silently when token verification fails', async () => {
    const req = mockReq({ authorization: 'Bearer bad-token' });
    const res = mockRes();

    (adminAuth.verifyIdToken as Mock).mockRejectedValue(
      new Error('invalid token')
    );

    await optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeUndefined();
    expect(res.status).not.toHaveBeenCalled();
  });
});
