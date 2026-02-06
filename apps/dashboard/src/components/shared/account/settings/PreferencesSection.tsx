"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "@/context";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Select,
  Separator,
} from "app-core/src/components";
import { Globe, Monitor, Moon, RefreshCw, Save, Sun } from "lucide-react";

interface PreferencesSectionProps {
  isLoading: boolean;
}

export default function PreferencesSection({
  isLoading,
}: PreferencesSectionProps) {
  const t = useTranslations("personal_settings_page.preferences_section");
  const locale = useLocale();

  const { theme, setTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    theme,
    language: locale,
    dateFormat: "MM/dd/yyyy",
    currency: "USD",
    itemsPerPage: "25",
  });

  return (
    <div className="space-y-6">
      <Card className="shadow-md shadow-accent">
        <CardHeader>
          <CardTitle>{t("display_card.title")}</CardTitle>
          <CardDescription>{t("display_card.subtitle")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">{t("display_card.fields.theme")}</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value) => {
                  setPreferences((prev) => ({ ...prev, theme: value }));
                  setTheme(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 mr-2" />
                      {t("display_card.light")}
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="w-4 h-4 mr-2" />
                      {t("display_card.dark")}
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      {t("display_card.sys")}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">
                {t("display_card.fields.language")}
              </Label>
              <Select
                value={preferences.language}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, language: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      {t("display_card.en")}
                    </div>
                  </SelectItem>
                  <SelectItem value="fr">{t("display_card.fr")}</SelectItem>
                  <SelectItem value="ar">{t("display_card.ar")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-format">
                {t("display_card.fields.date")}
              </Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, dateFormat: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              {t("interface_card.title")}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="items-per-page">
                  {t("interface_card.fields.items_per_page")}
                </Label>
                <Select
                  value={preferences.itemsPerPage}
                  onValueChange={(value) =>
                    setPreferences((prev) => ({ ...prev, itemsPerPage: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select items per page" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            className="bg-sidebar hover:bg-sidebar hover:opacity-75"
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {t("action")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
