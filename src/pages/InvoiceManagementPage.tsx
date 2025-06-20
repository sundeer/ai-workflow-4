import { useState, useEffect } from 'react';
import { InvoiceService } from '../services/InvoiceService';
import { InvoiceForm } from '../components/invoices/InvoiceForm';
import { InvoiceDetails } from '../components/invoices/InvoiceDetails';
import { AddLineItemForm } from '../components/invoices/AddLineItemForm';
import { Invoice, InvoiceId } from '../domain/aggregates/Invoice';

// Create a singleton invoice service
const invoiceService = new InvoiceService();

export const InvoiceManagementPage: React.FC = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<InvoiceId | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [refresh, setRefresh] = useState(0); // Used to trigger re-renders

  // Effect to load the selected invoice
  useEffect(() => {
    if (selectedInvoiceId) {
      const invoice = invoiceService.getInvoice(selectedInvoiceId);
      setSelectedInvoice(invoice || null);
    } else {
      setSelectedInvoice(null);
    }
  }, [selectedInvoiceId, refresh]);

  // Handler for when an invoice is created
  const handleInvoiceCreated = (invoiceId: InvoiceId) => {
    setSelectedInvoiceId(invoiceId);
  };

  // Handler for when a line item is added
  const handleLineItemAdded = () => {
    setRefresh(prev => prev + 1); // Trigger a refresh
  };

  // Handler to go back to the form
  const handleBackToForm = () => {
    setSelectedInvoiceId(null);
    setSelectedInvoice(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">🧾 Invoice Management</h1>
        <p className="text-gray-600 mt-2">
          Create and manage invoices for your customers
        </p>
      </header>

      {selectedInvoice ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackToForm}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              ← Back to Invoice Form
            </button>
          </div>

          <InvoiceDetails invoice={selectedInvoice} />

          <AddLineItemForm
            invoiceId={selectedInvoice.invoiceId}
            invoiceService={invoiceService}
            onLineItemAdded={handleLineItemAdded}
          />
        </div>
      ) : (
        <InvoiceForm 
          invoiceService={invoiceService} 
          onInvoiceCreated={handleInvoiceCreated} 
        />
      )}
    </div>
  );
};
