"use client";

import * as React from "react";
import { faker } from "@faker-js/faker";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A donut chart with text";

export const orderStatusData = [
  {
    status: "Completed",
    count: faker.number.int({ min: 1000, max: 1500 }),
    fill: "#FFC187",
  },
  {
    status: "Pending",
    count: faker.number.int({ min: 200, max: 400 }),
    fill: "#FFC107",
  },
  {
    status: "Processing",
    count: faker.number.int({ min: 100, max: 200 }),
    fill: "#2196F3",
  },
  {
    status: "Shipped",
    count: faker.number.int({ min: 200, max: 300 }),
    fill: "#00BCD4",
  },
  {
    status: "Delivered",
    count: faker.number.int({ min: 800, max: 1100 }),
    fill: "#8BC34A",
  },
  {
    status: "Cancelled",
    count: faker.number.int({ min: 30, max: 70 }),
    fill: "#F44336",
  },
];

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

export default function Chart() {
  const totalOrders = React.useMemo(() => {
    return orderStatusData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className="flex flex-1 flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Order Status Distribution</CardTitle>
        <CardDescription>
          Overview of the current state of all active orders
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie
              data={orderStatusData}
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
