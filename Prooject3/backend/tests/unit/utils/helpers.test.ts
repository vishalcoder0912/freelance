import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateId,
  slugify,
  paginate,
  sanitizeUser,
  calculateScore,
  formatDate
} from '../../../src/utils/helpers.js';

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('returns unique values on successive calls', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 50; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(50);
  });

  it('contains only alphanumeric characters', () => {
    const id = generateId();
    expect(/^[a-z0-9]+$/.test(id)).toBe(true);
  });
});

describe('slugify', () => {
  it('converts normal text to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('removes special characters', () => {
    expect(slugify('Hello! @World# $Test%')).toBe('hello-world-test');
  });

  it('replaces multiple spaces with single hyphen', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('trims leading and trailing spaces (after slug conversion)', () => {
    expect(slugify('  Hello World  ')).toBe('-hello-world-');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a---b---c')).toBe('a-b-c');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles text with only special characters', () => {
    expect(slugify('!@#$%^&*()')).toBe('');
  });

  it('preserves hyphens in input', () => {
    expect(slugify('hello-world')).toBe('hello-world');
  });

  it('handles underscores', () => {
    expect(slugify('hello_world')).toBe('hello_world');
  });

  it('handles numbers', () => {
    expect(slugify('Article 101 Tips')).toBe('article-101-tips');
  });
});

describe('paginate', () => {
  it('returns defaults when called with no arguments', () => {
    const result = paginate();
    expect(result).toEqual({ page: 1, limit: 10, offset: 0 });
  });

  it('returns correct offset for custom page and limit', () => {
    const result = paginate(3, 20);
    expect(result).toEqual({ page: 3, limit: 20, offset: 40 });
  });

  it('clamps negative page to 1', () => {
    const result = paginate(-5, 10);
    expect(result.page).toBe(1);
    expect(result.offset).toBe(0);
  });

  it('clamps zero limit to 1', () => {
    const result = paginate(1, 0);
    expect(result.limit).toBe(1);
  });

  it('clamps limit above 100 to 100', () => {
    const result = paginate(1, 200);
    expect(result.limit).toBe(100);
  });

  it('handles string inputs from query params', () => {
    const result = paginate('2' as any, '15' as any);
    expect(result).toEqual({ page: 2, limit: 15, offset: 15 });
  });

  it('returns NaN page when parseInt produces NaN', () => {
    const result = paginate(NaN, 10);
    expect(result.page).toBeNaN();
  });

  it('calculates correct offset for page 1', () => {
    const result = paginate(1, 25);
    expect(result.offset).toBe(0);
  });

  it('calculates correct offset for page 5 with limit 10', () => {
    const result = paginate(5, 10);
    expect(result.offset).toBe(40);
  });
});

describe('sanitizeUser', () => {
  it('removes password field from user object', () => {
    const user = { id: '1', name: 'Test', email: 'a@b.com', password: 'secret123' };
    const result = sanitizeUser(user);

    expect(result).toEqual({ id: '1', name: 'Test', email: 'a@b.com' });
    expect(result.password).toBeUndefined();
  });

  it('returns null when user is null', () => {
    expect(sanitizeUser(null)).toBeNull();
  });

  it('returns null when user is undefined', () => {
    expect(sanitizeUser(undefined)).toBeNull();
  });

  it('returns all fields when no password exists', () => {
    const user = { id: '2', name: 'No Pass' };
    const result = sanitizeUser(user);

    expect(result).toEqual({ id: '2', name: 'No Pass' });
  });

  it('does not mutate the original object', () => {
    const user = { id: '3', password: 'abc' };
    sanitizeUser(user);

    expect(user.password).toBe('abc');
  });

  it('removes only the password field, keeps other sensitive-looking fields', () => {
    const user = { id: '4', password: 'x', token: 'y', secret: 'z' };
    const result = sanitizeUser(user);

    expect(result).toEqual({ id: '4', token: 'y', secret: 'z' });
  });
});

describe('calculateScore', () => {
  it('calculates equal-weight score', () => {
    const items = { math: 80, science: 60 };
    const weights = { math: 1, science: 1 };
    // total = 80*1 + 60*1 = 140, max = 100*1 + 100*1 = 200, score = 70
    expect(calculateScore(items, weights)).toBe(70);
  });

  it('calculates different-weight score', () => {
    const items = { math: 100, science: 0 };
    const weights = { math: 3, science: 1 };
    // total = 100*3 + 0*1 = 300, max = 100*3 + 100*1 = 400, score = 75
    expect(calculateScore(items, weights)).toBe(75);
  });

  it('returns NaN for empty items (0/0 division)', () => {
    expect(calculateScore({}, {})).toBeNaN();
  });

  it('treats missing weights as 1', () => {
    const items = { a: 50 };
    const weights = {};
    // total = 50*1 = 50, max = 100*1 = 100, score = 50
    expect(calculateScore(items, weights)).toBe(50);
  });

  it('treats null/undefined values as 0', () => {
    const items = { a: null as any, b: undefined as any };
    const weights = { a: 1, b: 1 };
    expect(calculateScore(items, weights)).toBe(0);
  });

  it('returns 100 when all items are at max', () => {
    const items = { a: 100, b: 100 };
    const weights = { a: 2, b: 1 };
    expect(calculateScore(items, weights)).toBe(100);
  });

  it('rounds to nearest integer', () => {
    const items = { a: 33 };
    const weights = { a: 1 };
    // total = 33, max = 100, score = 33
    expect(calculateScore(items, weights)).toBe(33);
  });

  it('handles asymmetric weights', () => {
    const items = { essay: 80, quiz: 60, project: 90 };
    const weights = { essay: 5, quiz: 1, project: 3 };
    // total = 80*5 + 60*1 + 90*3 = 400 + 60 + 270 = 730
    // max = 100*5 + 100*1 + 100*3 = 500 + 100 + 300 = 900
    // score = round(730/900 * 100) = round(81.11) = 81
    expect(calculateScore(items, weights)).toBe(81);
  });
});

describe('formatDate', () => {
  it('formats a Date object to ISO string', () => {
    const date = new Date('2025-06-15T12:00:00.000Z');
    expect(formatDate(date)).toBe('2025-06-15T12:00:00.000Z');
  });

  it('formats a date string to ISO string', () => {
    expect(formatDate('2025-01-01')).toBe('2025-01-01T00:00:00.000Z');
  });

  it('formats a numeric timestamp to ISO string', () => {
    const ts = new Date('2025-03-20T08:30:00.000Z').getTime();
    expect(formatDate(ts)).toBe('2025-03-20T08:30:00.000Z');
  });

  it('returns ISO format string', () => {
    const result = formatDate(new Date());
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});
