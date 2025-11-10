import { FileText, CheckCircle, ArrowDown } from "lucide-react";

export default function InvoiceHistory({ data }: { data: any }) {
  const { invoices } = data;

  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
        Invoice History
      </h3>
      <div className="border border-border rounded-lg">
        <div className="grid grid-cols-6 p-4 font-medium text-muted-foreground bg-gray-50 dark:bg-muted rounded-t-lg text-sm ">
          <div className="col-span-1">Invoice</div>
          <div className="col-span-2">Description</div>
          <div>Date</div>
          <div className="text-center">Amount</div>
          <div className="text-center">Actions</div>
        </div>

        {invoices.map((invoice: any, index: number) => (
          <div
            key={index}
            className="grid grid-cols-6 items-center p-4 border-t border-border last:border-b-0 text-sm hover:bg-gray-50 dark:hover:bg-border transition-colors"
          >
            <div className="col-span-1 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-foreground font-medium">{invoice.id}</span>
            </div>

            <div className="col-span-2 text-muted-foreground">
              {invoice.description}
            </div>

            <div className="text-muted-foreground">{invoice.date}</div>

            <div className="text-card-foreground text-center">
              {invoice.amount}
            </div>

            <div className="flex justify-center">
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
