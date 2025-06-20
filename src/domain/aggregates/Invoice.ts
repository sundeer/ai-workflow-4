import { LineItem, LineItemId } from '../entities/LineItem';
import { Money } from '../valueObjects/Money';
import { Payment } from './Payment';

/**
 * Unique identifier for an invoice
 */
export type InvoiceId = string;

/**
 * Unique identifier for a customer
 */
export type CustomerId = string;

/**
 * Represents the status of an invoice
 */
export enum InvoiceStatus {
  Draft = 'Draft',
  Issued = 'Issued',
  Paid = 'Paid'
}

/**
 * Root entity representing an invoice lifecycle.
 */
export class Invoice {
  private _lineItems: LineItem[] = [];
  private _total: Money;
  private _amountPaid: Money;

  constructor(
    public readonly invoiceId: InvoiceId,
    public readonly customerId: CustomerId,
    public readonly status: InvoiceStatus = InvoiceStatus.Draft,
    lineItems: LineItem[] = [],
    amountPaid?: Money
  ) {
    // Initialize with default values or provided ones
    this._lineItems = [...lineItems];

    // Default currency - in a real app would come from settings or first line item
    const defaultCurrency = lineItems.length > 0 
      ? lineItems[0].unitPrice.currency 
      : 'USD';

    this._total = new Money(0, defaultCurrency);
    this._amountPaid = amountPaid || new Money(0, defaultCurrency);

    // Calculate the total
    this._total = this.calculateTotal();

    // Validate invariants
    this.validateInvariants();
  }

  /**
   * Get all line items on this invoice
   */
  get lineItems(): ReadonlyArray<LineItem> {
    return [...this._lineItems];
  }

  /**
   * Get the total amount of the invoice
   */
  get total(): Money {
    return this._total;
  }

  /**
   * Get the amount paid on the invoice
   */
  get amountPaid(): Money {
    return this._amountPaid;
  }

  /**
   * Adds a line item to the invoice.
   * @param item The line item to add
   */
  addLineItem(item: LineItem): void {
    // Check if we need to convert currencies
    if (this._lineItems.length > 0 && item.unitPrice.currency !== this._total.currency) {
      throw new Error(`Cannot add line item with different currency: ${item.unitPrice.currency}`);
    }

    this._lineItems.push(item);
    this._total = this.calculateTotal();
    this.validateInvariants();
  }

  /**
   * Removes a line item from the invoice.
   * @param itemId The ID of the line item to remove
   */
  removeLineItem(itemId: LineItemId): void {
    const initialCount = this._lineItems.length;
    this._lineItems = this._lineItems.filter(item => item.lineItemId !== itemId);

    if (this._lineItems.length === initialCount) {
      throw new Error(`Line item with ID ${itemId} not found`);
    }

    this._total = this.calculateTotal();
    this.validateInvariants();
  }

  /**
   * Calculates the total amount of the invoice.
   * @returns The total as a Money object
   */
  calculateTotal(): Money {
    if (this._lineItems.length === 0) {
      return new Money(0, this._total ? this._total.currency : 'USD');
    }

    return this._lineItems.reduce(
      (total, item) => total.add(item.calculateLineTotal()),
      new Money(0, this._lineItems[0].unitPrice.currency)
    );
  }

  /**
   * Records a payment against the invoice.
   * @param payment The payment to record
   */
  recordPayment(payment: Payment): void {
    if (payment.invoiceId !== this.invoiceId) {
      throw new Error(`Payment is for invoice ${payment.invoiceId}, not ${this.invoiceId}`);
    }

    this._amountPaid = this._amountPaid.add(payment.amount);
    this.validateInvariants();
  }

  /**
   * Checks if the invoice is fully paid.
   * @returns True if the invoice is fully paid
   */
  isFullyPaid(): boolean {
    return this._amountPaid.amount >= this._total.amount;
  }

  /**
   * Validates the invariants of the invoice.
   * @throws Error if any invariant is violated
   */
  private validateInvariants(): void {
    // Validate that total equals the sum of line items
    const calculatedTotal = this.calculateTotal();
    if (!this._total.equals(calculatedTotal)) {
      this._total = calculatedTotal; // Fix the total
    }

    // Validate that amount paid is not greater than total
    if (this._amountPaid.amount > this._total.amount) {
      throw new Error('Amount paid cannot be greater than the total');
    }
  }
}
