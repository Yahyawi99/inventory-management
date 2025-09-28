"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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

export const description = "A linear line chart";

export const aovTrendData = [
  { month: "Jul 2024", aov: 112.45 },
  { month: "Aug 2024", aov: 118.9 },
  { month: "Sep 2024", aov: 115.6 },
  { month: "Oct 2024", aov: 123.1 },
  { month: "Nov 2024", aov: 120.75 },
  { month: "Dec 2024", aov: 128.3 },
  { month: "Jan 2025", aov: 125.9 },
  { month: "Feb 2025", aov: 132.05 },
  { month: "Mar 2025", aov: 129.5 },
  { month: "Apr 2025", aov: 136.15 },
  { month: "May 2025", aov: 133.8 },
  { month: "Jun 2025", aov: 140.25 },
];

const chartConfig = {
  month: {
    label: "Month",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function Chart() {
  const [chartData, setChartData] = useState<
    {
      month: string;
      aov: number;
    }[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/charts/aov");

      if (response.status !== 200) {
        throw new Error(
          response.statusText || "Failed to fetch AOV chart data."
        );
      }

      const data = await response.json();

      setChartData(data.chartData);
    } catch (err: any) {
      console.error("Error fetching AOV chart data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Average Order Value</CardTitle>
        <CardDescription>
          Tracks the average amount customers spend per order over time.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="month"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value?.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="views" hideLabel />}
            />
            <Line
              dataKey="aov"
              type="linear"
              stroke="var(--chart-4)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
