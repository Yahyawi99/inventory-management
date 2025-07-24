import SalesChart from "@/shared/charts/SalesCharts";
import OrderStatusChart from "@/shared/charts/OrderStatusChart";
import TopProductChart from "@/shared/charts/ProductsChart";

export default function Charts() {
  return (
    <div className="my-10 flex flex-col gap-5">
      <SalesChart />

      <div className="flex gap-5">
        <OrderStatusChart />
        <TopProductChart />
      </div>
    </div>
  );
}

// **************
