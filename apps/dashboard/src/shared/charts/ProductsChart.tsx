"use client";

import { faker } from "@faker-js/faker/locale/af_ZA";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "app-core/src/components";
import { useCallback, useEffect, useState } from "react";

const chartConfig = {
  productName: {
    label: "Product",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function Chart() {
  const [chartData, setChartData] = useState<
    {
      productName: string;
      quantitySold: number;
      revenueGenerated: number;
    }[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/charts/topProducts");

      if (response.status !== 200) {
        throw new Error(
          response.statusText ||
            "Failed to fetch top selling Products chart data."
        );
      }

      const data = await response.json();

      setChartData(data.chartData);
    } catch (err: any) {
      console.error("Error fetching top selling Products chart data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="productName"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="quantitySold" fill="var(--chart-1)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
