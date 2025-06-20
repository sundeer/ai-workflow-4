import { describe, it, expect } from 'vitest';
import { Invoice } from '../../../src/domain/aggregates/Invoice.js';
import { LineItem } from '../../../src/domain/entities/LineItem.js';
import { Money } from '../../../src/domain/value-objects/Money.js';

describe('Invoice Management', () => {
  describe('[INV-001] Create Valid Invoice', () => {
    it('should create a valid invoice with multiple line items', () => {
      // GIVEN a customer with ID "CUST-123" exists
      const { customerId } = givenCustomerExists('CUST-123');
      
      // WHEN I create a new invoice for customer "CUST-123" with line items
      const lineItems = [
        { productId: 'PROD-001', quantity: 2, unitPrice: '50.00 USD' },
        { productId: 'PROD-002', quantity: 1, unitPrice: '100.00 USD' }
      ];
      const { invoice } = whenCreatingInvoiceWithLineItems(customerId, lineItems);
      
      // THEN the invoice should be created in status "Draft"
      expect(invoice.status).toBe('Draft');
      
      // AND the invoice total should be "200.00 USD"
      expect(invoice.calculateTotal().toString()).toBe('200.00 USD');
    });
  });

  describe('[INV-002] Add Line Item to Invoice', () => {
    it('should add line items to an existing invoice', () => {
      // GIVEN an existing invoice "INV-456" with no line items
      const { invoice } = givenExistingInvoiceWithNoLineItems('INV-456');
      
      // WHEN I add a line item with productId "PROD-003", quantity 3, and unitPrice "25.00 USD"
      const { updatedInvoice } = whenAddingLineItemToInvoice(
        invoice, 
        'PROD-003', 
        3, 
        Money.fromString('25.00 USD')
      );
      
      // THEN the invoice should contain 1 line item
      expect(updatedInvoice.lineItems.length).toBe(1);
      
      // AND the invoice total should be "75.00 USD"
      expect(updatedInvoice.calculateTotal().toString()).toBe('75.00 USD');
    });
  });

  describe('[INV-003] Prevent Invalid Invoice Creation', () => {
    it('should reject invoice creation with invalid line items', () => {
      // GIVEN a customer with ID "CUST-789" exists
      const { customerId } = givenCustomerExists('CUST-789');
      
      // WHEN I attempt to create an invoice with a line item having quantity 0
      const attemptInvalidInvoiceCreation = () => {
        const lineItems = [
          { productId: 'PROD-004', quantity: 0, unitPrice: '50.00 USD' }
        ];
        return whenCreatingInvoiceWithLineItems(customerId, lineItems);
      };
      
      // THEN the system should reject the operation with an appropriate error message
      expect(attemptInvalidInvoiceCreation).toThrow('Quantity must be positive');
    });
  });
});

// Helper functions following BDD pattern

function givenCustomerExists(customerId: string) {
  // In a real application, this would validate customer existence
  // For now, we assume the customer exists
  return { customerId };
}

function givenExistingInvoiceWithNoLineItems(invoiceId: string) {
  const invoice = new Invoice(invoiceId, 'CUST-456', 'Draft', []);
  return { invoice };
}

function whenCreatingInvoiceWithLineItems(
  customerId: string, 
  items: Array<{ productId: string; quantity: number; unitPrice: string }>
) {
  const lineItems = items.map(item => 
    LineItem.create(item.productId, item.quantity, Money.fromString(item.unitPrice))
  );
  const invoice = Invoice.create(customerId, lineItems);
  return { invoice };
}

function whenAddingLineItemToInvoice(
  invoice: Invoice, 
  productId: string, 
  quantity: number, 
  unitPrice: Money
) {
  const lineItem = LineItem.create(productId, quantity, unitPrice);
  invoice.addLineItem(lineItem);
  return { updatedInvoice: invoice };
}