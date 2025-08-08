// section
import Cards from "@/shared/Dashboard/Cards";
import Charts from "@/shared/Dashboard/Charts";
import RecentActivity from "@/shared/Dashboard/activity";
import Action from "@/shared/Dashboard/ActionBtns";

export default function Dashboard() {
  return (
    <section className="flex flex-col gap-8">
      <Cards />
      <Charts />
      <RecentActivity />
      <Action />
    </section>
  );
}
