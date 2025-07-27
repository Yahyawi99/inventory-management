"use client";

import { Pie, PieChart } from "recharts";
import { faker } from "@faker-js/faker";
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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "A pie chart with a legend";

export const inventoryValueByCategoryData = [
  { category: "Jewelry", totalValue: 145234.56, fill: "var(--chart-1)" },
  { category: "Toys", totalValue: 121987.12, fill: "var(--chart-2)" },
  { category: "Home", totalValue: 98765.43, fill: "var(--chart-3)" },
  { category: "Kids", totalValue: 75432.1, fill: "var(--chart-4)" },
  { category: "Electronics", totalValue: 50123.45, fill: "var(--chart-5)" },
];

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
    color: "var(--chart-1)",
  },
  Kids: {
    label: "Kids",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export default function Chart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Inventory Value Distribution by Category</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie
              data={inventoryValueByCategoryData}
              dataKey="totalValue"
              nameKey="category"
            />
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
