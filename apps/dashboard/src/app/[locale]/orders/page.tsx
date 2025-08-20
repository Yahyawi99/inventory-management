"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { fetch } from "@services/application/orders";
import { Order } from "@/types/orders";
import Orders from "@/shared/orders/Orders";
import { Card, CardContent } from "@/components/ui/card";
import OrdersFilters from "@/shared/orders/Filters";

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

  // Display error if fetching failed after loading
  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800">Orders</h2>

      <OrdersFilters
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <Card className="w-full mx-auto rounded-lg shadow-lg border border-gray-200">
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No orders found for this organization.</p>
            </div>
          ) : (
            <Orders
              orders={orders}
              isAuthLoading={isAuthLoading}
              isFetchingOrders={isFetchingOrders}
            />
          )}
        </CardContent>
      </Card>
    </section>
  );
}
