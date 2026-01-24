"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
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
  page: string;
  currentSort: SortConfig;
  onSortChange: (field: string, direction: "asc" | "desc") => void;
  sortableFields: SortableField[];
}

export function OrderByDropdown({
  page,
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

  const t = useTranslations(page);
  const locale = useLocale();

  return (
    <DropdownMenu dir={locale === "ar" ? "rtl" : "ltr"}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 rounded-md border border-gray-300 text-foreground hover:bg-gray-100 transition-colors duration-200"
        >
          {currentSort.field && currentSort.direction === "asc" ? (
            <ArrowUpWideNarrow className="h-5 w-5" />
          ) : currentSort.field && currentSort.direction === "desc" ? (
            <ArrowDownWideNarrow className="h-5 w-5" />
          ) : (
            <ArrowDownWideNarrow className="h-5 w-5 rotate-90 opacity-70" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={locale === "ar" ? "start" : "end"}
        className="w-56"
      >
        <DropdownMenuLabel>
          {locale === "en"
            ? "Sort By"
            : locale === "fr"
              ? "Trier par"
              : "الترتيب حسب"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sortableFields.map((sortableField) => {
          const { title, field } = sortableField;
          return (
            <DropdownMenuItem
              key={title}
              onClick={() => handleSortItemClick(field)}
            >
              {t(title)}
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
