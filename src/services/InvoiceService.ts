import { Invoice } from '../domain/aggregates/Invoice';
import { LineItem } from '../entities/LineItem';
import { Money } from '../value-objects/Money';

/**
 * Service for managing invoice operations
 */
export class InvoiceService {
  // This would typically interface with a repository/database
  private invoices: Map<string, Invoice> = new Map();

  /**
   * Creates a new invoice for a customer
   */
  createInvoice(customerId: string, lineItems?: Array<{ productId: string, quantity: number, unitPrice: string }>): Invoice {
    // In a real system, we'd validate the customer exists first
    const invoice = new Invoice(customerId);

    // Add any line items if provided
    if (lineItems && lineItems.length > 0) {
      for (const item of lineItems) {
        const lineItem = new LineItem(
          item.productId,
          item.quantity,
          Money.fromString(item.unitPrice)
        );
        invoice.addLineItem(lineItem);
      }
    }

    // Store the invoice
    this.invoices.set(invoice.invoiceId, invoice);

    return invoice;
  }

  /**
   * Retrieves an invoice by ID
   */
  getInvoice(invoiceId: string): Invoice | undefined {
    return this.invoices.get(invoiceId);
  }

  /**
   * Adds a line item to an existing invoice
   */
  addLineItem(invoiceId: string, productId: string, quantity: number, unitPrice: string): Invoice {
    const invoice = this.getInvoice(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    const lineItem = new LineItem(
      productId,
      quantity,
      Money.fromString(unitPrice)
    );

    invoice.addLineItem(lineItem);
    return invoice;
  }
}
