import { describe, it, expect } from 'vitest';
import { InvoiceService } from '../../services/InvoiceService';
import { InvoiceStatus } from '../../domain/aggregates/Invoice';

describe('InvoiceService', () => {
  it('[INV-001] should create a valid invoice with multiple line items', () => {
    // Arrange
    const invoiceService = new InvoiceService();
    const customerId = 'CUST-123';
    const lineItems = [
      { productId: 'PROD-001', quantity: 2, unitPrice: '50.00 USD' },
      { productId: 'PROD-002', quantity: 1, unitPrice: '100.00 USD' }
    ];

    // Act
    const invoice = invoiceService.createInvoice(customerId, lineItems);

    // Assert
    expect(invoice.customerId).toBe(customerId);
    expect(invoice.status).toBe(InvoiceStatus.Draft);
    expect(invoice.lineItems.length).toBe(2);
    expect(invoice.total.amount).toBe(200);
    expect(invoice.total.toString()).toBe('200.00 USD');
  });

  it('[INV-002] should add a line item to an existing invoice', () => {
    // Arrange
    const invoiceService = new InvoiceService();
    const invoice = invoiceService.createInvoice('CUST-123');
    const lineItemInput = { productId: 'PROD-003', quantity: 3, unitPrice: '25.00 USD' };

    // Act
    const updatedInvoice = invoiceService.addLineItemToInvoice(invoice.invoiceId, lineItemInput);

    // Assert
    expect(updatedInvoice.lineItems.length).toBe(1);
    expect(updatedInvoice.total.amount).toBe(75);
    expect(updatedInvoice.total.toString()).toBe('75.00 USD');
  });

  it('[INV-003] should prevent invalid invoice creation with zero quantity', () => {
    // Arrange
    const invoiceService = new InvoiceService();
    const customerId = 'CUST-789';
    const invalidLineItems = [
      { productId: 'PROD-004', quantity: 0, unitPrice: '10.00 USD' }
    ];

    // Act & Assert
    expect(() => {
      invoiceService.createInvoice(customerId, invalidLineItems);
    }).toThrow();
  });

  it('should generate sequential invoice IDs', () => {
    // Arrange
    const invoiceService = new InvoiceService();

    // Act
    const invoice1 = invoiceService.createInvoice('CUST-123');
    const invoice2 = invoiceService.createInvoice('CUST-123');

    // Assert
    expect(invoice1.invoiceId).toBe('INV-001');
    expect(invoice2.invoiceId).toBe('INV-002');
  });

  it('should retrieve an invoice by ID', () => {
    // Arrange
    const invoiceService = new InvoiceService();
    const invoice = invoiceService.createInvoice('CUST-123');

    // Act
    const retrievedInvoice = invoiceService.getInvoice(invoice.invoiceId);

    // Assert
    expect(retrievedInvoice).not.toBeUndefined();
    expect(retrievedInvoice?.invoiceId).toBe(invoice.invoiceId);
  });

  it('should return undefined when retrieving a non-existent invoice', () => {
    // Arrange
    const invoiceService = new InvoiceService();

    // Act
    const result = invoiceService.getInvoice('INV-999');

    // Assert
    expect(result).toBeUndefined();
  });
});
