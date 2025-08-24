"use client";

import React, { useEffect, useState } from "react";
import { ActiveFilters, SortConfig, Pagination } from "@/types/orders";
import { Button } from "@/components/ui/button";
import OrdersSearchInput from "./OrdersSearchInput";
import OrdersFilterDrawer from "./OrdersFilterDrawer";
import OrdersOrderByDropdown from "./OrderByDropdown";

interface Props {
  activeFilters: ActiveFilters;
  activeOrderBy: SortConfig;
  setActiveFilters: (filter: ActiveFilters) => void;
  setActiveOrderBy: (newSort: SortConfig) => void;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
}

export default function OrdersFilters({
  activeFilters,
  setActiveFilters,
  activeOrderBy,
  setActiveOrderBy,
  setPagination,
}: Props) {
  const [drawerFilters, setDrawerFilters] = useState<ActiveFilters>({
    status: "All",
    customerType: "All",
    orderType: "All",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  const onFilterChange = (newFilters: ActiveFilters) => {
    setDrawerFilters(newFilters);
  };

  const onApplyFilters = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setActiveFilters({ ...activeFilters, ...drawerFilters });
  };

  const onClearFilters = () => {
    setDrawerFilters({
      status: "All",
      customerType: "All",
      orderType: "All",
    });

    setPagination((prev) => ({ ...prev, page: 1 }));

    setActiveFilters({
      ...activeFilters,
      status: "All",
      customerType: "All",
      orderType: "All",
    });
  };

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

  const onSearchChange = (input: string) => {
    setSearchQuery(input);
  };

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
        <OrdersSearchInput
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        <OrdersFilterDrawer
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          onApplyFilters={onApplyFilters}
          onClearFilters={onClearFilters}
        />

        <OrdersOrderByDropdown
          currentSort={activeOrderBy}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  );
}
