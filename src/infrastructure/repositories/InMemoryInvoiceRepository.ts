import { Invoice } from '../../domain/aggregates/Invoice';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { InvoiceId, CustomerId } from '../../domain/types';

/**
 * In-memory implementation of the Invoice repository
 * This is useful for testing and prototyping
 */
export class InMemoryInvoiceRepository implements InvoiceRepository {
  private invoices: Map<InvoiceId, Invoice> = new Map();

  async save(invoice: Invoice): Promise<Invoice> {
    this.invoices.set(invoice.invoiceId, invoice);
    return invoice;
  }

  async findById(invoiceId: InvoiceId): Promise<Invoice | null> {
    const invoice = this.invoices.get(invoiceId);
    return invoice || null;
  }

  async findByCustomerId(customerId: CustomerId): Promise<Invoice[]> {
    return Array.from(this.invoices.values())
      .filter(invoice => invoice.customerId === customerId);
  }

  async delete(invoiceId: InvoiceId): Promise<boolean> {
    return this.invoices.delete(invoiceId);
  }
}
