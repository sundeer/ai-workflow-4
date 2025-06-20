import { Invoice } from '../../domain/aggregates/Invoice';
import { LineItem } from '../../domain/entities/LineItem';

interface InvoiceDetailsProps {
  invoice: Invoice;
}

export const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Invoice {invoice.invoiceId}</h2>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          {invoice.status}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Customer</p>
          <p className="font-medium">{invoice.customerId}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Amount</p>
          <p className="font-medium text-lg">{invoice.total.toString()}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Line Items</h3>

        <div className="border rounded overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 text-left text-sm font-medium text-gray-500">Product ID</th>
                <th className="p-2 text-left text-sm font-medium text-gray-500">Quantity</th>
                <th className="p-2 text-left text-sm font-medium text-gray-500">Unit Price</th>
                <th className="p-2 text-left text-sm font-medium text-gray-500">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoice.lineItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No line items added to this invoice yet.
                  </td>
                </tr>
              ) : (
                invoice.lineItems.map((item, index) => (
                  <tr key={item.lineItemId}>
                    <td className="p-2">{item.productId}</td>
                    <td className="p-2">{item.quantity}</td>
                    <td className="p-2">{item.unitPrice.toString()}</td>
                    <td className="p-2 font-medium">{item.calculateLineTotal().toString()}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="p-2 text-right font-medium">Total:</td>
                <td className="p-2 font-bold">{invoice.total.toString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
