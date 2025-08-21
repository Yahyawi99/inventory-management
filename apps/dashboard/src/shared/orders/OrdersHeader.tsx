import { Order } from "@/types/orders";
import { Button } from "@/components/ui/button";

interface Props {
  orders: Order[];
}

export default function OrdersHeader({ orders }: Props) {
  return (
    <div className="flex flex-wrap min-w-fit justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          className="flex items-center space-x-1 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-upload"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
          <span>Export</span>
        </Button>

        <Button
          variant="outline"
          className="flex items-center space-x-1 border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          <span>More actions</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-down"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </Button>

        <Button className="flex items-center space-x-1 px-4 py-2 bg-sidebar hover:bg-transparent text-white font-semibold rounded-md shadow cursor-pointer border-1 border-transparent hover:border-sidebar hover:text-sidebar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-plus"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          <span>Create order</span>
        </Button>
      </div>
    </div>
  );
}
