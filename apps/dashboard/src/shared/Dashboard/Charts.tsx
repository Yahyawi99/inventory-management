import SalesChart from "@/shared/charts/SalesCharts";
import OrderStatusChart from "@/shared/charts/OrderStatusChart";

export default function Charts() {
  return (
    <div className="mt-10 flex flex-col gap-5">
      <SalesChart />

      <OrderStatusChart />
    </div>
  );
}

// **************
