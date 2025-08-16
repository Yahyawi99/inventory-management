"use client";

import { useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const START_DATE = new Date("2025-06-25T00:00:00.000Z");
const MONTHS_AGO_DATE = new Date("2024-07-24T00:00:00.000Z");

export const salesTrendData = Array.from({ length: 30 })
  .map((_, i) => {
    const date = faker.date.soon({ days: 30, refDate: START_DATE });
    const revenue = parseFloat(
      faker.finance.amount({ min: 4000, max: 8000, dec: 2 })
    );
    const orderCount = faker.number.int({ min: 20, max: 100 });

    return {
      date: date.toISOString().split("T")[0],
      revenue: parseFloat(revenue.toFixed(2)),
      orderCount: orderCount,
    };
  })
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
const chartConfig = {
  sales: {
    label: "company sales",
  },
  revenue: {
    label: "Revenue",
    color: "var(--chart-1)",
  },
  orderCount: {
    label: "Orders",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function Chart() {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>("revenue");

  const total = useMemo(
    () => ({
      revenue: salesTrendData.reduce((acc, curr) => acc + curr.revenue, 0),
      orderCount: salesTrendData.reduce(
        (acc, curr) => acc + curr.orderCount,
        0
      ),
    }),
    []
  );

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle>Sales Trend</CardTitle>
          <CardDescription>
            showing the historical performance of sales by{" "}
            <b>{chartConfig[activeChart].label}</b>
          </CardDescription>
        </div>
        <div className="flex">
          {["revenue", "orderCount"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            console.log(total[key as keyof typeof total]);
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={salesTrendData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
