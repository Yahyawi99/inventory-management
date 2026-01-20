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

const chartConfig = {
  month: {
    label: "Month",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function Chart({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
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
          response.statusText || "Failed to fetch AOV chart data.",
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
    <Card className="flex-1 shadow-accent">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
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
