import { Calendar, CreditCard } from "lucide-react";
import { Badge } from "app-core/src/components";

export default function BillingDetails({ data }: { data: any }) {
  const {
    currentPlan,
    planPrice,
    billingPeriod,
    nextBillingDate,
    status,
    paymentMethod,
    invoices,
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
          <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
          Subscription Details
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-muted-foreground">
              Current Plan:
            </span>
            <span className="text-foreground">{currentPlan}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-muted-foreground">Price:</span>
            <span className="text-foreground">{planPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-muted-foreground">Status:</span>
            <Badge className="bg-green-200  text-green-700">{status}</Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-muted-foreground">
              Next Billing:
            </span>
            <div className="flex items-center text-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{nextBillingDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
          <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
          Payment Method
        </h3>
        <div className="flex items-center space-x-4 p-4 border border-accent  rounded-lg bg-gray-50 dark:bg-border">
          <img
            src={`https://placehold.co/48x30/FFFFFF/212121?text=${paymentMethod.cardType}`}
            alt={paymentMethod.cardType}
            className="h-8"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              {paymentMethod.cardType} ending in {paymentMethod.last4}
            </p>
            <p className="text-xs text-muted-foreground/60">Expires 12/26</p>
          </div>
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Edit
          </a>
        </div>
      </div>
    </div>
  );
}
