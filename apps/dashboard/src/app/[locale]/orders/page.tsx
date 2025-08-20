"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OrderStatus, OrderType } from "@database/generated/prisma/client";

interface Order {
  id: string;
  orderDate: string;
  totalAmount: number;
  status: OrderStatus;
  orderType: OrderType;
  createdAt: string;
  updatedAt: string;
  // userId: string;
  // organizationId: string;
}

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isFetchingOrders, setIsFetchingOrders] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/sign-in");
    }

    const fetchOrders = async () => {
      if (!user || !user.activeOrganizationId) {
        setIsFetchingOrders(false);
        setError("User or organization ID not available.");
        return;
      }

      setIsFetchingOrders(true);
      try {
        // Use the activeOrganizationId to filter the data from your API
        // This is a crucial step for multi-tenancy.
        const response = await fetch(
          `/api/orders?organizationId=${user.activeOrganizationId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders.");
        }

        const data: Order[] = await response.json();
        setOrders(data);
      } catch (err: any) {
        console.error("Error fetching orders:", err);
        setError(err.message || "An error occurred while fetching orders.");
      } finally {
        setIsFetchingOrders(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading || isFetchingOrders) {
    return (
      <div className="flex justify-center items-center text-lg mt-20">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-screen bg-gray-50">
      <Card className="w-full max-w-4xl mx-auto rounded-lg shadow-lg">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-800">
            Orders Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6">
          <p className="text-gray-600 text-center mb-6">
            Displaying orders for your organization.
          </p>
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No orders found for this organization.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.orderType}</TableCell>
                      <TableCell>{order.status}</TableCell>
                      <TableCell className="text-right">
                        ${order.totalAmount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
