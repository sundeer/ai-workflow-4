import { Invoice } from '../aggregates/Invoice';
import { InvoiceId, CustomerId } from '../types';

/**
 * Repository interface for Invoice aggregate
 */
export interface InvoiceRepository {
  /**
   * Saves an invoice to the repository
   */
  save(invoice: Invoice): Promise<Invoice>;

  /**
   * Finds an invoice by its ID
   */
  findById(invoiceId: InvoiceId): Promise<Invoice | null>;

  /**
   * Finds all invoices for a specific customer
   */
  findByCustomerId(customerId: CustomerId): Promise<Invoice[]>;

  /**
   * Deletes an invoice by ID
   */
  delete(invoiceId: InvoiceId): Promise<boolean>;
}
