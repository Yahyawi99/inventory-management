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

export const description = "A bar chart";

export const topSellingProductsData = Array.from({ length: 10 }).map((_, i) => {
  const quantitySold = faker.number.int({ min: 50, max: 300 - i * 15 });
  const price = parseFloat(faker.finance.amount({ min: 10, max: 500, dec: 2 }));
  const revenueGenerated = parseFloat((quantitySold * price).toFixed(2));

  return {
    productName: faker.commerce.productName(),
    quantitySold: quantitySold,
    revenueGenerated: revenueGenerated,
  };
});

const chartConfig = {
  productName: {
    label: "Product",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function Chart() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={topSellingProductsData}>
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
