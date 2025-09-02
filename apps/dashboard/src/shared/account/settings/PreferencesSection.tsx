"use client";
import { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  Label,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  Select,
  Separator,
} from "app-core/src/components";
import {
  Clock,
  Globe,
  Monitor,
  Moon,
  RefreshCw,
  Save,
  Sun,
} from "lucide-react";

interface PreferencesSectionProps {
  isLoading: boolean;
}

export default function PreferencesSection({
  isLoading,
}: PreferencesSectionProps) {
  const [preferences, setPreferences] = useState({
    theme: "system",
    language: "en",
    timezone: "America/Denver",
    dateFormat: "MM/dd/yyyy",
    currency: "USD",
    itemsPerPage: "25",
    defaultView: "grid",
    autoSave: true,
    compactMode: false,
  });
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>
            Customize how the interface looks and behaves for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, theme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center">
                      <Sun className="w-4 h-4 mr-2" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center">
                      <Moon className="w-4 h-4 mr-2" />
                      Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center">
                      <Monitor className="w-4 h-4 mr-2" />
                      System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
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
                      English (US)
                    </div>
                  </SelectItem>
                  <SelectItem value="en-gb">English (UK)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={preferences.timezone}
                onValueChange={(value) =>
                  setPreferences((prev) => ({ ...prev, timezone: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/Denver">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Mountain Time (MT)
                    </div>
                  </SelectItem>
                  <SelectItem value="America/New_York">
                    Eastern Time (ET)
                  </SelectItem>
                  <SelectItem value="America/Los_Angeles">
                    Pacific Time (PT)
                  </SelectItem>
                  <SelectItem value="America/Chicago">
                    Central Time (CT)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
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
              Interface Preferences
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="items-per-page">Items Per Page</Label>
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
                    <SelectItem value="10">10 items</SelectItem>
                    <SelectItem value="25">25 items</SelectItem>
                    <SelectItem value="50">50 items</SelectItem>
                    <SelectItem value="100">100 items</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-save Changes</p>
                <p className="text-sm text-gray-500">
                  Automatically save form changes as you type
                </p>
              </div>
              <Switch
                checked={preferences.autoSave}
                onCheckedChange={(checked) =>
                  setPreferences((prev) => ({ ...prev, autoSave: checked }))
                }
              />
            </div>
          </div>

          <Button disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Preferences
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
