import { Money } from '../value-objects/Money';

export type LineItemId = string;
export type ProductId = string;

export class LineItem {
  private readonly _lineItemId: LineItemId;

  constructor(
    private readonly _productId: ProductId,
    private readonly _quantity: number,
    private readonly _unitPrice: Money
  ) {
    if (_quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }
    this._lineItemId = `ITEM-${Math.random().toString(36).substr(2, 9)}`;
  }

  get lineItemId(): LineItemId {
    return this._lineItemId;
  }

  get productId(): ProductId {
    return this._productId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): Money {
    return this._unitPrice;
  }

  calculateLineTotal(): Money {
    return this._unitPrice.multiply(this._quantity);
  }
} 