import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Order } from "@/types/orders";
import { OrderStatus, OrderType } from "@database/generated/prisma/client";

interface Props {
  orders: Order[];
  isAuthLoading: boolean;
  isFetchingOrders: boolean;
}

export default function Orders({
  orders,
  isAuthLoading,
  isFetchingOrders,
}: Props) {
  const getPaymentStatusDisplay = (orderStatus: OrderStatus) => {
    switch (orderStatus) {
      case OrderStatus.Pending:
      case OrderStatus.Processing:
        return { text: "Pending", colorClass: "bg-yellow-100 text-yellow-800" };
      case OrderStatus.Shipped:
      case OrderStatus.Delivered:
        return { text: "Success", colorClass: "bg-green-100 text-green-800" };
      case OrderStatus.Cancelled:
        return { text: "Cancelled", colorClass: "bg-red-100 text-red-800" };
      default:
        return { text: "N/A", colorClass: "bg-gray-100 text-gray-800" };
    }
  };

  const getDeliveryStatusDisplay = (orderStatus: OrderStatus) => {
    switch (orderStatus) {
      case OrderStatus.Shipped:
        return "Shipped";
      case OrderStatus.Delivered:
        return "Delivered";
      case OrderStatus.Cancelled:
        return "Cancelled";
      default:
        return "N/A";
    }
  };

  const getFulfillmentStatusDisplay = (orderStatus: OrderStatus) => {
    switch (orderStatus) {
      case OrderStatus.Pending:
      case OrderStatus.Processing:
        return { text: "Unfulfilled", colorClass: "bg-red-100 text-red-800" };
      case OrderStatus.Shipped:
      case OrderStatus.Delivered:
        return {
          text: "Fulfilled",
          colorClass: "bg-green-100 text-green-800",
        };
      case OrderStatus.Cancelled:
        return { text: "Cancelled", colorClass: "bg-gray-100 text-gray-800" };
      default:
        return { text: "N/A", colorClass: "bg-gray-100 text-gray-800" };
    }
  };
  return (
    <div className="overflow-x-auto ">
      <Table>
        <TableHeader className="bg-gray-100">
          <TableRow className="border-b border-gray-200">
            <TableHead className="w-[50px] px-4 py-3">
              <Input
                type="checkbox"
                className="h-4 w-4 rounded-sm border-gray-300"
              />
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium">
              Order
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium">
              Date
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium">
              Customer
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium">
              Payment
            </TableHead>

            <TableHead className="px-4 py-3 text-right text-gray-700 font-medium">
              Total
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium">
              Delivery
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium">
              Items
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium">
              Fulfillment
            </TableHead>

            <TableHead className="w-[100px] px-4 py-3 text-gray-700 font-medium">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        {isAuthLoading || isFetchingOrders ? (
          <TableBody>
            <TableRow>
              <TableCell
                className="px-4 py-3 text-lg text-center pointer-events-none"
                colSpan={10}
              >
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {orders.map((order) => {
              return (
                <TableRow
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="px-4 py-3">
                    <Input
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-gray-300"
                    />
                  </TableCell>

                  <TableCell className="font-medium text-gray-900">
                    {order.orderNumber || "N/A"}
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {order.orderType === OrderType.SALES
                      ? order.customer?.name || "N/A"
                      : order.supplier?.name || "N/A"}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getPaymentStatusDisplay(order.status).colorClass
                      }`}
                    >
                      {getPaymentStatusDisplay(order.status).text}
                    </span>
                  </TableCell>

                  <TableCell className="text-right font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {getDeliveryStatusDisplay(order.status)}
                  </TableCell>

                  <TableCell className="text-gray-700">
                    {order.orderLines?.length === 1
                      ? "1 item"
                      : `${order.orderLines?.length || 0} items`}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        getFulfillmentStatusDisplay(order.status).colorClass
                      }`}
                    >
                      {getFulfillmentStatusDisplay(order.status).text}
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-700">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
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
                          className="lucide lucide-edit"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                        </svg>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-gray-700"
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
                          className="lucide lucide-trash-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        )}
      </Table>
    </div>
  );
}
