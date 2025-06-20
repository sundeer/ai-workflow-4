import { Money } from '../value-objects/Money.js';
import { LineItem } from '../entities/LineItem.js';

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid';

export class Invoice {
  private _lineItems: LineItem[] = [];
  private _total: Money;
  private _amountPaid: Money;
  private static _invoiceCounter = 1;

  constructor(
    public readonly invoiceId: string,
    public readonly customerId: string,
    public readonly status: InvoiceStatus = 'Draft',
    lineItems: LineItem[] = [],
    amountPaid?: Money
  ) {
    this._lineItems = [...lineItems];
    this._total = this.calculateTotal();
    this._amountPaid = amountPaid || new Money(0, this._total.currency || 'USD');
    
    // Validate invariants
    if (this._amountPaid.amount > this._total.amount) {
      throw new Error('Amount paid cannot exceed total');
    }
  }

  static create(customerId: string, lineItems: LineItem[] = []): Invoice {
    const invoiceId = `INV-${String(Invoice._invoiceCounter++).padStart(3, '0')}`;
    return new Invoice(invoiceId, customerId, 'Draft', lineItems);
  }

  get lineItems(): readonly LineItem[] {
    return this._lineItems;
  }

  get total(): Money {
    return this._total;
  }

  get amountPaid(): Money {
    return this._amountPaid;
  }

  addLineItem(item: LineItem): void {
    this._lineItems.push(item);
    this._total = this.calculateTotal();
  }

  removeLineItem(itemId: string): void {
    const index = this._lineItems.findIndex(item => item.lineItemId === itemId);
    if (index === -1) {
      throw new Error(`Line item with ID ${itemId} not found`);
    }
    this._lineItems.splice(index, 1);
    this._total = this.calculateTotal();
  }

  calculateTotal(): Money {
    if (this._lineItems.length === 0) {
      return new Money(0, 'USD');
    }

    const firstItemTotal = this._lineItems[0].calculateLineTotal();
    return this._lineItems.slice(1).reduce(
      (total, item) => total.add(item.calculateLineTotal()),
      firstItemTotal
    );
  }

  recordPayment(amount: Money): void {
    if (amount.amount <= 0) {
      throw new Error('Payment amount must be positive');
    }
    
    const newAmountPaid = this._amountPaid.add(amount);
    if (newAmountPaid.amount > this._total.amount) {
      throw new Error('Payment would exceed invoice total');
    }
    
    this._amountPaid = newAmountPaid;
  }

  isFullyPaid(): boolean {
    return this._amountPaid.equals(this._total);
  }
}