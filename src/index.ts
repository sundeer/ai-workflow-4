import { InvoiceApplicationService } from './application/services/InvoiceApplicationService';
import { InMemoryInvoiceRepository } from './infrastructure/repositories/InMemoryInvoiceRepository';

/**
 * Main application entry point
 */
const startApp = async () => {
  // Set up repositories
  const invoiceRepository = new InMemoryInvoiceRepository();

  // Set up application services
  const invoiceService = new InvoiceApplicationService(invoiceRepository);

  // Example usage
  const invoice = await invoiceService.createInvoice({
    customerId: 'CUST-123',
    lineItems: [
      { productId: 'PROD-001', quantity: 2, unitPrice: '50.00 USD' },
      { productId: 'PROD-002', quantity: 1, unitPrice: '100.00 USD' }
    ]
  });

  console.log(`Created invoice ${invoice.invoiceId} with total ${invoice.total.toString()}`);
};

// Only start the app if this file is executed directly
if (require.main === module) {
  startApp().catch(console.error);
}
