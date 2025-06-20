import { Invoice, type InvoiceStatus } from '../entities/Invoice';
import { LineItem } from '../entities/LineItem';
import { Money } from '../value-objects/Money';

export class InvoiceService {
  createInvoice(customerId: string, lineItems: Array<{
    productId: string;
    quantity: number;
    unitPrice: string; // Format: "100.00 USD"
  }>): Invoice {
    const lineItemEntities = lineItems.map(
      (item, index) => new LineItem(
        `ITEM-${index + 1}`,
        item.productId,
        item.quantity,
        Money.fromString(item.unitPrice)
      )
    );

    return Invoice.create(customerId, lineItemEntities);
  }

  addLineItem(
    invoice: Invoice,
    productId: string,
    quantity: number,
    unitPrice: string
  ): void {
    if (invoice.status !== 'Draft') {
      throw new Error('Can only add line items to draft invoices');
    }

    const lineItem = new LineItem(
      `ITEM-${invoice.lineItems.length + 1}`,
      productId,
      quantity,
      Money.fromString(unitPrice)
    );

    invoice.addLineItem(lineItem);
  }

  // Other service methods can be added here as needed
  // e.g., issueInvoice, recordPayment, etc.
}
