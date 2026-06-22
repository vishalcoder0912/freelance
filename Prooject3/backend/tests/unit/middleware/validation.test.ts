import { describe, it, expect, vi, beforeEach } from 'vitest';
import { errorHandler, asyncHandler, validate } from '../../../src/middleware/validation.js';

function mockReq(body: any = {}) {
  return { body } as any;
}

function mockRes() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const next = vi.fn();

describe('errorHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns 403 for permission-denied error code', () => {
    const err = { code: 'permission-denied', message: 'no access' } as any;
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Permission denied' });
  });

  it('returns 404 for not-found error code', () => {
    const err = { code: 'not-found', message: 'missing' } as any;
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
  });

  it('returns 400 for ValidationError', () => {
    const err = { name: 'ValidationError', message: 'field is required' } as any;
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'field is required' });
  });

  it('returns 500 for generic error with status', () => {
    const err = { status: 502, message: 'Bad gateway' } as any;
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.json).toHaveBeenCalledWith({ error: 'Bad gateway' });
  });

  it('returns 500 when error has no status', () => {
    const err = { message: 'something broke' } as any;
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'something broke' });
  });

  it('returns "Internal server error" when error has no message', () => {
    const err = {} as any;
    const req = mockReq();
    const res = mockRes();

    errorHandler(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});

describe('asyncHandler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls next when handler resolves', async () => {
    const handler = asyncHandler(async (_req: any, _res: any, _next: any) => {
      return 'ok';
    });

    const req = mockReq();
    const res = mockRes();

    await handler(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });

  it('calls next with error when handler rejects', async () => {
    const expectedError = new Error('async failure');
    const handler = asyncHandler(async () => {
      throw expectedError;
    });

    const req = mockReq();
    const res = mockRes();

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(expectedError);
  });

  it('propagates synchronous throw out of the returned function', () => {
    const expectedError = new Error('sync throw');
    const handler = asyncHandler(() => {
      throw expectedError;
    });

    const req = mockReq();
    const res = mockRes();

    expect(() => handler(req, res, next)).toThrow('sync throw');
    expect(next).not.toHaveBeenCalled();
  });
});

describe('validate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls next when body is valid', () => {
    const schema = {
      validate: vi.fn().mockReturnValue({ error: null })
    };

    const req = mockReq({ name: 'Test' });
    const res = mockRes();
    const middleware = validate(schema);

    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 400 with error message when body is invalid', () => {
    const schema = {
      validate: vi.fn().mockReturnValue({
        error: {
          details: [{ message: '"name" is required' }]
        }
      })
    };

    const req = mockReq({});
    const res = mockRes();
    const middleware = validate(schema);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: '"name" is required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 400 when required field is missing', () => {
    const schema = {
      validate: vi.fn().mockReturnValue({
        error: {
          details: [{ message: '"email" is not allowed to be empty' }]
        }
      })
    };

    const req = mockReq({ email: '' });
    const res = mockRes();
    const middleware = validate(schema);

    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: '"email" is not allowed to be empty'
    });
  });

  it('validates against the req.body', () => {
    const schema = {
      validate: vi.fn().mockReturnValue({ error: null })
    };
    const body = { foo: 'bar' };
    const req = mockReq(body);
    const res = mockRes();

    validate(schema)(req, res, next);

    expect(schema.validate).toHaveBeenCalledWith(body);
  });
});
