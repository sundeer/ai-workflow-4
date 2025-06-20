import { useState } from 'react';
import { InvoiceService } from '../../services/InvoiceService';
import { InvoiceId } from '../../domain/aggregates/Invoice';

interface AddLineItemFormProps {
  invoiceId: InvoiceId;
  invoiceService: InvoiceService;
  onLineItemAdded: () => void;
}

export const AddLineItemForm: React.FC<AddLineItemFormProps> = ({ 
  invoiceId, 
  invoiceService, 
  onLineItemAdded 
}) => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Validate inputs
      if (!productId) {
        setError('Product ID is required');
        return;
      }

      const quantityValue = parseFloat(quantity);
      if (isNaN(quantityValue) || quantityValue <= 0) {
        setError('Quantity must be a positive number');
        return;
      }

      const unitPriceValue = parseFloat(unitPrice);
      if (isNaN(unitPriceValue) || unitPriceValue < 0) {
        setError('Unit price must be a valid number');
        return;
      }

      // Format unit price
      const formattedUnitPrice = `${unitPriceValue.toFixed(2)} USD`;

      // Add the line item
      invoiceService.addLineItemToInvoice(invoiceId, {
        productId,
        quantity: quantityValue,
        unitPrice: formattedUnitPrice
      });

      // Reset form
      setProductId('');
      setQuantity('');
      setUnitPrice('');

      // Notify parent
      onLineItemAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-medium mb-4">Add Line Item to Invoice {invoiceId}</h3>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4">
        <div>
          <label className="block mb-1 text-sm">Product ID</label>
          <input
            type="text"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g. PROD-003"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border rounded"
            min="1"
            step="1"
            placeholder="e.g. 3"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm">Unit Price (USD)</label>
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            className="w-full p-2 border rounded"
            min="0"
            step="0.01"
            placeholder="e.g. 25.00"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Line Item
          </button>
        </div>
      </form>
    </div>
  );
};
