"use client";

import { useEffect, useCallback, useState, useMemo } from "react";
import { faker } from "@faker-js/faker";
import { Label, Pie, PieChart } from "recharts";
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

const chartConfig = {
  orders: {
    label: "Orders",
  },
  status: {
    label: "Status",
    color: "var(--chart-1)",
  },
  count: {
    label: "Count",
    color: "var(--chart-2)",
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
      status: string;
      count: number;
      fill: string;
    }[]
  >([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch("/api/charts/ordersStatus");

      if (response.status !== 200) {
        throw new Error(
          response.statusText || "Failed to fetch Order Status chart data.",
        );
      }

      const data = await response.json();

      setChartData(data.chartData);
    } catch (err: any) {
      console.error("Error fetching Order Status chart data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalOrders = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  return (
    <Card className="flex flex-1 flex-col shadow-accent">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalOrders.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Orders
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
