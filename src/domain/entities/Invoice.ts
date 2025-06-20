import { v4 as uuidv4 } from 'uuid';
import { LineItem } from './LineItem';
import { Money } from '../value-objects/Money';

export type InvoiceStatus = 'Draft' | 'Issued' | 'Paid' | 'Overdue' | 'Cancelled';

export class Invoice {
  private _lineItems: LineItem[] = [];
  private _total: Money = new Money(0);
  private _amountPaid: Money = new Money(0);
  private _status: InvoiceStatus = 'Draft';

  constructor(
    public readonly invoiceId: string,
    public readonly customerId: string,
    lineItems: LineItem[] = [],
    status: InvoiceStatus = 'Draft'
  ) {
    if (!customerId) {
      throw new Error('Customer ID is required');
    }
    
    this._status = status;
    lineItems.forEach(item => this.addLineItem(item));
  }

  get lineItems(): ReadonlyArray<LineItem> {
    return [...this._lineItems];
  }

  get total(): Money {
    return this._total;
  }

  get amountPaid(): Money {
    return this._amountPaid;
  }

  get status(): InvoiceStatus {
    return this._status;
  }

  get balanceDue(): Money {
    return new Money(
      Math.max(0, this._total.amount - this._amountPaid.amount),
      this._total.currency
    );
  }

  addLineItem(item: LineItem): void {
    this._lineItems.push(item);
    this._recalculateTotal();
  }

  removeLineItem(lineItemId: string): void {
    const initialLength = this._lineItems.length;
    this._lineItems = this._lineItems.filter(item => item.lineItemId !== lineItemId);
    
    if (this._lineItems.length !== initialLength) {
      this._recalculateTotal();
    }
  }

  recordPayment(amount: Money): void {
    if (this._status === 'Paid') {
      throw new Error('Cannot record payment on a paid invoice');
    }
    
    this._amountPaid = this._amountPaid.add(amount);
    
    if (this.balanceDue.amount === 0) {
      this._status = 'Paid';
    }
  }

  issue(): void {
    if (this._status !== 'Draft') {
      throw new Error('Only draft invoices can be issued');
    }
    
    if (this._lineItems.length === 0) {
      throw new Error('Cannot issue an invoice with no line items');
    }
    
    this._status = 'Issued';
  }

  private _recalculateTotal(): void {
    this._total = this._lineItems.reduce(
      (sum, item) => sum.add(item.calculateLineTotal()),
      new Money(0)
    );
  }

  static create(customerId: string, lineItems: LineItem[] = []): Invoice {
    return new Invoice(`INV-${uuidv4().substring(0, 8).toUpperCase()}`, customerId, lineItems);
  }
}
