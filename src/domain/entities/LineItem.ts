import { Money } from '../value-objects/Money';

export class LineItem {
  constructor(
    public readonly lineItemId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: Money
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    if (!productId) {
      throw new Error('Product ID is required');
    }
  }

  calculateLineTotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }
}
