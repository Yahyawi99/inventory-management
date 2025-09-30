import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "app-core/src/components";
import OrganizationInfo from "@/shared/company-profile/OrganizationInfo";
import OrganizationStats from "@/shared/company-profile/OrganizationStats";
import MembersList from "@/shared/company-profile/MembersList";
import Invitations from "@/shared/company-profile/Invitations";
import QuickActions from "@/shared/company-profile/QuickActions";
import OrgHealth from "@/shared/company-profile/OrgHealth";
import RecentActivity from "@/shared/company-profile/RecentActivity";

export default function CompanyProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-1">Company Profile</h1>
        <p className="mb-6">
          Manage your organization information and settings
        </p>

        <Tabs defaultValue="info">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger className="cursor-pointer" value="info">
              Info
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="stats">
              Overview
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="team">
              Team
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="activity">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <OrganizationInfo />
            <Invitations />
          </TabsContent>

          <TabsContent value="stats">
            <OrganizationStats />
            <OrgHealth />
          </TabsContent>

          <TabsContent value="team">
            <MembersList />
          </TabsContent>

          <TabsContent value="activity">
            <RecentActivity />
            <QuickActions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
