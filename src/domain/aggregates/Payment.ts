import { InvoiceId, Invoice } from './Invoice';
import { Money } from '../valueObjects/Money';

/**
 * Unique identifier for a payment
 */
export type PaymentId = string;

/**
 * Records funds received against an invoice.
 */
export class Payment {
  constructor(
    public readonly paymentId: PaymentId,
    public readonly invoiceId: InvoiceId,
    public readonly amount: Money,
    public readonly date: Date
  ) {
    // Validate invariants
    if (amount.amount <= 0) {
      throw new Error('Payment amount must be greater than 0');
    }

    if (date > new Date()) {
      throw new Error('Payment date cannot be in the future');
    }
  }

  /**
   * Applies this payment to an invoice.
   * @param invoice The invoice to apply the payment to
   */
  applyToInvoice(invoice: Invoice): void {
    if (this.invoiceId !== invoice.invoiceId) {
      throw new Error(`Cannot apply payment for invoice ${this.invoiceId} to invoice ${invoice.invoiceId}`);
    }

    invoice.recordPayment(this);
  }
}
