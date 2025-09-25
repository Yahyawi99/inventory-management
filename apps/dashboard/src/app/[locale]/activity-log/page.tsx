import Activity from "@/shared/account/activity";
import Header from "@/layouts/main/header";

export default function Page() {
  return (
    <>
      <Header />

      <div className="mb-4 mt-6">
        <h1 className="text-3xl font-semibold text-gray-800">Activity Log</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">
          Your recent actions in the inventory management system
        </p>
      </div>

      <Activity />
    </>
  );
}
