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
  return (
    <div className="lg:w-64 flex-shrink-0">
      <Card>
        <CardContent className="p-2">
          <nav className="space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-start space-x-3 px-3 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm">{tab.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {tab.description}
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
