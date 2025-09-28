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
  ChartTooltip,
  ChartTooltipContent,
} from "app-core/src/components";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Chart() {
  const [chartData, setChartData] = useState<
    {
      category: string;
      totalValue: number;
      fill: string;
    }[]
  >([]);

  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    visitors: {
      label: "Visitors",
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

      console.log(data.chartData.length);

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
        prev[value["category"]] = {
          label: value["category"],
          color: value["fill"],
        };
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie data={chartData} dataKey="totalValue" nameKey="category" />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
