"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetch } from "@services/application/orders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OrderStatus, OrderType } from "@database/generated/prisma/client";
import OrdersFilters from "@/shared/orders/Filters";

// Define the Order type based DIRECTLY on your schema.prisma, including selected relations
interface Order {
  id: string;
  orderNumber?: string | null;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus; // This is the single source of truth for order status
  orderType: OrderType;
  createdAt: string;
  updatedAt: string;
  userId: string;
  organizationId: string;
  customerId: string | null;
  supplierId: string | null;
  // Relationships included by the API (assuming your /api/orders endpoint includes them)
  customer?: { name: string } | null; // From schema: Customer model has 'name'
  supplier?: { name: string } | null; // From schema: Supplier model has 'name'
  orderLines?: Array<{
    id: string;
    quantity: number;
    // You might include product details here if needed for deeper "Items" info
    // product?: { name: string; };
  }>;
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state for UI buttons
  const [activeFilter, setActiveFilter] = useState<string>("All");

  useEffect(() => {
    // Redirect if not authenticated after auth loading is complete
    if (!isAuthLoading && !isAuthenticated) {
      router.replace(`/en/auth/sign-in`);
      return;
    }

    const fetchOrdersData = async () => {
      if (!user || !user.activeOrganizationId) {
        setIsFetchingOrders(false);
        setError("User or organization ID not available.");
        return;
      }

      setIsFetchingOrders(true);
      setError(null);
      try {
        const response = await fetch("/orders");

        if (response.status !== 200) {
          throw new Error(
            response.data.message || "Failed to fetch orders from API."
          );
        }

        const data: Order[] = response.data.orders;
        setOrders(data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(
          err.message || "An unexpected error occurred while fetching orders."
        );
      } finally {
        setIsFetchingOrders(false);
      }
    };

    if (isAuthenticated && !isAuthLoading) {
      fetchOrdersData();
    }
  }, [isAuthenticated, isAuthLoading, user, router, activeFilter]);

  if (isAuthLoading || isFetchingOrders) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg">
        Loading...
      </div>
    );
  }

  // Display error if fetching failed after loading
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Helper to derive display text and color for "Payment" column from OrderStatus
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

  // Helper to derive display text for "Delivery" column from OrderStatus
  const getDeliveryStatusDisplay = (orderStatus: OrderStatus) => {
    switch (orderStatus) {
      case OrderStatus.Shipped:
        return "Shipped";
      case OrderStatus.Delivered:
        return "Delivered";
      case OrderStatus.Cancelled:
        return "Cancelled"; // Or 'N/A' if cancelled means no delivery attempt
      default:
        return "N/A"; // If Pending/Processing
    }
  };

  // Helper to derive display text and color for "Fulfillment" column from OrderStatus
  const getFulfillmentStatusDisplay = (orderStatus: OrderStatus) => {
    switch (orderStatus) {
      case OrderStatus.Pending:
      case OrderStatus.Processing:
        return { text: "Unfulfilled", colorClass: "bg-red-100 text-red-800" };
      case OrderStatus.Shipped:
      case OrderStatus.Delivered:
        return { text: "Fulfilled", colorClass: "bg-green-100 text-green-800" };
      case OrderStatus.Cancelled:
        return { text: "Cancelled", colorClass: "bg-gray-100 text-gray-800" };
      default:
        return { text: "N/A", colorClass: "bg-gray-100 text-gray-800" };
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

      {/* Filter buttons and search input */}
      <OrdersFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <Card className="w-full mx-auto rounded-lg shadow-lg border border-gray-200">
        <CardContent className="p-0">
          {/* Order Table */}
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No orders found for this organization.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
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
                <TableBody>
                  {orders.map((order) => (
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
                        {/* Derive Payment Status from order.status */}
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
                        {/* Derive Delivery Status from order.status */}
                        {getDeliveryStatusDisplay(order.status)}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {order.orderLines?.length === 1
                          ? "1 item"
                          : `${order.orderLines?.length || 0} items`}
                      </TableCell>
                      <TableCell>
                        {/* Derive Fulfillment Status from order.status */}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
