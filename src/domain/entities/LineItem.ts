import { Money } from '../value-objects/Money';

/**
 * Represents a single line on an invoice.
 */
export class LineItem {
  private _lineItemId: string;

  constructor(
    private readonly _productId: string,
    private readonly _quantity: number,
    private readonly _unitPrice: Money
  ) {
    // Validate quantity is positive
    if (_quantity <= 0) {
      throw new Error('Line item quantity must be positive');
    }

    // Generate a unique ID for the line item
    this._lineItemId = `LI-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  get lineItemId(): string {
    return this._lineItemId;
  }

  get productId(): string {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  /**
   * Calculates the total for this line item (quantity × unitPrice)
   */
  calculateLineTotal(): Money {
    return this._unitPrice.multiply(this._quantity);
  }
}
