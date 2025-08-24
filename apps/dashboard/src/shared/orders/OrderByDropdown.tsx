// src/shared/orders/OrdersOrderByDropdown.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { SortConfig } from "@/types/orders";

interface OrdersOrderByDropdownProps {
  currentSort: SortConfig;
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}

export default function OrdersOrderByDropdown({
  currentSort,
  onSortChange,
}: OrdersOrderByDropdownProps) {
  const handleSortItemClick = (field: string) => {
    const newDirection =
      currentSort.field === field && currentSort.direction === "desc"
        ? "asc"
        : "desc";

    onSortChange(field, newDirection);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          {/* Display current sort icon, or default if no sort */}
          {currentSort.field && currentSort.direction === "asc" ? (
            <ArrowUpWideNarrow className="h-5 w-5" />
          ) : currentSort.field && currentSort.direction === "desc" ? (
            <ArrowDownWideNarrow className="h-5 w-5" />
          ) : (
            <ArrowDownWideNarrow className="h-5 w-5 rotate-90 opacity-70" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* Sortable Fields */}
        <DropdownMenuItem onClick={() => handleSortItemClick("orderNumber")}>
          Order Number{" "}
          {currentSort.field === "orderNumber" &&
            (currentSort.direction === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ))}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSortItemClick("orderDate")}>
          Order Date{" "}
          {currentSort.field === "orderDate" &&
            (currentSort.direction === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ))}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSortItemClick("totalAmount")}>
          Total Amount{" "}
          {currentSort.field === "totalAmount" &&
            (currentSort.direction === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ))}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => handleSortItemClick("totalItems")}>
          {/* New Sort Option */}
          Items Quantity{" "}
          {currentSort.field === "totalItems" &&
            (currentSort.direction === "asc" ? (
              <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
            ) : (
              <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
            ))}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
