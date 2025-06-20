/**
 * Represents a monetary amount in a specific currency.
 */
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {
    // Validate invariants
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }

    if (!this.isValidCurrency(currency)) {
      throw new Error(`Invalid currency code: ${currency}`);
    }
  }

  /**
   * Adds another money object to this one.
   * @param other The money object to add
   * @returns A new Money object with the sum
   */
  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  /**
   * Subtracts another money object from this one.
   * @param other The money object to subtract
   * @returns A new Money object with the difference
   */
  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Cannot subtract to a negative amount');
    }
    return new Money(result, this.currency);
  }

  /**
   * Multiplies this money amount by a factor.
   * @param factor The multiplication factor
   * @returns A new Money object with the product
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Cannot multiply by a negative factor');
    }
    return new Money(this.amount * factor, this.currency);
  }

  /**
   * Checks if this money object equals another.
   * @param other The money object to compare
   * @returns True if they are equal
   */
  equals(other: Money): boolean {
    return this.currency === other.currency && this.amount === other.amount;
  }

  /**
   * Returns the string representation of the money amount.
   * @returns Formatted string like "100.00 USD"
   */
  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }

  /**
   * Creates a Money instance from a string representation.
   * @param value String in format "100.00 USD"
   * @returns A new Money instance
   */
  static fromString(value: string): Money {
    const parts = value.split(' ');
    if (parts.length !== 2) {
      throw new Error('Invalid money string format. Expected "100.00 USD"');
    }

    const amount = parseFloat(parts[0]);
    const currency = parts[1];

    return new Money(amount, currency);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Cannot operate on different currencies: ${this.currency} and ${other.currency}`);
    }
  }

  private isValidCurrency(code: string): boolean {
    // Basic validation - in a real app, would validate against ISO 4217
    return /^[A-Z]{3}$/.test(code);
  }
}
