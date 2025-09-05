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
    <div className="grid gap-6">
      <Card className="p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold">
            Billing & Subscriptions
          </CardTitle>
          <CardDescription className="text-sm text-gray-500 mt-2">
            Manage your plan, update payment details, and view your invoice
            history.
          </CardDescription>
        </CardHeader>

        <Separator className="my-6" />

        <BillingDetails data={mockBillingData} />

        <Separator className="my-6" />

        <InvoiceHistory data={mockBillingData} />
      </Card>
    </div>
  );
}
