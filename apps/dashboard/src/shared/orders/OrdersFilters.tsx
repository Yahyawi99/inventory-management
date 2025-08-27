"use client";

import React, { useEffect, useState } from "react";
import { ActiveFilters, SortConfig, Pagination } from "@/types/orders";
import { Button, FilterDrawer, SearchInput } from "app-core/src/components";
import { FilterDrawerData } from "app-core/src/types";
import OrdersOrderByDropdown from "./OrderByDropdown";

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
        <Button
          variant={activeFilters.status === "All" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "All"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => setActiveFilters({ ...activeFilters, status: "All" })}
        >
          All
        </Button>

        <Button
          variant={activeFilters.status === "Pending" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Pending"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Pending" })
          }
        >
          Pending
        </Button>

        <Button
          variant={activeFilters.status === "Processing" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Processing"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Processing" })
          }
        >
          Processing
        </Button>

        <Button
          variant={activeFilters.status === "Fulfilled" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Fulfilled"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Fulfilled" })
          }
        >
          Fulfilled
        </Button>

        <Button
          variant={activeFilters.status === "Cancelled" ? "default" : "ghost"}
          className={`text-sm rounded-full px-4 cursor-pointer ${
            activeFilters.status === "Cancelled"
              ? "bg-sidebar text-white hover:bg-sidebar"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() =>
            setActiveFilters({ ...activeFilters, status: "Cancelled" })
          }
        >
          Canceled
        </Button>
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

        <OrdersOrderByDropdown
          currentSort={activeOrderBy}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  );
}
