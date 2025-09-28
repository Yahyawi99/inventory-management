"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "app-core/src/components";
import { useCallback, useEffect, useMemo, useState } from "react";

// export const inventoryValueByCategoryData = [
//   { category: "Jewelry", totalValue: 145234.56, fill: "var(--chart-1)" },
//   { category: "Toys", totalValue: 121987.12, fill: "var(--chart-2)" },
//   { category: "Home", totalValue: 98765.43, fill: "var(--chart-3)" },
//   { category: "Kids", totalValue: 75432.1, fill: "var(--chart-4)" },
//   { category: "Electronics", totalValue: 50123.45, fill: "var(--chart-5)" },
// ];

const chartConfig = {
  categories: {
    label: "Categories",
  },
  Jewelry: {
    label: "Jewelry",
  },
  Electronics: {
    label: "Electronics",
  },
  Toys: {
    label: "Toys",
  },
  Home: {
    label: "Home",
  },
  Kids: {
    label: "Kids",
  },
} satisfies ChartConfig;

export default function Chart() {
  const [chartData, setChartData] = useState<
    {
      category: string;
      totalValue: number;
      fill: string;
    }[]
  >([]);

  const [chartConfig, setChartConfig] = useState<{
    [key: string]: { label: string };
  }>({
    categories: {
      label: "Categories",
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/charts/inventory");

      if (response.status !== 200) {
        throw new Error(
          response.statusText || "Failed to fetch inventory chart data."
        );
      }

      const data = await response.json();

      setChartData(data.chartData);
    } catch (err: any) {
      console.error("Error fetching inventory chart data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useMemo(() => {
    chartData.forEach((value) => {
      setChartConfig((prev) => {
        prev[value["category"]] = { label: value["category"] };
        return prev;
      });
    });
  }, [chartData]);
  return (
    <Card className="flex flex-col flex-1">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Value Distribution</CardTitle>
        <CardDescription>
          Shows how your total inventory value is spread across different
          product categories.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="totalValue" nameKey="category" />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
