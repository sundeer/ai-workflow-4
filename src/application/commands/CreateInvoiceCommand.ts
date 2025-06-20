import { CustomerId, ProductId } from '../../domain/types';

/**
 * Command for creating a new invoice
 */
export interface CreateInvoiceCommand {
  customerId: CustomerId;
  lineItems: Array<{
    productId: ProductId;
    quantity: number;
    unitPrice: string; // In format "100.00 USD"
  }>;
}
