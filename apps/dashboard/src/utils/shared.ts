import { OrderLine } from "@database/generated/prisma";
import {
  ActiveFilters,
  Data,
  SortConfig,
  SummaryCardsRawMetrics,
} from "app-core/src/types";

// generate a json to export
export const exportOrdersAsJson = <T>(
  Data: Data[],
  options: {
    filter: ActiveFilters;
    orderBy: SortConfig;
  },
  summaryData?: SummaryCardsRawMetrics<T>,
  description?: string,
  filename: string = "data_export"
) => {
  if (!Data || Data.length === 0 || !summaryData) {
    console.warn("No data to export.");
    return;
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const finalFilename = `${filename}_${timestamp}.json`;

  const dataToExport: {
    data: {
      options: {
        filter: ActiveFilters;
        orderBy: SortConfig;
      };
      data: Data[];
    };
    summary: { date: Date; data: T; description: string };
  } = {
    summary: {
      date: new Date(),
      data: summaryData,
      description:
        description ||
        "This summary provides a comparison of key Data metrics between the current week (last 7 full days ending yesterday) and the previous 7-day period.",
    },
    data: { options, data: Data },
  };

  const jsonString = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = finalFilename;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// calculate percentage
export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  return ((currentValue - previousValue) / previousValue) * 100;
};

// get the total items of each order
export const getTotalOrderLineQuantity = (orderLines: OrderLine[]): number => {
  if (!orderLines || orderLines.length === 0) {
    return 0;
  }

  const totalQuantity = orderLines.reduce(
    (sum, line) => sum + line.quantity,
    0
  );

  return totalQuantity;
};

// get Initial from a name
export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");
