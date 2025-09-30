import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "app-core/src/components";
import OrganizationInfo from "@/shared/company-profile/OrganizationInfo";
import TeamManagement from "@/shared/company-profile/TeamManagement";
import OverviewMetrics from "@/shared/company-profile/OverviewMetrics";
import QuickActions from "@/shared/company-profile/QuickActions";

export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-1">Company Profile</h1>
        <p className="mb-6">
          Manage your organization information and settings
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Tabs defaultValue="info" className="lg:col-span-2 space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-3xl">
              <TabsTrigger className="cursor-pointer" value="info">
                Info
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="stats">
                Overview
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="team">
                Team
              </TabsTrigger>
            </TabsList>

            {/* info */}
            <TabsContent value="info">
              <OrganizationInfo />
            </TabsContent>

            {/* stats */}
            <TabsContent value="stats">
              <OverviewMetrics />
            </TabsContent>

            {/* team */}
            <TabsContent value="team">
              <TeamManagement />
            </TabsContent>
          </Tabs>

          <QuickActions />
        </div>
      </div>
    </div>
  );
}
