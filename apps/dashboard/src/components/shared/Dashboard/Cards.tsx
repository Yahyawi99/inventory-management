"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { buildInvoicesApiUrl } from "@/utils/invoices";
import { MetricsData } from "app-core/src/types";
import { calculateExpensesFinancialMetrics } from "@/utils/dashboard";
import { SummaryCards } from "app-core/src/components";

export default function Cards() {
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState<MetricsData[]>([]);
  const t = useTranslations("dashboard");

  // Expenses
  const fetchExpensesMetrics = async () => {
    setLoading(true);
    try {
      const apiUrl = buildInvoicesApiUrl(
        "/api/invoices",
        {},
        {
          field: "invoiceDate",
          direction: "desc",
        },
        { page: 1, pageSize: Infinity },
      );
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(
          response.statusText ||
            "Something went wrong, please try again later!",
        );
      }

      const { invoices } = await response.json();
      const invoicesMetrics = calculateExpensesFinancialMetrics(invoices);

      setDashboardMetrics([
        {
          title: "Total Sales Revenue (Paid)",
          value: invoicesMetrics.totalSalesRevenue.value,
          change: invoicesMetrics.totalSalesRevenue.change,
        },
        {
          title: "Outstanding Receivables",
          value: invoicesMetrics.outstandingReceivables.value,
          change: invoicesMetrics.outstandingReceivables.change,
        },
        {
          title: "Revenue Loss (Voided)",
          value: invoicesMetrics.revenueLossFromVoids.value,
          change: invoicesMetrics.revenueLossFromVoids.change,
        },
        {
          title: "Gross Sales Volume",
          value: invoicesMetrics.grossSalesTotal.value,
          change: invoicesMetrics.grossSalesTotal.change,
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpensesMetrics();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{t("cards.title")}</h2>

      <SummaryCards
        page="dashboard"
        data={dashboardMetrics}
        isLoading={loading}
      />
    </div>
  );
}
