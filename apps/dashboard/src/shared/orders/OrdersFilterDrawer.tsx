// src/shared/orders/OrdersFilterDrawer.tsx
"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Filter } from "lucide-react"; // Filter icon
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  OrderStatus,
  CustomerType,
  OrderType,
  ActiveFilters,
} from "@/types/orders";

interface Props {
  activeFilters?: ActiveFilters;
  onFilterChange?: (filters: ActiveFilters) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

export default function OrdersFilterDrawer({
  activeFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: Props) {
  // Handler for individual filter changes (e.g., status, customerType)
  const handleSelectChange = (key: keyof ActiveFilters, value: string) => {
    // onFilterChange({
    //   ...activeFilters,
    //   [key]: value === "All" ? undefined : value,
    // });
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[90vh] focus:outline-none">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-gray-900">
              Filter Orders
            </DrawerTitle>
            <DrawerDescription className="text-gray-500">
              Refine your order list.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0 space-y-6">
            {/* Status Filter */}
            <div>
              <Label
                htmlFor="status-filter"
                className="text-base font-semibold text-gray-700 mb-2 block"
              >
                Order Status
              </Label>
              <Select
                value={activeFilters?.status || "All"}
                onValueChange={(value) => handleSelectChange("status", value)}
              >
                <SelectTrigger id="status-filter" className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value={OrderStatus.Pending}>Pending</SelectItem>
                  <SelectItem value={OrderStatus.Processing}>
                    Processing
                  </SelectItem>
                  <SelectItem value="Fulfilled">
                    Fulfilled (Shipped/Delivered)
                  </SelectItem>
                  <SelectItem value={OrderStatus.Cancelled}>
                    Cancelled
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-200" />

            {/* Customer Type Filter */}
            <div>
              <Label
                htmlFor="customer-type-filter"
                className="text-base font-semibold text-gray-700 mb-2 block"
              >
                Customer Type
              </Label>
              <Select
                value={activeFilters?.customerType || "All"}
                onValueChange={(value) =>
                  handleSelectChange("customerType", value)
                }
              >
                <SelectTrigger id="customer-type-filter" className="w-full">
                  <SelectValue placeholder="Select Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value={CustomerType.B2B}>B2B</SelectItem>
                  <SelectItem value={CustomerType.B2C}>B2C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-200" />

            {/* Order Type Filter */}
            <div>
              <Label
                htmlFor="order-type-filter"
                className="text-base font-semibold text-gray-700 mb-2 block"
              >
                Order Type
              </Label>
              <Select
                value={activeFilters?.orderType || "All"}
                onValueChange={(value) =>
                  handleSelectChange("orderType", value)
                }
              >
                <SelectTrigger id="order-type-filter" className="w-full">
                  <SelectValue placeholder="Select Order Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  <SelectItem value={OrderType.SALES}>Sales</SelectItem>
                  <SelectItem value={OrderType.PURCHASE}>Purchase</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter - Placeholder for now */}
            {/* You would integrate a date picker component here, e.g., using shadcn/ui's DatePicker */}
            {/* <div>
              <Label htmlFor="date-range-filter" className="text-base font-semibold text-gray-700 mb-2 block">
                Date Range
              </Label>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                 <CalendarIcon className="mr-2 h-4 w-4" />
                 {activeFilters.startDate && activeFilters.endDate ?
                   `${format(activeFilters.startDate, "PPP")} - ${format(activeFilters.endDate, "PPP")}`
                   : <span>Select a date range</span>
                 }
              </Button>
            </div> */}
          </div>

          <DrawerFooter className="flex-row justify-between pt-6">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-1/2 mr-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              Clear Filters
            </Button>
            <DrawerClose asChild>
              <Button
                onClick={onApplyFilters}
                className="w-1/2 ml-2 bg-sidebar border-2 border-transparent hover:bg-transparent hover:border-sidebar hover:text-sidebar text-white font-semibold shadow transition-colors duration-200"
              >
                Apply Filters
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
