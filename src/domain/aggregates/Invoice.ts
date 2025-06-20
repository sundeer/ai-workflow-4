import { LineItem } from '../entities/LineItem';
import { Money } from '../value-objects/Money';

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Cancelled';

/**
 * Root entity representing an invoice lifecycle.
 */
export class Invoice {
  private _invoiceId: string;
  private _status: InvoiceStatus = 'Draft';
  private _lineItems: LineItem[] = [];
  private _total: Money;
  private _amountPaid: Money;

  constructor(
    private readonly _customerId: string,
  ) {
    // Generate a sequential invoice ID (simplified for demo)
    this._invoiceId = `INV-${Date.now().toString().slice(-6)}`;

    // Initialize with zero money values
    this._total = new Money(0, 'USD');
    this._amountPaid = new Money(0, 'USD');
  }

  get invoiceId(): string {
    return this._invoiceId;
  }

  get customerId(): string {
    return this._customerId;
  }

  get status(): InvoiceStatus {
    return this._status;
  }

  get lineItems(): LineItem[] {
    return [...this._lineItems]; // Return a copy to prevent direct modification
  }

  get total(): Money {
    return this._total;
  }

  /**
   * Adds a line item to the invoice and recalculates the total
   */
  addLineItem(item: LineItem): void {
    // Add the item
    this._lineItems.push(item);

    // Recalculate the total
    this.calculateTotal();
  }

  /**
   * Removes a line item by ID and recalculates the total
   */
  removeLineItem(lineItemId: string): void {
    const initialLength = this._lineItems.length;
    this._lineItems = this._lineItems.filter(item => item.lineItemId !== lineItemId);

    if (this._lineItems.length === initialLength) {
      throw new Error(`Line item with ID ${lineItemId} not found`);
    }

    // Recalculate the total
    this.calculateTotal();
  }

  /**
   * Calculates the total of all line items
   */
  calculateTotal(): Money {
    if (this._lineItems.length === 0) {
      this._total = new Money(0, 'USD');
      return this._total;
    }

    // Get the currency from the first line item
    const currency = this._lineItems[0].unitPrice.currency;
    let total = new Money(0, currency);

    // Sum all line totals
    for (const item of this._lineItems) {
      if (item.unitPrice.currency !== currency) {
        throw new Error('All line items must use the same currency');
      }
      total = total.add(item.calculateLineTotal());
    }

    this._total = total;
    return this._total;
  }

  /**
   * Records a payment against this invoice
   */
  recordPayment(payment: Money): void {
    if (this._status === 'Cancelled') {
      throw new Error('Cannot record payment for a cancelled invoice');
    }

    // Ensure the payment is in the same currency as the invoice
    if (payment.currency !== this._total.currency) {
      throw new Error(`Payment currency ${payment.currency} doesn't match invoice currency ${this._total.currency}`);
    }

    // Add the payment
    this._amountPaid = this._amountPaid.add(payment);

    // Check if fully paid
    if (this.isFullyPaid()) {
      this._status = 'Paid';
    } else if (this._status === 'Draft') {
      // If we've received a payment but the invoice is still in draft, move it to issued
      this._status = 'Issued';
    }
  }

  /**
   * Checks if the invoice is fully paid
   */
  isFullyPaid(): boolean {
    return this._amountPaid.equals(this._total);
  }
}
