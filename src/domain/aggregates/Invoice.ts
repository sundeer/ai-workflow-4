import { Money } from '../value-objects/Money';
import { LineItem } from '../entities/LineItem';
import type { LineItemId } from '../entities/LineItem';

export type InvoiceId = string;
export type CustomerId = string;

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid';

export class Invoice {
  private readonly _invoiceId: InvoiceId;
  private readonly _lineItems: Map<LineItemId, LineItem>;
  private _status: InvoiceStatus;
  private _amountPaid: Money;

  constructor(private readonly _customerId: CustomerId) {
    this._invoiceId = `INV-${Math.random().toString(36).substr(2, 9)}`;
    this._lineItems = new Map();
    this._status = 'Draft';
    this._amountPaid = Money.ZERO('USD'); // Default to USD
  }

  get invoiceId(): InvoiceId {
    return this._invoiceId;
  }

  get customerId(): CustomerId {
    return this._customerId;
  }

  get status(): InvoiceStatus {
    return this._status;
  }

  get lineItems(): LineItem[] {
    return Array.from(this._lineItems.values());
  }

  get amountPaid(): Money {
    return this._amountPaid;
  }

  addLineItem(item: LineItem): void {
    if (this._status !== 'Draft') {
      throw new Error('Can only add line items to draft invoices');
    }
    this._lineItems.set(item.lineItemId, item);
  }

  removeLineItem(itemId: LineItemId): void {
    if (this._status !== 'Draft') {
      throw new Error('Can only remove line items from draft invoices');
    }
    if (!this._lineItems.delete(itemId)) {
      throw new Error('Line item not found');
    }
  }

  calculateTotal(): Money {
    if (this._lineItems.size === 0) {
      return Money.ZERO('USD');
    }

    return Array.from(this._lineItems.values()).reduce(
      (total, item) => total.add(item.calculateLineTotal()),
      Money.ZERO('USD')
    );
  }

  recordPayment(amount: Money): void {
    if (this._status === 'Paid') {
      throw new Error('Invoice is already paid');
    }

    const newTotal = this._amountPaid.add(amount);
    if (newTotal.amount.greaterThan(this.calculateTotal().amount)) {
      throw new Error('Payment amount exceeds invoice total');
    }

    this._amountPaid = newTotal;
    if (this._amountPaid.equals(this.calculateTotal())) {
      this._status = 'Paid';
    }
  }

  issue(): void {
    if (this._status !== 'Draft') {
      throw new Error('Can only issue draft invoices');
    }
    if (this._lineItems.size === 0) {
      throw new Error('Cannot issue invoice with no line items');
    }
    this._status = 'Issued';
  }

  isFullyPaid(): boolean {
    return this._amountPaid.equals(this.calculateTotal());
  }
} 