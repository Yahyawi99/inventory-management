import Activity from "@/components/shared/account/activity";
import Header from "@/layouts/main/header";

export default function Page() {
  return (
    <>
      <Header />

      <div className="mb-4 mt-10">
        <h1 className="text-3xl font-semibold text-foreground">Activity Log</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Your recent actions in the inventory management system
        </p>
      </div>

      <Activity />
    </>
  );
}
