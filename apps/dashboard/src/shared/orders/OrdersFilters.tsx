"use client";

import React, { useEffect, useState } from "react";
import { ActiveFilters, SortConfig, Pagination } from "@/types/orders";
import {
  Button,
  FilterDrawer,
  SearchInput,
  OrderByDropdown,
} from "app-core/src/components";
import { FilterDrawerData, SortableField } from "app-core/src/types";

interface Props {
  activeFilters: ActiveFilters;
  activeOrderBy: SortConfig;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  setActiveOrderBy: React.Dispatch<React.SetStateAction<SortConfig>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}

const DrawerData: FilterDrawerData = {
  header: {
    title: "Filter Orders",
    desc: "Refine your Order list",
  },
  filterOptions: {
    status: {
      name: "Order Status",
      options: [
        { label: "All Status", value: "All" },
        { label: "Pending", value: "Pending" },
        { label: "Processing", value: "Processing" },
        { label: "Fulfilled (Shipped/Delivered)", value: "Fulfilled" },
        { label: "Cancelled", value: "Cancelled" },
      ],
    },

    customerType: {
      name: "Customer Type",
      options: [
        { label: "All Customers", value: "All" },
        { label: "B2B", value: "B2B" },
        { label: "B2c", value: "B2C" },
      ],
    },
    orderType: {
      name: "Order Type",
      options: [
        { label: "All Types", value: "All" },
        { label: "Sales", value: "Sales" },
        { label: "Purchase", value: "Purchase" },
      ],
    },
  },
};

const sortableFields: SortableField[] = [
  { title: "Order Number", field: "orderNumber", direction: "desc" },
  { title: "Order Date", field: "orderDate", direction: "desc" },
  { title: "Total Amount", field: "totalAmount", direction: "desc" },
  { title: "Items Quantity", field: "totalItemsQuantity", direction: "desc" },
];

export default function OrdersFilters({
  activeFilters,
  setActiveFilters,
  activeOrderBy,
  setActiveOrderBy,
  setPagination,
}: Props) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [activeFilters]);

  // search
  useEffect(() => {
    const handler = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1 }));

      setActiveFilters({
        ...activeFilters,
        search: searchQuery,
      });
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Order by
  const onSortChange = (field: string, direction: "desc" | "asc") => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setActiveOrderBy({ field, direction });
  };

  return (
    <div className="flex items-center justify-between my-4">
      <div className="flex space-x-2 bg-white p-1 rounded-full">
        {["All", "Pending", "Processing", "Fulfilled", "Cancelled"].map(
          (value) => {
            return (
              <Button
                key={value}
                variant={activeFilters.status === value ? "default" : "ghost"}
                className={`text-sm rounded-full px-4 cursor-pointer ${
                  activeFilters.status === value
                    ? "bg-sidebar text-white hover:bg-sidebar"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() =>
                  setActiveFilters({
                    ...activeFilters,
                    status: value as typeof activeFilters.status,
                  })
                }
              >
                {value}
              </Button>
            );
          }
        )}
      </div>

      <div className="flex items-center space-x-2">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <FilterDrawer
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          data={DrawerData}
        />

        <OrderByDropdown
          currentSort={activeOrderBy}
          onSortChange={onSortChange}
          sortableFields={sortableFields}
        />
      </div>
    </div>
  );
}
