/**
 * Money value object representing a monetary amount in a specific currency.
 */
export class Money {
  constructor(private readonly _amount: number, private readonly _currency: string) {
    if (_amount < 0) {
      throw new Error('Money amount cannot be negative');
    }

    // Simple validation for currency code (ISO 4217)
    if (!/^[A-Z]{3}$/.test(_currency)) {
      throw new Error('Currency must be a valid ISO 4217 code (3 uppercase letters)');
    }
  }

  get amount(): number {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  /**
   * Creates a Money object from a string format like "100.00 USD"
   */
  static fromString(moneyString: string): Money {
    const match = moneyString.match(/^(\d+\.?\d*) ([A-Z]{3})$/);
    if (!match) {
      throw new Error('Invalid money format. Expected format: "100.00 USD"');
    }

    const amount = parseFloat(match[1]);
    const currency = match[2];

    return new Money(amount, currency);
  }

  /**
   * Adds another Money object to this one
   */
  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this._amount + other.amount, this._currency);
  }

  /**
   * Subtracts another Money object from this one
   */
  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const result = this._amount - other.amount;
    if (result < 0) {
      throw new Error('Cannot subtract to a negative amount');
    }
    return new Money(result, this._currency);
  }

  /**
   * Multiplies the amount by a factor
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Cannot multiply by a negative factor');
    }
    return new Money(this._amount * factor, this._currency);
  }

  /**
   * Checks if this Money equals another Money object
   */
  equals(other: Money): boolean {
    return this._amount === other.amount && this._currency === other.currency;
  }

  /**
   * Returns a string representation like "100.00 USD"
   */
  toString(): string {
    return `${this._amount.toFixed(2)} ${this._currency}`;
  }

  private ensureSameCurrency(other: Money): void {
    if (this._currency !== other.currency) {
      throw new Error(`Cannot operate on different currencies: ${this._currency} and ${other.currency}`);
    }
  }
}
