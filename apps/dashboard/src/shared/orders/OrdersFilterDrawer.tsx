"use client";

import React from "react";
import { Button } from "app-core/src/components";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "app-core/src/components";
import { Filter } from "lucide-react";
import { Label } from "app-core/src/components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app-core/src/components";
import { Separator } from "app-core/src/components";
import {
  OrderStatus,
  CustomerType,
  OrderType,
  ActiveFilters,
} from "@/types/orders";

interface Props {
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function OrdersFilterDrawer({
  activeFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
}: Props) {
  const handleSelectChange = (key: keyof ActiveFilters, value: string) => {
    onFilterChange({
      ...activeFilters,
      [key]: value,
    });
  };

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 p-0 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="focus:outline-none">
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
          </div>

          <DrawerFooter className="flex-row justify-between pt-6">
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-1/2 mr-2 border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Clear Filters
              </Button>
            </DrawerClose>

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
