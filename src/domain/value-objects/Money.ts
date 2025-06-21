import { Decimal } from 'decimal.js';

export class Money {
  private constructor(
    private readonly _amount: Decimal,
    private readonly _currency: string
  ) {
    if (_amount.isNegative()) {
      throw new Error('Amount cannot be negative');
    }
    if (!Money.isValidCurrency(_currency)) {
      throw new Error('Invalid currency code');
    }
  }

  static fromString(value: string): Money {
    const parts = value.split(' ');
    if (parts.length !== 2) {
      throw new Error('Invalid money format. Expected "amount currency"');
    }
    return new Money(new Decimal(parts[0]), parts[1]);
  }

  static fromNumber(amount: number, currency: string): Money {
    return new Money(new Decimal(amount), currency);
  }

  static ZERO(currency: string): Money {
    return new Money(new Decimal(0), currency);
  }

  get amount(): Decimal {
    return this._amount;
  }

  get currency(): string {
    return this._currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount.plus(other._amount), this._currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this._amount.minus(other._amount), this._currency);
  }

  multiply(factor: number): Money {
    return new Money(this._amount.times(factor), this._currency);
  }

  equals(other: Money): boolean {
    return this._currency === other._currency && this._amount.equals(other._amount);
  }

  toString(): string {
    return `${this._amount.toFixed(2)} ${this._currency}`;
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new Error('Cannot operate on money with different currencies');
    }
  }

  private static isValidCurrency(code: string): boolean {
    // Simple validation - in real app would use a proper currency code list
    return /^[A-Z]{3}$/.test(code);
  }
} 