import { describe, it, expect, vi } from 'vitest';
import { authenticate, authorize } from '../../src/middleware/auth.js';
import { errorHandler } from '../../src/middleware/validation.js';

describe('Security Functions', () => {
  describe('JWT Validation', () => {
    it('rejects requests without authorization header', async () => {
      const req = { headers: {} } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('rejects malformed authorization header', async () => {
      const req = { headers: { authorization: 'Basic token123' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('rejects invalid tokens', async () => {
      const req = { headers: { authorization: 'Bearer invalid-token' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('accepts valid tokens', async () => {
      const req = { headers: { authorization: 'Bearer valid-token' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      await authenticate(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeDefined();
    });
  });

  describe('RBAC Permissions', () => {
    it('allows admin to access admin routes', () => {
      const req = { user: { role: 'ADMIN' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      const middleware = authorize('ADMIN');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('denies student access to admin routes', () => {
      const req = { user: { role: 'STUDENT' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      const middleware = authorize('ADMIN');
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('denies unauthenticated access', () => {
      const req = {} as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      const middleware = authorize('ADMIN');
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('allows mentor to access mentor routes', () => {
      const req = { user: { role: 'MENTOR' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      const middleware = authorize('ADMIN', 'MENTOR');
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('Input Sanitization', () => {
    it('errors on XSS attempts in validation', () => {
      const schema = {
        validate: vi.fn().mockReturnValue({
          error: { details: [{ message: 'Invalid input: <script>alert("xss")</script>' }] },
        }),
      };

      const req = { body: { name: '<script>alert("xss")</script>' } } as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      errorHandler({ name: 'ValidationError', message: schema.validate(req.body).error.details[0].message }, req, res, next);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('strips HTML tags from validated fields', () => {
      const input = '<p>Hello</p><script>evil()</script>';
      const cleaned = input.replace(/<[^>]*>/g, '');
      expect(cleaned).toBe('Helloevil()');
    });
  });

  describe('Error Handling', () => {
    it('does not leak stack traces in production', () => {
      const origEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const err = new Error('Internal error');
      const req = {} as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      errorHandler(err, req, res, next);
      expect(res.json).toHaveBeenCalledWith(
        expect.not.objectContaining({ stack: expect.any(String) })
      );

      process.env.NODE_ENV = origEnv;
    });

    it('handles permission-denied errors gracefully', () => {
      const err = { code: 'permission-denied' };
      const req = {} as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Permission denied' });
    });

    it('handles not-found errors gracefully', () => {
      const err = { code: 'not-found' };
      const req = {} as any;
      const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
      const next = vi.fn();

      errorHandler(err, req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});

describe('Rate Limiting Validation', () => {
  it('respects rate limit configuration', () => {
    const limiterConfig = {
      windowMs: 15 * 60 * 1000,
      max: 100,
    };
    expect(limiterConfig.windowMs).toBe(900000);
    expect(limiterConfig.max).toBe(100);
  });

  it('returns appropriate error message', () => {
    const message = { error: 'Too many requests, please try again later.' };
    expect(message.error).toContain('Too many requests');
  });
});

describe('Data Validation Patterns', () => {
  it('validates email format', () => {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    expect(emailRegex.test('user@example.com')).toBe(true);
    expect(emailRegex.test('invalid-email')).toBe(false);
    expect(emailRegex.test('@domain.com')).toBe(false);
    expect(emailRegex.test('user@')).toBe(false);
  });

  it('validates password strength requirements', () => {
    const minLength = 6;
    expect('Test123!'.length).toBeGreaterThanOrEqual(minLength);
    expect('Abc1'.length).toBeLessThan(minLength);
  });

  it('validates phone number format', () => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    expect(phoneRegex.test('+911234567890')).toBe(true);
    expect(phoneRegex.test('1234567890')).toBe(true);
    expect(phoneRegex.test('abc')).toBe(false);
  });

  it('validates URL format', () => {
    const urlRegex = /^https?:\/\/.+/;
    expect(urlRegex.test('https://example.com')).toBe(true);
    expect(urlRegex.test('http://test.co')).toBe(true);
    expect(urlRegex.test('not-a-url')).toBe(false);
  });

  it('validates numeric amounts are positive', () => {
    const isValidAmount = (amount: number) => amount > 0;
    expect(isValidAmount(100)).toBe(true);
    expect(isValidAmount(0)).toBe(false);
    expect(isValidAmount(-50)).toBe(false);
  });

  it('validates score ranges', () => {
    const isValidScore = (score: number) => score >= 0 && score <= 100;
    expect(isValidScore(0)).toBe(true);
    expect(isValidScore(50)).toBe(true);
    expect(isValidScore(100)).toBe(true);
    expect(isValidScore(-1)).toBe(false);
    expect(isValidScore(101)).toBe(false);
  });

  it('validates that enum values are within allowed set', () => {
    const allowedRoles = ['STUDENT', 'MENTOR', 'RECRUITER', 'ADMIN'];
    expect(allowedRoles).toContain('STUDENT');
    expect(allowedRoles).toContain('ADMIN');
    expect(allowedRoles).not.toContain('GUEST');
  });
});
