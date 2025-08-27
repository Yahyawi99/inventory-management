import {
  Card,
  CardContent,
  PagePagination,
  TableSkeleton,
} from "app-core/src/components";
import Orders from "./Orders";
import { Order, Pagination } from "@/types/orders";

interface OrdersTableProps {
  orders: Order[];
  isFetchingOrders: boolean;
  currentPage: number;
  totalPages: number;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}

export default function OrdersTable({
  orders,
  isFetchingOrders,
  currentPage,
  totalPages,
  setPagination,
}: OrdersTableProps) {
  return (
    <Card className="w-full mx-auto rounded-lg shadow-lg border border-gray-200">
      <CardContent className="p-0">
        {!isFetchingOrders ? (
          orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No orders found for this organization.</p>
            </div>
          ) : (
            <>
              <Orders orders={orders} />

              <PagePagination
                currentPage={currentPage}
                totalPages={totalPages}
                setPagination={setPagination}
              />
            </>
          )
        ) : (
          <TableSkeleton />
        )}
      </CardContent>
    </Card>
  );
}
