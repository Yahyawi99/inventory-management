import { useTranslations } from "next-intl";
import SalesChart from "@/components/shared/charts/SalesCharts";
import OrderStatusChart from "@/components/shared/charts/OrderStatusChart";
import TopProductChart from "@/components/shared/charts/ProductsChart";
import InventoryValueChart from "@/components/shared/charts/InventoryValueChart";
import AOVChart from "@/components/shared/charts/AOVChart";

export default function Charts() {
  const t = useTranslations("dashboard");

  return (
    <div className=" flex flex-col gap-5">
      <SalesChart
        title={t("charts.chart-1.title")}
        revenueDesc={t("charts.chart-1.revenue.desc")}
        ordersDesc={t("charts.chart-1.orders.desc")}
      />

      <div className="flex gap-5">
        <AOVChart
          title={t("charts.chart-1.title")}
          desc={t("charts.chart-1.revenue.desc")}
        />
        <TopProductChart
          title={t("charts.chart-1.title")}
          desc={t("charts.chart-1.revenue.desc")}
        />
      </div>
      <div className="flex gap-5">
        <InventoryValueChart
          title={t("charts.chart-1.title")}
          desc={t("charts.chart-1.revenue.desc")}
        />
        <OrderStatusChart
          title={t("charts.chart-1.title")}
          desc={t("charts.chart-1.revenue.desc")}
        />
      </div>
    </div>
  );
}
