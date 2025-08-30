"use client";

import React, { useEffect, useState } from "react";
import { Button, FilterDrawer, SearchInput, OrderByDropdown } from "..";
import {
  FilterDrawerData,
  SortableField,
  ActiveFilters,
  Pagination,
  SortConfig,
} from "../../types";

interface DataControlsProps {
  activeFilters: ActiveFilters;
  activeOrderBy: SortConfig;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
  setActiveOrderBy: React.Dispatch<React.SetStateAction<SortConfig>>;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  DrawerData: FilterDrawerData;
  sortableFields: SortableField[];
  filterOptions: { field: string; values: string[] };
}

export function DataControls({
  activeFilters,
  setActiveFilters,
  activeOrderBy,
  setActiveOrderBy,
  setPagination,
  DrawerData,
  sortableFields,
  filterOptions,
}: DataControlsProps) {
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
        {filterOptions.values.map((value) => {
          return (
            <Button
              key={value}
              variant={
                activeFilters[filterOptions.field] === value
                  ? "default"
                  : "ghost"
              }
              className={`text-sm rounded-full px-4 cursor-pointer ${
                activeFilters[filterOptions.field] === value
                  ? "bg-sidebar text-white hover:bg-sidebar"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() =>
                setActiveFilters({
                  ...activeFilters,
                  [filterOptions.field]: value,
                })
              }
            >
              {value}
            </Button>
          );
        })}
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
