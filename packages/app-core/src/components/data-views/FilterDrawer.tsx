"use client";

import React, { useState } from "react";
import { Filter } from "lucide-react";
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
} from "..";
import { FilterDrawerData, ActiveFilters } from "@/types/data-views";

interface FilterDrawerProps {
  data: FilterDrawerData;
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
}

export function FilterDrawer({
  data,
  activeFilters,
  setActiveFilters,
}: FilterDrawerProps) {
  const [drawerFilters, setDrawerFilters] =
    useState<ActiveFilters>(activeFilters);

  const handleSelectChange = (key: keyof ActiveFilters, value: string) => {
    setDrawerFilters({
      ...drawerFilters,
      [key]: value,
    });
  };

  const onApplyFilters = () => {
    setActiveFilters({ ...activeFilters, ...drawerFilters });
  };

  const onClearFilters = () => {
    const clearedFilters = Object.entries(data.filterOptions).reduce(
      (acc, [key, value]) => {
        acc[key] = value.options[0].value;
        return acc;
      },
      {} as ActiveFilters
    );

    setDrawerFilters({
      ...clearedFilters,
    });

    setActiveFilters({
      ...activeFilters,
      ...clearedFilters,
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
              {data.header.title}
            </DrawerTitle>
            <DrawerDescription className="text-gray-500">
              {data.header.desc}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0 space-y-6">
            {Object.entries(data.filterOptions).map(
              ([filterKey, filterConfig]) => {
                return (
                  <div key={filterConfig.name}>
                    <div>
                      <Label
                        htmlFor={`${filterKey}-filter`}
                        className="text-base font-semibold text-gray-700 mb-2 block"
                      >
                        {filterConfig.name}
                      </Label>
                      <Select
                        value={drawerFilters[filterKey]}
                        onValueChange={(selectedValue) => {
                          handleSelectChange(filterKey, selectedValue);
                        }}
                      >
                        <SelectTrigger
                          id={`${filterKey}-filter`}
                          className="w-full"
                        >
                          <SelectValue placeholder={`Select ${filterKey}`} />
                        </SelectTrigger>

                        <SelectContent>
                          {filterConfig.options.map(
                            ({ label: optionLabel, value: optionValue }) => {
                              return (
                                <SelectItem
                                  key={optionValue}
                                  value={optionValue}
                                >
                                  {optionLabel}
                                </SelectItem>
                              );
                            }
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator className="bg-gray-200" />
                  </div>
                );
              }
            )}
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
