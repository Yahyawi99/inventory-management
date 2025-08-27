"use client";

import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "..";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { SortConfig, SortableField } from "../../types";

interface Props {
  currentSort: SortConfig;
  onSortChange: (field: string, direction: "asc" | "desc") => void;
  sortableFields: SortableField[];
}

export function OrderByDropdown({
  currentSort,
  onSortChange,
  sortableFields,
}: Props) {
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
        {sortableFields.map((sortableField) => {
          const { title, field } = sortableField;
          return (
            <DropdownMenuItem
              key={title}
              onClick={() => handleSortItemClick(field)}
            >
              {title}
              {currentSort.field === field &&
                (currentSort.direction === "asc" ? (
                  <ArrowUpWideNarrow className="ml-2 h-4 w-4" />
                ) : (
                  <ArrowDownWideNarrow className="ml-2 h-4 w-4" />
                ))}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
