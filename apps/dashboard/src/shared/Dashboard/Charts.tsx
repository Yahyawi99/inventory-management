import SalesChart from "@/shared/charts/SalesCharts";
import OrderStatusChart from "@/shared/charts/OrderStatusChart";
import TopProductChart from "@/shared/charts/ProductsChart";
import InventoryValueChart from "@/shared/charts/InventoryValueChart";
import AOVChart from "@/shared/charts/AOVChart";

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

// **************
