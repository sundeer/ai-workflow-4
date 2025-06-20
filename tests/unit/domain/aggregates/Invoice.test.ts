import { describe, it, expect } from 'vitest';
import { Invoice } from '../../../../src/domain/aggregates/Invoice';
import { LineItem } from '../../../../src/domain/entities/LineItem';
import { Money } from '../../../../src/domain/value-objects/Money';

describe('Invoice', () => {
  describe('constructor', () => {
    it('should create a valid invoice in Draft status', () => {
      const invoice = new Invoice('CUST-123');

      expect(invoice.customerId).toBe('CUST-123');
      expect(invoice.status).toBe('Draft');
      expect(invoice.invoiceId).toBeDefined();
      expect(invoice.invoiceId.startsWith('INV-')).toBe(true);
      expect(invoice.lineItems).toHaveLength(0);
      expect(invoice.total.amount).toBe(0);
    });
  });

  describe('addLineItem', () => {
    it('should add a line item and update total', () => {
      const invoice = new Invoice('CUST-123');
      const lineItem = new LineItem('PROD-001', 2, new Money(50, 'USD'));

      invoice.addLineItem(lineItem);

      expect(invoice.lineItems).toHaveLength(1);
      expect(invoice.lineItems[0]).toBe(lineItem);
      expect(invoice.total.amount).toBe(100);
      expect(invoice.total.currency).toBe('USD');
    });

    it('should handle multiple line items', () => {
      const invoice = new Invoice('CUST-123');
      invoice.addLineItem(new LineItem('PROD-001', 2, new Money(50, 'USD')));
      invoice.addLineItem(new LineItem('PROD-002', 1, new Money(100, 'USD')));

      expect(invoice.lineItems).toHaveLength(2);
      expect(invoice.total.amount).toBe(200);
      expect(invoice.total.currency).toBe('USD');
    });

    it('should throw error if line items have different currencies', () => {
      const invoice = new Invoice('CUST-123');
      invoice.addLineItem(new LineItem('PROD-001', 2, new Money(50, 'USD')));

      expect(() => {
        invoice.addLineItem(new LineItem('PROD-002', 1, new Money(100, 'EUR')));
      }).toThrow('All line items must use the same currency');
    });
  });

  describe('removeLineItem', () => {
    it('should remove a line item and update total', () => {
      const invoice = new Invoice('CUST-123');
      const lineItem1 = new LineItem('PROD-001', 2, new Money(50, 'USD'));
      const lineItem2 = new LineItem('PROD-002', 1, new Money(100, 'USD'));

      invoice.addLineItem(lineItem1);
      invoice.addLineItem(lineItem2);
      expect(invoice.total.amount).toBe(200);

      invoice.removeLineItem(lineItem1.lineItemId);

      expect(invoice.lineItems).toHaveLength(1);
      expect(invoice.lineItems[0]).toBe(lineItem2);
      expect(invoice.total.amount).toBe(100);
    });

    it('should throw error if line item not found', () => {
      const invoice = new Invoice('CUST-123');
      invoice.addLineItem(new LineItem('PROD-001', 2, new Money(50, 'USD')));

      expect(() => {
        invoice.removeLineItem('non-existent-id');
      }).toThrow('Line item with ID non-existent-id not found');
    });
  });

  describe('calculateTotal', () => {
    it('should return zero for empty invoice', () => {
      const invoice = new Invoice('CUST-123');
      const total = invoice.calculateTotal();

      expect(total.amount).toBe(0);
      expect(total.currency).toBe('USD');
    });

    it('should calculate total correctly for multiple items', () => {
      const invoice = new Invoice('CUST-123');
      invoice.addLineItem(new LineItem('PROD-001', 2, new Money(50, 'USD')));
      invoice.addLineItem(new LineItem('PROD-002', 3, new Money(25, 'USD')));
      invoice.addLineItem(new LineItem('PROD-003', 1, new Money(75, 'USD')));

      const total = invoice.calculateTotal();

      expect(total.amount).toBe(225); // (2*50) + (3*25) + (1*75) = 100 + 75 + 75 = 225
      expect(total.currency).toBe('USD');
    });
  });
});
