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
import { getOrderStatusDisplay } from "@/utils/getOrderStatusDisplay";

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

            <TableHead className="px-4 py-3 text-gray-700 font-medium text-center">
              Order
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium text-center">
              Date
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium text-center">
              Customer
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium text-center">
              Supplier
            </TableHead>

            <TableHead className="px-4 py-3 text-right text-gray-700 font-medium text-center">
              Status
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium text-center">
              Items
            </TableHead>

            <TableHead className="px-4 py-3 text-gray-700 font-medium text-center">
              Total
            </TableHead>

            <TableHead className="w-[100px] px-4 py-3 text-gray-700 font-medium text-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        {isAuthLoading || isFetchingOrders ? (
          <TableBody>
            <TableRow>
              <TableCell
                className="px-4 py-3 text-lg text-center pointer-events-none"
                colSpan={9} // Updated colSpan to match actual columns
              >
                Loading...
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            {orders.map((order) => {
              const statusDisplay = getOrderStatusDisplay(order.status);

              return (
                <TableRow
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <TableCell className="text-center px-4 py-3">
                    <Input
                      type="checkbox"
                      className="h-4 w-4 rounded-sm border-gray-300"
                    />
                  </TableCell>

                  <TableCell className="text-center font-medium text-gray-900">
                    {order.orderNumber || "N/A"}
                  </TableCell>

                  <TableCell className="text-center text-gray-700">
                    {new Date(order.orderDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </TableCell>

                  <TableCell className="text-center text-gray-700">
                    {order.customer?.name || "N/A"}
                  </TableCell>

                  <TableCell className="text-center text-gray-700">
                    {order.supplier?.name || "N/A"}
                  </TableCell>

                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.colorClass}`}
                    >
                      {statusDisplay.text}
                    </span>
                  </TableCell>

                  <TableCell className="text-center text-gray-700">
                    {order.orderLines?.length === 1
                      ? "1 item"
                      : `${order.orderLines?.length || 0} items`}
                  </TableCell>

                  <TableCell className="text-center font-medium text-gray-900">
                    ${order.totalAmount.toFixed(2)}
                  </TableCell>

                  <TableCell className="text-center px-4 py-3 ">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-500 hover:text-green-700"
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
                        className="h-8 w-8 text-red-500 hover:text-red-700"
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
