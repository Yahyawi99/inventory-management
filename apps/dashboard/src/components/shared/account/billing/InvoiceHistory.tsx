import { FileText, CheckCircle, ArrowDown } from "lucide-react";

export default function InvoiceHistory({ data }: { data: any }) {
  const { invoices } = data;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
        <FileText className="h-5 w-5 mr-2 text-gray-600" />
        Invoice History
      </h3>
      <div className="border border-gray-200 rounded-lg">
        <div className="grid grid-cols-5 p-4 font-medium text-gray-600 bg-gray-50 rounded-t-lg text-sm">
          <div className="col-span-1">Invoice</div>
          <div className="col-span-2">Description</div>
          <div>Date</div>
          <div>Amount</div>
        </div>
        {invoices.map((invoice: any, index: number) => (
          <div
            key={index}
            className="grid grid-cols-5 items-center p-4 border-t border-gray-200 last:border-b-0 text-sm hover:bg-gray-50 transition-colors"
          >
            <div className="col-span-1 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-800 font-medium">{invoice.id}</span>
            </div>
            <div className="col-span-2 text-gray-600">
              {invoice.description}
            </div>
            <div className="text-gray-600">{invoice.date}</div>
            <div className="text-gray-800">{invoice.amount}</div>
            <div className="flex justify-end">
              <a
                href={invoice.downloadUrl}
                className="text-blue-500 hover:underline flex items-center text-xs"
              >
                <ArrowDown className="h-4 w-4 mr-1" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
