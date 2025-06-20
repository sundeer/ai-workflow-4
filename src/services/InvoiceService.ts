import { Invoice, InvoiceId, CustomerId, InvoiceStatus } from '../domain/aggregates/Invoice';
import { LineItem, LineItemId, ProductId } from '../domain/entities/LineItem';
import { Money } from '../domain/valueObjects/Money';

/**
 * Input data for creating a line item
 */
export interface LineItemInput {
  productId: ProductId;
  quantity: number;
  unitPrice: string; // Format: "100.00 USD"
}

/**
 * Service for managing invoices
 */
export class InvoiceService {
  private nextInvoiceNumber = 1;
  private nextLineItemNumber = 1;
  private invoices: Map<InvoiceId, Invoice> = new Map();

  /**
   * Creates a new invoice for a customer with the given line items.
   * @param customerId The ID of the customer
   * @param lineItems The line items to add to the invoice
   * @returns The created invoice
   */
  createInvoice(customerId: CustomerId, lineItems: LineItemInput[] = []): Invoice {
    // Generate a new invoice ID
    const invoiceId = this.generateInvoiceId();

    // Convert line item inputs to LineItem objects
    const createdLineItems = lineItems.map(item => this.createLineItem(item));

    // Create the invoice
    const invoice = new Invoice(
      invoiceId,
      customerId,
      InvoiceStatus.Draft,
      createdLineItems
    );

    // Store the invoice
    this.invoices.set(invoiceId, invoice);

    return invoice;
  }

  /**
   * Retrieves an invoice by its ID.
   * @param invoiceId The ID of the invoice to retrieve
   * @returns The invoice, or undefined if not found
   */
  getInvoice(invoiceId: InvoiceId): Invoice | undefined {
    return this.invoices.get(invoiceId);
  }

  /**
   * Adds a line item to an existing invoice.
   * @param invoiceId The ID of the invoice
   * @param lineItemInput The line item to add
   * @returns The updated invoice
   */
  addLineItemToInvoice(invoiceId: InvoiceId, lineItemInput: LineItemInput): Invoice {
    const invoice = this.invoices.get(invoiceId);

    if (!invoice) {
      throw new Error(`Invoice with ID ${invoiceId} not found`);
    }

    const lineItem = this.createLineItem(lineItemInput);
    invoice.addLineItem(lineItem);

    return invoice;
  }

  /**
   * Creates a LineItem object from input data.
   * @param input The line item input data
   * @returns A new LineItem instance
   */
  private createLineItem(input: LineItemInput): LineItem {
    // Validate input
    if (input.quantity <= 0) {
      throw new Error('Line item quantity must be greater than 0');
    }

    // Generate a line item ID
    const lineItemId = this.generateLineItemId();

    // Parse the unit price
    const unitPrice = Money.fromString(input.unitPrice);

    return new LineItem(
      lineItemId,
      input.productId,
      input.quantity,
      unitPrice
    );
  }

  /**
   * Generates a unique invoice ID.
   * @returns A new invoice ID
   */
  private generateInvoiceId(): InvoiceId {
    const id = `INV-${String(this.nextInvoiceNumber).padStart(3, '0')}`;
    this.nextInvoiceNumber++;
    return id;
  }

  /**
   * Generates a unique line item ID.
   * @returns A new line item ID
   */
  private generateLineItemId(): LineItemId {
    const id = `ITEM-${String(this.nextLineItemNumber).padStart(3, '0')}`;
    this.nextLineItemNumber++;
    return id;
  }
}
