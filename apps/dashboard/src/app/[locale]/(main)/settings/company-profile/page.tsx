import { useTranslations, useLocale } from "next-intl";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "app-core/src/components";
import OrganizationInfo from "@/components/shared/company-profile/OrganizationInfo";
import TeamManagement from "@/components/shared/company-profile/TeamManagement";
import OverviewMetrics from "@/components/shared/company-profile/OverviewMetrics";
import QuickActions from "@/components/shared/company-profile/QuickActions";

export default function CompanyProfilePage() {
  const t = useTranslations("company_profile_page");
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-1">{t("header.title")}</h1>
        <p className="mb-6">{t("header.subtitle")}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Tabs defaultValue="info" className="lg:col-span-2 space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-3xl bg-card border border-border shadow-md shadow-accent">
              <TabsTrigger className="cursor-pointer" value="info">
                {t("tabs.tab-1")}
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="stats">
                {t("tabs.tab-2")}
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="team">
                {t("tabs.tab-3")}
              </TabsTrigger>
            </TabsList>

            {/* info */}
            <TabsContent dir={locale === "ar" ? "rtl" : "ltr"} value="info">
              <OrganizationInfo />
            </TabsContent>

            {/* stats */}
            <TabsContent dir={locale === "ar" ? "rtl" : "ltr"} value="stats">
              <OverviewMetrics />
            </TabsContent>

            {/* team */}
            <TabsContent dir={locale === "ar" ? "rtl" : "ltr"} value="team">
              <TeamManagement />
            </TabsContent>
          </Tabs>

          <QuickActions />
        </div>
      </div>
    </div>
  );
}
