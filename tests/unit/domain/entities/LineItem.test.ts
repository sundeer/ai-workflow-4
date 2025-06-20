import { describe, it, expect } from 'vitest';
import { LineItem } from '../../../../src/domain/entities/LineItem';
import { Money } from '../../../../src/domain/value-objects/Money';

describe('LineItem', () => {
  describe('constructor', () => {
    it('should create a valid LineItem', () => {
      const lineItem = new LineItem('PROD-001', 2, new Money(50, 'USD'));

      expect(lineItem.productId).toBe('PROD-001');
      expect(lineItem.quantity).toBe(2);
      expect(lineItem.unitPrice.amount).toBe(50);
      expect(lineItem.unitPrice.currency).toBe('USD');
      expect(lineItem.lineItemId).toBeDefined();
      expect(lineItem.lineItemId.startsWith('LI-')).toBe(true);
    });

    it('should throw error for zero quantity', () => {
      expect(() => {
        new LineItem('PROD-001', 0, new Money(50, 'USD'));
      }).toThrow('Line item quantity must be positive');
    });

    it('should throw error for negative quantity', () => {
      expect(() => {
        new LineItem('PROD-001', -1, new Money(50, 'USD'));
      }).toThrow('Line item quantity must be positive');
    });
  });

  describe('calculateLineTotal', () => {
    it('should calculate line total correctly', () => {
      const lineItem = new LineItem('PROD-001', 3, new Money(25, 'USD'));
      const total = lineItem.calculateLineTotal();

      expect(total.amount).toBe(75);
      expect(total.currency).toBe('USD');
    });

    it('should handle decimal quantities', () => {
      const lineItem = new LineItem('PROD-001', 2.5, new Money(10, 'USD'));
      const total = lineItem.calculateLineTotal();

      expect(total.amount).toBe(25);
      expect(total.currency).toBe('USD');
    });
  });
});
