import { describe, it, expect, beforeEach } from 'vitest';
import { InvoiceService } from '../../../src/domain/services/InvoiceService';
import { Invoice } from '../../../src/domain/entities/Invoice';

describe('Invoice Management', () => {
  let invoiceService: InvoiceService;

  beforeEach(() => {
    invoiceService = new InvoiceService();
  });

  describe('[INV-001] Create Valid Invoice', () => {
    it('should create a valid invoice with multiple line items', () => {
      // Given
      const customerId = 'CUST-123';
      const lineItems = [
        { productId: 'PROD-001', quantity: 2, unitPrice: '50.00 USD' },
        { productId: 'PROD-002', quantity: 1, unitPrice: '100.00 USD' },
      ];

      // When
      const invoice = invoiceService.createInvoice(customerId, lineItems);

      // Then
      expect(invoice).toBeInstanceOf(Invoice);
      expect(invoice.status).toBe('Draft');
      expect(invoice.lineItems.length).toBe(2);
      expect(invoice.total.toString()).toBe('200.00 USD');
    });
  });

  describe('[INV-002] Add Line Item to Invoice', () => {
    it('should add a line item to an existing invoice', () => {
      // Given
      const customerId = 'CUST-123';
      const invoice = invoiceService.createInvoice(customerId, []);
      
      // When
      invoiceService.addLineItem(invoice, 'PROD-003', 3, '25.00 USD');

      // Then
      expect(invoice.lineItems.length).toBe(1);
      expect(invoice.total.toString()).toBe('75.00 USD');
    });
  });

  describe('[INV-003] Prevent Invalid Invoice Creation', () => {
    it('should reject invoice creation with invalid line item quantity', () => {
      // Given
      const customerId = 'CUST-789';
      const lineItems = [
        { productId: 'PROD-001', quantity: 0, unitPrice: '50.00 USD' },
      ];

      // When/Then
      expect(() => {
        invoiceService.createInvoice(customerId, lineItems);
      }).toThrow('Quantity must be greater than 0');
    });
  });
});
