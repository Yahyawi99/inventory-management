"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
} from "..";
import { FilterDrawerData, ActiveFilters } from "../../types/data-views";

interface FilterDrawerProps {
  page: string;
  data: FilterDrawerData | null;
  activeFilters: ActiveFilters;
  setActiveFilters: React.Dispatch<React.SetStateAction<ActiveFilters>>;
}

export function FilterDrawer({
  page,
  data,
  activeFilters,
  setActiveFilters,
}: FilterDrawerProps) {
  const [drawerFilters, setDrawerFilters] =
    useState<ActiveFilters>(activeFilters);

  const t = useTranslations(page);
  const locale = useLocale();

  useEffect(() => {
    setDrawerFilters(activeFilters);
  }, [activeFilters]);

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
    const clearedFilters =
      data &&
      Object.entries(data.filterOptions).reduce((acc, [key, value]) => {
        acc[key] = Array.isArray(value.options) ? value.options[0].value : "";
        return acc;
      }, {} as ActiveFilters);

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
          className="h-8 w-8 p-0 rounded-md border border-gray-300 text-foreground hover:bg-gray-100 transition-colors duration-200"
        >
          <Filter className="h-5 w-5" />
        </Button>
      </DrawerTrigger>

      <DrawerContent
        dir={locale === "ar" ? "rtl" : "ltr"}
        className="focus:outline-none bg-background"
      >
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle className="w-fit text-2xl font-bold text-foreground">
              {t("filter_drawer.title")}
            </DrawerTitle>
            <DrawerDescription className="w-fit text-muted-foreground">
              {t("filter_drawer.subtitle")}
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0 space-y-6">
            {data &&
              Object.entries(data.filterOptions).map(
                ([filterKey, filterConfig]) => {
                  return (
                    <div key={filterConfig.name}>
                      <div>
                        <Label
                          htmlFor={`${filterKey}-filter`}
                          className="text-base font-semibold text-muted-foreground mb-2 block"
                        >
                          {filterConfig.name}
                        </Label>

                        <Select
                          dir={locale === "ar" ? "rtl" : "ltr"}
                          value={drawerFilters[filterKey]}
                          onValueChange={(selectedValue) => {
                            handleSelectChange(filterKey, selectedValue);
                          }}
                        >
                          <SelectTrigger
                            id={`${filterKey}-filter`}
                            className="w-full text-foreground"
                          >
                            <SelectValue placeholder={`Select ${filterKey}`} />
                          </SelectTrigger>

                          <SelectContent className="bg-card">
                            {Array.isArray(filterConfig.options) &&
                              filterConfig.options.map(
                                ({
                                  label: optionLabel,
                                  value: optionValue,
                                }) => {
                                  return (
                                    <SelectItem
                                      key={optionValue}
                                      value={optionValue}
                                    >
                                      {optionLabel}
                                    </SelectItem>
                                  );
                                },
                              )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                },
              )}
          </div>

          <DrawerFooter className="flex-row justify-between pt-6">
            <DrawerClose asChild>
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="w-1/2 mr-2 border-border text-foreground hover:bg-muted-foreground transition-colors duration-200"
              >
                {locale === "en"
                  ? "Clear Filters"
                  : locale === "fr"
                    ? "Effacer les filtres"
                    : "مسح الفلاتر"}
              </Button>
            </DrawerClose>

            <DrawerClose asChild>
              <Button
                onClick={onApplyFilters}
                className="w-1/2 ml-2 bg-sidebar border-2 border-transparent hover:bg-transparent hover:border-sidebar hover:text-sidebar text-white font-semibold shadow transition-colors duration-200"
              >
                {locale === "en"
                  ? "Apply Filters"
                  : locale === "fr"
                    ? "Appliquer les filtres"
                    : "تطبيق الفلاتر"}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
