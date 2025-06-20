export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string
  ) {
    if (amount < 0) {
      throw new Error('Amount must be non-negative');
    }
    if (!this.isValidCurrency(currency)) {
      throw new Error('Currency must be a valid ISO 4217 code');
    }
  }

  static fromString(value: string): Money {
    const match = value.match(/^(\d+\.?\d*)\s+([A-Z]{3})$/);
    if (!match) {
      throw new Error('Invalid money format. Expected format: "100.00 USD"');
    }
    return new Money(parseFloat(match[1]), match[2]);
  }

  add(other: Money): Money {
    this.ensureSameCurrency(other);
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    this.ensureSameCurrency(other);
    const result = this.amount - other.amount;
    if (result < 0) {
      throw new Error('Subtraction would result in negative amount');
    }
    return new Money(result, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('Factor must be non-negative');
    }
    return new Money(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }

  private ensureSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error(`Currency mismatch: ${this.currency} vs ${other.currency}`);
    }
  }

  private isValidCurrency(currency: string): boolean {
    // Simplified validation - in real app would use full ISO 4217 list
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];
    return validCurrencies.includes(currency);
  }
}