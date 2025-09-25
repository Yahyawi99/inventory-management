import RecentActivity from "@/shared/account/activity";
import { Activity } from "lucide-react";

export default function UserActivity() {
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="flex items-center text-2xl sm:text-3xl font-bold text-gray-900">
            <Activity className="w-5 h-5 mr-2" />
            My Activity
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Your recent actions in the inventory management system
          </p>
        </div>

        <RecentActivity />
      </div>
    </div>
  );
}
