import { describe, it, expect, vi, beforeEach } from 'vitest';
import { slugify } from '../../src/utils/helpers.js';

describe('Utility Functions', () => {
  describe('slugify', () => {
    it('converts simple title to slug', () => {
      expect(slugify('AI Engineering')).toBe('ai-engineering');
    });

    it('handles multiple spaces', () => {
      expect(slugify('Data  Science  with  Gen AI')).toBe('data-science-with-gen-ai');
    });

    it('removes special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('handles uppercase letters', () => {
      expect(slugify('PRODUCT MANAGEMENT')).toBe('product-management');
    });

    it('handles numbers', () => {
      expect(slugify('Program 2.0')).toBe('program-20');
    });

    it('handles empty string', () => {
      expect(slugify('')).toBe('');
    });

    it('handles strings with leading/trailing spaces', () => {
      expect(slugify('  AI Engineering  ')).toBe('ai-engineering');
    });

    it('handles hyphens and underscores', () => {
      expect(slugify('AI_Engineering Full-Stack')).toBe('ai-engineering-full-stack');
    });

    it('collapses multiple hyphens', () => {
      expect(slugify('A   B   C')).toBe('a-b-c');
    });

    it('handles single word', () => {
      expect(slugify('Hello')).toBe('hello');
    });
  });
});
