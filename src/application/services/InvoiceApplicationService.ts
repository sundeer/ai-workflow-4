import { Invoice } from '../../domain/aggregates/Invoice';
import { LineItem } from '../../domain/entities/LineItem';
import { InvoiceRepository } from '../../domain/repositories/InvoiceRepository';
import { InvoiceId, CustomerId, ProductId } from '../../domain/types';
import { Money } from '../../domain/value-objects/Money';
import { CreateInvoiceCommand } from '../commands/CreateInvoiceCommand';

/**
 * Application service for invoice operations
 */
export class InvoiceApplicationService {
  constructor(private invoiceRepository: InvoiceRepository) {}

  /**
   * Creates a new invoice based on the command
   */
  async createInvoice(command: CreateInvoiceCommand): Promise<Invoice> {
    // Create a new invoice for the customer
    const invoice = new Invoice(command.customerId);

    // Add line items
    for (const item of command.lineItems) {
      const lineItem = new LineItem(
        item.productId,
        item.quantity,
        Money.fromString(item.unitPrice)
      );
      invoice.addLineItem(lineItem);
    }

    // Save to repository
    return this.invoiceRepository.save(invoice);
  }

  /**
   * Adds a line item to an existing invoice
   */
  async addLineItem(
    invoiceId: InvoiceId,
    productId: ProductId,
    quantity: number,
    unitPrice: string
  ): Promise<Invoice> {
    // Find the invoice
    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    // Create and add the line item
    const lineItem = new LineItem(productId, quantity, Money.fromString(unitPrice));
    invoice.addLineItem(lineItem);

    // Save the updated invoice
    return this.invoiceRepository.save(invoice);
  }

  /**
   * Gets an invoice by ID
   */
  async getInvoice(invoiceId: InvoiceId): Promise<Invoice | null> {
    return this.invoiceRepository.findById(invoiceId);
  }

  /**
   * Gets all invoices for a customer
   */
  async getInvoicesForCustomer(customerId: CustomerId): Promise<Invoice[]> {
    return this.invoiceRepository.findByCustomerId(customerId);
  }
}
