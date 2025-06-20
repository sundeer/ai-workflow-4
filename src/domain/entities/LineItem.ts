import { Money } from '../valueObjects/Money';

/**
 * Unique identifier for a line item
 */
export type LineItemId = string;

/**
 * Unique identifier for a product
 */
export type ProductId = string;

/**
 * Represents a single line on an invoice.
 */
export class LineItem {
  constructor(
    public readonly lineItemId: LineItemId,
    public readonly productId: ProductId,
    public readonly quantity: number,
    public readonly unitPrice: Money
  ) {
    // Validate invariants
    if (quantity <= 0) {
      throw new Error('Line item quantity must be greater than 0');
    }

    if (unitPrice.amount < 0) {
      throw new Error('Unit price cannot be negative');
    }
  }

  /**
   * Calculates the total amount for this line item.
   * @returns The total as a Money object
   */
  calculateLineTotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }
}
