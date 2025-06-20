import { describe, it, expect } from 'vitest';
import { Invoice } from '../../../src/domain/aggregates/Invoice';
import { LineItem } from '../../../src/domain/entities/LineItem';
import { Money } from '../../../src/domain/value-objects/Money';
import { InvoiceService } from '../../../src/services/InvoiceService';

describe('Invoice Management', () => {
  // Helper functions for BDD-style testing
  function givenCustomerExists(customerId: string) {
    // In a real system, this would check against a customer repository
    // For now, we just return the ID for test purposes
    return { customerId };
  }

  function whenCreatingInvoiceWithLineItems(
    customerId: string,
    lineItems: Array<{ productId: string; quantity: number; unitPrice: string }>
  ) {
    const invoiceService = new InvoiceService();
    const invoice = invoiceService.createInvoice(customerId, lineItems);
    return { invoice, invoiceService };
  }

  function givenExistingInvoice(invoiceId: string) {
    // In a real system, this would fetch from a repository
    // For testing, we create a new invoice with the given ID
    const invoice = new Invoice('CUST-TEST');
    Object.defineProperty(invoice, 'invoiceId', { value: invoiceId });

    const invoiceService = new InvoiceService();
    // @ts-ignore - accessing private field for testing
    invoiceService.invoices.set(invoiceId, invoice);

    return { invoice, invoiceService };
  }

  function whenAddingLineItem(
    invoiceService: InvoiceService,
    invoiceId: string,
    productId: string,
    quantity: number,
    unitPrice: string
  ) {
    const updatedInvoice = invoiceService.addLineItem(invoiceId, productId, quantity, unitPrice);
    return { invoice: updatedInvoice };
  }

  function whenAttemptingToCreateInvalidInvoice(
    customerId: string,
    invalidLineItem: { productId: string; quantity: number; unitPrice: string }
  ) {
    const invoiceService = new InvoiceService();
    let error: Error | null = null;
    try {
      invoiceService.createInvoice(customerId, [invalidLineItem]);
    } catch (e) {
      error = e as Error;
    }
    return { error };
  }

  /**
   * [INV-001] Create Valid Invoice
   */
  it('should create a valid invoice with multiple line items', () => {
    // GIVEN a customer with ID "CUST-123" exists
    const { customerId } = givenCustomerExists('CUST-123');

    // WHEN I create a new invoice for customer "CUST-123" with the specified line items
    const { invoice } = whenCreatingInvoiceWithLineItems(customerId, [
      { productId: 'PROD-001', quantity: 2, unitPrice: '50.00 USD' },
      { productId: 'PROD-002', quantity: 1, unitPrice: '100.00 USD' }
    ]);

    // THEN the invoice should be created in status "Draft"
    expect(invoice.status).toBe('Draft');

    // AND the invoice total should be "200.00 USD"
    expect(invoice.total.toString()).toBe('200.00 USD');
  });

  /**
   * [INV-002] Add Line Item to Invoice
   */
  it('should add a line item to an existing invoice', () => {
    // GIVEN an existing invoice "INV-456" with no line items
    const { invoice, invoiceService } = givenExistingInvoice('INV-456');
    expect(invoice.lineItems.length).toBe(0);

    // WHEN I add a line item with productId "PROD-003", quantity 3, and unitPrice "25.00 USD"
    const { invoice: updatedInvoice } = whenAddingLineItem(
      invoiceService,
      'INV-456',
      'PROD-003',
      3,
      '25.00 USD'
    );

    // THEN the invoice should contain 1 line item
    expect(updatedInvoice.lineItems.length).toBe(1);

    // AND the invoice total should be "75.00 USD"
    expect(updatedInvoice.total.toString()).toBe('75.00 USD');
  });

  /**
   * [INV-003] Prevent Invalid Invoice Creation
   */
  it('should prevent creating an invoice with invalid data', () => {
    // GIVEN a customer with ID "CUST-789" exists
    const { customerId } = givenCustomerExists('CUST-789');

    // WHEN I attempt to create an invoice with a line item having quantity 0
    const { error } = whenAttemptingToCreateInvalidInvoice(customerId, {
      productId: 'PROD-004',
      quantity: 0,
      unitPrice: '30.00 USD'
    });

    // THEN the system should reject the operation with an appropriate error message
    expect(error).not.toBeNull();
    expect(error?.message).toContain('quantity must be positive');
  });
});
