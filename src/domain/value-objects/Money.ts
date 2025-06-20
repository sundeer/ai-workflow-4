export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'USD'
  ) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!Number.isFinite(amount)) {
      throw new Error('Invalid money amount');
    }
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add money with different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(multiplier: number): Money {
    return new Money(this.amount * multiplier, this.currency);
  }

  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`;
  }

  static fromString(value: string): Money {
    const [amountStr, currency = 'USD'] = value.split(' ');
    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      throw new Error('Invalid money format');
    }
    return new Money(amount, currency);
  }
}
