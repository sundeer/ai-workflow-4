import { describe, it, expect } from 'vitest';
import { Invoice, InvoiceStatus } from '../../domain/aggregates/Invoice';
import { LineItem } from '../../domain/entities/LineItem';
import { Money } from '../../domain/valueObjects/Money';
import { Payment } from '../../domain/aggregates/Payment';

describe('Invoice', () => {
  it('[INV-001] should create a valid invoice with multiple line items', () => {
    // Arrange
    const customerId = 'CUST-123';
    const lineItems = [
      new LineItem('ITEM-001', 'PROD-001', 2, new Money(50, 'USD')),
      new LineItem('ITEM-002', 'PROD-002', 1, new Money(100, 'USD'))
    ];

    // Act
    const invoice = new Invoice('INV-001', customerId, InvoiceStatus.Draft, lineItems);

    // Assert
    expect(invoice.status).toBe(InvoiceStatus.Draft);
    expect(invoice.total.amount).toBe(200);
    expect(invoice.total.currency).toBe('USD');
  });

  it('[INV-002] should add a line item to an existing invoice', () => {
    // Arrange
    const invoice = new Invoice('INV-456', 'CUST-123', InvoiceStatus.Draft);
    const lineItem = new LineItem('ITEM-003', 'PROD-003', 3, new Money(25, 'USD'));

    // Act
    invoice.addLineItem(lineItem);

    // Assert
    expect(invoice.lineItems.length).toBe(1);
    expect(invoice.total.amount).toBe(75);
    expect(invoice.total.currency).toBe('USD');
  });

  it('[INV-003] should prevent invalid invoice creation with zero quantity', () => {
    // Arrange
    const customerId = 'CUST-789';
    const invalidQuantity = 0;

    // Act & Assert
    expect(() => {
      const lineItem = new LineItem('ITEM-004', 'PROD-004', invalidQuantity, new Money(10, 'USD'));
      new Invoice('INV-003', customerId, InvoiceStatus.Draft, [lineItem]);
    }).toThrow();
  });

  it('should calculate the total correctly', () => {
    // Arrange
    const invoice = new Invoice('INV-004', 'CUST-123', InvoiceStatus.Draft);
    const lineItem1 = new LineItem('ITEM-005', 'PROD-005', 2, new Money(30, 'USD'));
    const lineItem2 = new LineItem('ITEM-006', 'PROD-006', 5, new Money(10, 'USD'));

    // Act
    invoice.addLineItem(lineItem1); // 2 * 30 = 60
    invoice.addLineItem(lineItem2); // 5 * 10 = 50

    // Assert
    expect(invoice.total.amount).toBe(110); // 60 + 50 = 110
  });

  it('should record a payment correctly', () => {
    // Arrange
    const invoice = new Invoice('INV-005', 'CUST-123', InvoiceStatus.Draft);
    invoice.addLineItem(new LineItem('ITEM-007', 'PROD-007', 1, new Money(100, 'USD')));
    const payment = new Payment('PAY-001', 'INV-005', new Money(50, 'USD'), new Date());

    // Act
    invoice.recordPayment(payment);

    // Assert
    expect(invoice.amountPaid.amount).toBe(50);
    expect(invoice.isFullyPaid()).toBe(false);
  });

  it('should identify fully paid invoices', () => {
    // Arrange
    const invoice = new Invoice('INV-006', 'CUST-123', InvoiceStatus.Draft);
    invoice.addLineItem(new LineItem('ITEM-008', 'PROD-008', 1, new Money(100, 'USD')));
    const payment = new Payment('PAY-002', 'INV-006', new Money(100, 'USD'), new Date());

    // Act
    invoice.recordPayment(payment);

    // Assert
    expect(invoice.isFullyPaid()).toBe(true);
  });
});
