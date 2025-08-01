"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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
            data={aovTrendData}
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
