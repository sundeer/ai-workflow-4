import { describe, it, expect } from 'vitest';
import { Money } from '../../../../src/domain/value-objects/Money';

describe('Money', () => {
  describe('constructor', () => {
    it('should create a valid Money object', () => {
      const money = new Money(100.50, 'USD');
      expect(money.amount).toBe(100.50);
      expect(money.currency).toBe('USD');
    });

    it('should throw error for negative amount', () => {
      expect(() => new Money(-10, 'USD')).toThrow('Money amount cannot be negative');
    });

    it('should throw error for invalid currency code', () => {
      expect(() => new Money(100, 'US')).toThrow('Currency must be a valid ISO 4217 code');
      expect(() => new Money(100, 'usd')).toThrow('Currency must be a valid ISO 4217 code');
    });
  });

  describe('fromString', () => {
    it('should parse a valid money string', () => {
      const money = Money.fromString('123.45 USD');
      expect(money.amount).toBe(123.45);
      expect(money.currency).toBe('USD');
    });

    it('should throw error for invalid format', () => {
      expect(() => Money.fromString('123.45')).toThrow('Invalid money format');
      expect(() => Money.fromString('123.45 us')).toThrow('Invalid money format');
      expect(() => Money.fromString('USD 123.45')).toThrow('Invalid money format');
    });
  });

  describe('operations', () => {
    it('should add correctly', () => {
      const a = new Money(100, 'USD');
      const b = new Money(50, 'USD');
      const result = a.add(b);

      expect(result.amount).toBe(150);
      expect(result.currency).toBe('USD');
      // Original objects should be unchanged
      expect(a.amount).toBe(100);
      expect(b.amount).toBe(50);
    });

    it('should subtract correctly', () => {
      const a = new Money(100, 'USD');
      const b = new Money(30, 'USD');
      const result = a.subtract(b);

      expect(result.amount).toBe(70);
      expect(result.currency).toBe('USD');
    });

    it('should multiply correctly', () => {
      const money = new Money(10, 'USD');
      const result = money.multiply(3);

      expect(result.amount).toBe(30);
      expect(result.currency).toBe('USD');
    });

    it('should throw error when subtracting to negative', () => {
      const a = new Money(10, 'USD');
      const b = new Money(20, 'USD');

      expect(() => a.subtract(b)).toThrow('Cannot subtract to a negative amount');
    });

    it('should throw error when operating on different currencies', () => {
      const usd = new Money(100, 'USD');
      const eur = new Money(100, 'EUR');

      expect(() => usd.add(eur)).toThrow('Cannot operate on different currencies');
      expect(() => usd.subtract(eur)).toThrow('Cannot operate on different currencies');
    });
  });

  describe('toString', () => {
    it('should format correctly', () => {
      const money = new Money(123.45, 'USD');
      expect(money.toString()).toBe('123.45 USD');
    });

    it('should format with two decimal places', () => {
      const money = new Money(100, 'EUR');
      expect(money.toString()).toBe('100.00 EUR');
    });
  });
});
