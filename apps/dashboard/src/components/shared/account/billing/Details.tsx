import { Badge, Calendar, CreditCard } from "lucide-react";

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
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
          Subscription Details
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600">Current Plan:</span>
            <span className="text-gray-800">{currentPlan}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600">Price:</span>
            <span className="text-gray-800">{planPrice}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600">Status:</span>
            <Badge className="bg-green-100 text-green-700">{status}</Badge>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-gray-600">Next Billing:</span>
            <div className="flex items-center text-gray-800">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{nextBillingDate}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
          Payment Method
        </h3>
        <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <img
            src={`https://placehold.co/48x30/FFFFFF/212121?text=${paymentMethod.cardType}`}
            alt={paymentMethod.cardType}
            className="h-8"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {paymentMethod.cardType} ending in {paymentMethod.last4}
            </p>
            <p className="text-xs text-gray-500">Expires 12/26</p>
          </div>
          <a href="#" className="text-sm text-blue-500 hover:underline">
            Edit
          </a>
        </div>
      </div>
    </div>
  );
}
