import { Money } from '../value-objects/Money.js';

export class LineItem {
  constructor(
    public readonly lineItemId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: Money
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (unitPrice.amount < 0) {
      throw new Error('Unit price must be non-negative');
    }
  }

  calculateLineTotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  static create(productId: string, quantity: number, unitPrice: Money): LineItem {
    const lineItemId = `LINE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return new LineItem(lineItemId, productId, quantity, unitPrice);
  }
}