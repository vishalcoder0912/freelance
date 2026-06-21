import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authenticate, authorize, optionalAuth } from '../../src/middleware/auth.js';
import { errorHandler, asyncHandler, validate } from '../../src/middleware/validation.js';

describe('Auth Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null,
    };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe('authenticate', () => {
    it('returns 401 when no authorization header', async () => {
      await authenticate(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'No token provided' });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('returns 401 when header does not start with Bearer', async () => {
      mockReq.headers.authorization = 'Basic token123';
      await authenticate(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it('returns 401 when token verification fails', async () => {
      mockReq.headers.authorization = 'Bearer invalid-token';
      await authenticate(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('succeeds with valid token and sets req.user', async () => {
      mockReq.headers.authorization = 'Bearer valid-token';
      await authenticate(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.uid).toBe('mock-uid');
      expect(mockReq.user.email).toBe('user@careerveda.ai');
      expect(mockReq.user.role).toBe('STUDENT');
    });
  });

  describe('authorize', () => {
    it('returns 401 when req.user is not set', () => {
      const middleware = authorize('ADMIN');
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
    });

    it('returns 403 when user role is not allowed', () => {
      mockReq.user = { uid: 'test', role: 'STUDENT' };
      const middleware = authorize('ADMIN');
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden: insufficient permissions' });
    });

    it('calls next when user role is in allowed roles', () => {
      mockReq.user = { uid: 'test', role: 'ADMIN' };
      const middleware = authorize('ADMIN', 'MENTOR');
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('calls next when user role matches one of multiple allowed roles', () => {
      mockReq.user = { uid: 'test', role: 'MENTOR' };
      const middleware = authorize('ADMIN', 'MENTOR', 'RECRUITER');
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('returns 403 for guest role with no matching allowed role', () => {
      mockReq.user = { uid: 'test', role: 'GUEST' };
      const middleware = authorize('ADMIN', 'MENTOR');
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe('optionalAuth', () => {
    it('sets user when valid token provided', async () => {
      mockReq.headers.authorization = 'Bearer valid-token';
      await optionalAuth(mockReq, mockRes, mockNext);
      expect(mockReq.user).toBeDefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('proceeds without user when no token', async () => {
      await optionalAuth(mockReq, mockRes, mockNext);
      expect(mockReq.user).toBeUndefined();
      expect(mockNext).toHaveBeenCalled();
    });

    it('silently fails on invalid token test', async () => {
      mockReq.headers.authorization = 'Bearer garbage-token';
      mockRes.headers = mockReq.headers;
      await optionalAuth(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe('Validation Middleware', () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    mockNext = vi.fn();
  });

  describe('errorHandler', () => {
    it('handles permission-denied error', () => {
      const err = { code: 'permission-denied' };
      errorHandler(err, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Permission denied' });
    });

    it('handles not-found error', () => {
      const err = { code: 'not-found' };
      errorHandler(err, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Resource not found' });
    });

    it('handles ValidationError', () => {
      const err = { name: 'ValidationError', message: 'Invalid email format' };
      errorHandler(err, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Invalid email format' });
    });

    it('handles generic error with status', () => {
      const err = { status: 429, message: 'Rate limit exceeded' };
      errorHandler(err, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(429);
    });

    it('defaults to 500 for unknown errors', () => {
      const err = { message: 'Unexpected failure' };
      errorHandler(err, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
    });

    it('handles error without message', () => {
      const err = {};
      errorHandler(err, mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('asyncHandler', () => {
    it('catches promise rejections', async () => {
      const failingFn = async () => { throw new Error('Async error'); };
      const wrapped = asyncHandler(failingFn);
      await wrapped(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('passes through successful handlers', async () => {
      const successFn = async (req: any, res: any) => { res.json({ ok: true }); };
      const wrapped = asyncHandler(successFn);
      await wrapped(mockReq, mockRes, mockNext);
      expect(mockRes.json).toHaveBeenCalledWith({ ok: true });
    });
  });

  describe('validate', () => {
    it('calls next when validation passes', () => {
      const schema = { validate: vi.fn().mockReturnValue({ error: null }) };
      const middleware = validate(schema);
      middleware(mockReq, mockRes, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });

    it('returns 400 when validation fails', () => {
      const schema = {
        validate: vi.fn().mockReturnValue({
          error: { details: [{ message: 'Email is required' }] },
        }),
      };
      const middleware = validate(schema);
      middleware(mockReq, mockRes, mockNext);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Email is required' });
    });
  });
});
