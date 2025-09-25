import Activity from "@/shared/account/activity";
import Header from "@/layouts/main/header";

export default function Page() {
  return (
    <>
      <Header />

      <h1 className="text-3xl font-semibold text-gray-800 mb-4 mt-6">
        Activity Log
      </h1>
      <Activity />
    </>
  );
}
