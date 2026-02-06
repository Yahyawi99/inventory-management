import { useTranslations } from "next-intl";
import { Card, CardContent } from "app-core/src/components";
import { Database, Palette, Shield, User } from "lucide-react";
import React, { SetStateAction } from "react";

const TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    description: "Personal information",
  },
  {
    id: "security",
    label: "Security",
    icon: Shield,
    description: "Password & authentication",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: Palette,
    description: "Display & behavior",
  },
  {
    id: "data",
    label: "Data & Privacy",
    icon: Database,
    description: "Data management",
  },
];

interface SettingsNavigationProps {
  setActiveTab: React.Dispatch<SetStateAction<string>>;
  activeTab: string;
}

export default function SettingsNavigation({
  setActiveTab,
  activeTab,
}: SettingsNavigationProps) {
  const t = useTranslations("personal_settings_page.tabs");
  return (
    <div className="lg:w-64 flex-shrink-0">
      <Card className="shadow-md shadow-accent">
        <CardContent className="p-2">
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start space-x-3 px-3 py-3 text-left rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-accent dark:border-sidebar dark:text-primary"
                      : "text-muted-foreground hover:bg-blue-50 dark:hover:bg-accent"
                  }`}
                >
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="w-fit font-medium text-sm">
                      {t(`${tab.id}.title`)}
                    </p>
                    <p className="w-fit text-xs text-muted-foreground/50 mt-0.5">
                      {t(`${tab.id}.subtitle`)}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </CardContent>
      </Card>
    </div>
  );
}
