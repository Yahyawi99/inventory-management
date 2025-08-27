"use client";

import { MetricsData } from "@/types";
import { Card, CardContent, CardTitle } from "..";
import { CardsSkeleton } from "..";

interface SummaryCardsProps {
  data: MetricsData[];
  isLoading: boolean;
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  const renderChangeDisplay = (change: number) => {
    const isPositive = change > 0;
    const isNegative = change < 0;

    const textColorClass = isPositive
      ? "text-green-500"
      : isNegative
      ? "text-red-500"
      : "text-gray-500";

    const arrowIcon = isPositive ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-trending-up"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    ) : isNegative ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-trending-down"
      >
        <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
        <polyline points="16 17 22 17 22 11" />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-minus"
      >
        <path d="M5 12h14" />
      </svg>
    );

    const formattedChange = `${isPositive ? "+" : ""}${change.toFixed(2)}%`;

    return (
      <div
        className={`flex items-center text-sm font-medium ${textColorClass} mt-1`}
      >
        {arrowIcon}
        <span className="mx-1">{formattedChange}</span>
        <span className="ml-1 text-gray-500">last week</span>{" "}
        {/* Clear phrasing */}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
      {!isLoading ? (
        data.map((metric) => {
          const { title, value, change } = metric;
          return (
            <Card
              key={title}
              className="p-4 flex flex-col justify-between border-gray-200"
            >
              <CardTitle className="text-sm font-medium text-gray-600">
                {title}
              </CardTitle>
              <CardContent className="p-0 flex items-end justify-between mt-2">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                  {renderChangeDisplay(change)}
                </div>
              </CardContent>
            </Card>
          );
        })
      ) : (
        <CardsSkeleton />
      )}
    </div>
  );
}
