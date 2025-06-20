import { useState } from 'react';
import { InvoiceService, LineItemInput } from '../../services/InvoiceService';
import { Money } from '../../domain/valueObjects/Money';

interface LineItemFormData {
  productId: string;
  quantity: string;
  unitPrice: string;
}

interface InvoiceFormProps {
  invoiceService: InvoiceService;
  onInvoiceCreated: (invoiceId: string) => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ 
  invoiceService, 
  onInvoiceCreated 
}) => {
  const [customerId, setCustomerId] = useState('');
  const [lineItems, setLineItems] = useState<LineItemFormData[]>([{ 
    productId: '', 
    quantity: '', 
    unitPrice: '' 
  }]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const addLineItem = () => {
    setLineItems([...lineItems, { productId: '', quantity: '', unitPrice: '' }]);
  };

  const removeLineItem = (index: number) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems.splice(index, 1);
    setLineItems(updatedLineItems);
  };

  const updateLineItem = (index: number, field: keyof LineItemFormData, value: string) => {
    const updatedLineItems = [...lineItems];
    updatedLineItems[index] = { ...updatedLineItems[index], [field]: value };
    setLineItems(updatedLineItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Validate customer ID
      if (!customerId) {
        setError('Customer ID is required');
        return;
      }

      // Validate line items
      if (lineItems.length === 0) {
        setError('At least one line item is required');
        return;
      }

      // Convert form data to service input
      const lineItemInputs: LineItemInput[] = [];

      for (const item of lineItems) {
        // Validate product ID
        if (!item.productId) {
          setError('Product ID is required for all line items');
          return;
        }

        // Validate quantity
        const quantity = parseFloat(item.quantity);
        if (isNaN(quantity) || quantity <= 0) {
          setError('Quantity must be a positive number');
          return;
        }

        // Validate unit price
        const unitPriceValue = parseFloat(item.unitPrice);
        if (isNaN(unitPriceValue) || unitPriceValue < 0) {
          setError('Unit price must be a valid number');
          return;
        }

        // Format unit price to include currency
        const unitPrice = `${unitPriceValue.toFixed(2)} USD`;

        lineItemInputs.push({
          productId: item.productId,
          quantity,
          unitPrice,
        });
      }

      // Create the invoice
      const invoice = invoiceService.createInvoice(customerId, lineItemInputs);

      // Show success message
      setSuccess(`Invoice ${invoice.invoiceId} created successfully with total ${invoice.total.toString()}`);

      // Reset form
      setCustomerId('');
      setLineItems([{ productId: '', quantity: '', unitPrice: '' }]);

      // Notify parent component
      onInvoiceCreated(invoice.invoiceId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New Invoice</h2>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="customerId" className="block mb-1 font-medium">
            Customer ID
          </label>
          <input
            type="text"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. CUST-123"
          />
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2">Line Items</h3>

          {lineItems.map((item, index) => (
            <div key={index} className="p-3 mb-3 border rounded bg-gray-50">
              <div className="grid grid-cols-3 gap-3 mb-2">
                <div>
                  <label className="block mb-1 text-sm">Product ID</label>
                  <input
                    type="text"
                    value={item.productId}
                    onChange={(e) => updateLineItem(index, 'productId', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. PROD-001"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Quantity</label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. 2"
                    min="1"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Unit Price (USD)</label>
                  <input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(index, 'unitPrice', e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. 50.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {lineItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLineItem(index)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addLineItem}
            className="p-2 bg-blue-50 text-blue-600 rounded text-sm"
          >
            + Add Line Item
          </button>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Invoice
          </button>
        </div>
      </form>
    </div>
  );
};
