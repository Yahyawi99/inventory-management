import SalesChart from "@/components/shared/charts/SalesCharts";
import OrderStatusChart from "@/components/shared/charts/OrderStatusChart";
import TopProductChart from "@/components/shared/charts/ProductsChart";
import InventoryValueChart from "@/components/shared/charts/InventoryValueChart";
import AOVChart from "@/components/shared/charts/AOVChart";

export default function Charts() {
  return (
    <div className=" flex flex-col gap-5">
      <SalesChart />

      <div className="flex gap-5">
        <AOVChart />
        <TopProductChart />
      </div>
      <div className="flex gap-5">
        <InventoryValueChart />
        <OrderStatusChart />
      </div>
    </div>
  );
}
