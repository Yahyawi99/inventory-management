import BillingDetails from "@/shared/account/billing/Details";
import InvoiceHistory from "@/shared/account/billing/InvoiceHistory";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
} from "app-core/src/components";

const mockBillingData = {
  currentPlan: "Pro Plan",
  planPrice: "$99/month",
  billingPeriod: "Monthly",
  nextBillingDate: "October 24, 2025",
  status: "Active",
  paymentMethod: {
    cardType: "Visa",
    last4: "4242",
  },
  invoices: [
    {
      id: "INV-2024-001",
      description: "Pro Plan Subscription for September",
      date: "September 24, 2025",
      amount: "$99.00",
      status: "Paid",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-002",
      description: "Pro Plan Subscription for August",
      date: "August 24, 2025",
      amount: "$99.00",
      status: "Paid",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-003",
      description: "Pro Plan Subscription for July",
      date: "July 24, 2025",
      amount: "$99.00",
      status: "Paid",
      downloadUrl: "#",
    },
    {
      id: "INV-2024-004",
      description: "Pro Plan Subscription for June",
      date: "June 24, 2025",
      amount: "$99.00",
      status: "Paid",
      downloadUrl: "#",
    },
  ],
};

export default function Page() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-900">
            Billing & Subscriptions
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Manage your plan, update payment details, and view your invoice
            history.{" "}
          </p>
        </div>

        <Card className="p-6">
          <BillingDetails data={mockBillingData} />

          <Separator className="my-6" />

          <InvoiceHistory data={mockBillingData} />
        </Card>
      </div>
    </div>
  );
}
