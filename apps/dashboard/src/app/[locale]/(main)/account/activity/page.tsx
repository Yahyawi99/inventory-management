import { useTranslations, useLocale } from "next-intl";
import RecentActivity from "@/components/shared/account/activity";
import { Activity } from "lucide-react";

export default function UserActivity() {
  const t = useTranslations("my_activity_page.header");
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="flex items-center text-2xl sm:text-3xl font-bold text-foreground">
            <Activity className="w-5 h-5 mx-2" />
            {t("title")}
          </h1>
          <p className="w-fit text-muted-foreground mt-2 text-sm sm:text-base">
            {t("subtitle")}
          </p>
        </div>

        <RecentActivity />
      </div>
    </div>
  );
}
