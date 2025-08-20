// shared/orders/OrdersSummaryCards.tsx
"use client";

import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface OrdersSummaryCardsProps {
  totalOrders?: number;
  totalOrderItems?: number;
  totalReturnOrders?: number;
  totalFulfilledOrders?: number;
}

export default function OrdersSummaryCards({
  totalOrders = 21,
  totalOrderItems = 15,
  totalReturnOrders = 0,
  totalFulfilledOrders = 12,
}: OrdersSummaryCardsProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
      <Card className="p-4 flex flex-col justify-between border-gray-200">
        <CardTitle className="text-sm font-medium text-gray-600">
          Total Orders
        </CardTitle>

        <CardContent className="p-0 flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            <div className="flex items-center text-sm font-medium text-green-500 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span className="mx-1">25.2%</span>
              <span className="ml-1 text-gray-500">last week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 flex flex-col justify-between border-gray-200">
        <CardTitle className="text-sm font-medium text-gray-600">
          Order items over time
        </CardTitle>
        <CardContent className="p-0 flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {totalOrderItems}
            </p>
            <div className="flex items-center text-sm font-medium text-green-500 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span className="mx-1">18.2%</span>
              <span className="ml-1 text-gray-500">last week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4 flex flex-col justify-between border-gray-200">
        <CardTitle className="text-sm font-medium text-gray-600">
          Returns Orders
        </CardTitle>
        <CardContent className="p-0 flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {totalReturnOrders}
            </p>
            <div className="flex items-center text-sm font-medium text-red-500 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-down"
              >
                <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
                <polyline points="16 17 22 17 22 11" />
              </svg>
              <span className="mx-1">-1.2%</span>
              <span className="ml-1 text-gray-500">last week</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fulfilled Orders Over Time Card */}
      <Card className="p-4 flex flex-col justify-between border-gray-200">
        <CardTitle className="text-sm font-medium text-gray-600">
          Fulfilled orders over time
        </CardTitle>
        <CardContent className="p-0 flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {totalFulfilledOrders}
            </p>
            <div className="flex items-center text-sm font-medium text-green-500 mt-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-trending-up"
              >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
              </svg>
              <span className="mx-1">12.2%</span>
              <span className="ml-1 text-gray-500">last week</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
