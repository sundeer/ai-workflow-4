import { describe, it, expect } from 'vitest';
import { Invoice } from '../../../src/domain/aggregates/Invoice';
import { LineItem } from '../../../src/domain/entities/LineItem';
import { Money } from '../../../src/domain/value-objects/Money';

// Helper functions for BDD style tests
function givenCustomerExists(id: string) {
  // In a real app, this would validate against a customer repository
  return { customerId: id };
}

function whenCreatingInvoiceWithLineItems(customerId: string, items: Array<{
  productId: string;
  quantity: number;
  unitPrice: string;
}>) {
  const invoice = new Invoice(customerId);
  items.forEach(item => {
    invoice.addLineItem(new LineItem(
      item.productId,
      item.quantity,
      Money.fromString(item.unitPrice)
    ));
  });
  return { invoice };
}

describe('Invoice Creation', () => {
  it('[INV-001] should create a valid invoice with multiple line items', () => {
    // GIVEN a customer with ID "CUST-123" exists
    const { customerId } = givenCustomerExists('CUST-123');

    // WHEN I create a new invoice for customer "CUST-123" with line items
    const { invoice } = whenCreatingInvoiceWithLineItems(customerId, [
      { productId: 'PROD-001', quantity: 2, unitPrice: '50.00 USD' },
      { productId: 'PROD-002', quantity: 1, unitPrice: '100.00 USD' }
    ]);

    // THEN the invoice should be created in status "Draft"
    expect(invoice.status).toBe('Draft');

    // AND the invoice total should be "200.00 USD"
    expect(invoice.calculateTotal().toString()).toBe('200.00 USD');
  });

  it('[INV-002] should add line item to invoice', () => {
    // GIVEN an existing invoice with no line items
    const { customerId } = givenCustomerExists('CUST-456');
    const invoice = new Invoice(customerId);

    // WHEN I add a line item
    invoice.addLineItem(new LineItem(
      'PROD-003',
      3,
      Money.fromString('25.00 USD')
    ));

    // THEN the invoice should contain 1 line item
    expect(invoice.lineItems.length).toBe(1);

    // AND the invoice total should be "75.00 USD"
    expect(invoice.calculateTotal().toString()).toBe('75.00 USD');
  });

  it('[INV-003] should prevent invalid invoice creation', () => {
    // GIVEN a customer with ID "CUST-789" exists
    const { customerId } = givenCustomerExists('CUST-789');
    const invoice = new Invoice(customerId);

    // WHEN I attempt to create an invoice with a line item having quantity 0
    // THEN the system should reject the operation with an appropriate error message
    expect(() => {
      new LineItem('PROD-001', 0, Money.fromString('50.00 USD'));
    }).toThrow('Quantity must be greater than 0');
  });
}); 