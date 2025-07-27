// section
import Cards from "@/shared/Dashboard/Cards";
import Charts from "@/shared/Dashboard/Charts";
import RecentActivity from "@/shared/Dashboard/activity";

export default function Dashboard() {
  return (
    <section>
      <Cards />
      <Charts />
      <RecentActivity />
    </section>
  );
}
