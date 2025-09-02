"use client";

import { useState } from "react";
import { UserSettings } from "@/types/users";
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Switch,
  Label,
} from "app-core/src/components";
import {
  Check,
  Eye,
  EyeOff,
  Lock,
  Monitor,
  RefreshCw,
  Smartphone,
} from "lucide-react";

interface SecuritySectionProps {
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  isLoading: boolean;
}

export default function SecuritySection({
  userSettings,
  setUserSettings,
  isLoading,
}: SecuritySectionProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showPassword ? "text" : "password"}
                value={userSettings.currentPassword}
                onChange={(e) =>
                  setUserSettings((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={userSettings.newPassword}
              onChange={(e) =>
                setUserSettings((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={userSettings.confirmPassword}
              onChange={(e) =>
                setUserSettings((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>

          {/* Password Requirements */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Password Requirements:
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• At least 8 characters long</li>
              <li>• Contains uppercase and lowercase letters</li>
              <li>• Contains at least one number</li>
              <li>• Contains at least one special character</li>
            </ul>
          </div>

          <Button disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userSettings.twoFactorEnabled ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                <Smartphone
                  className={`w-5 h-5 ${
                    userSettings.twoFactorEnabled
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">Authenticator App</p>
                <p className="text-sm text-gray-500">
                  {userSettings.twoFactorEnabled
                    ? "Two-factor authentication is enabled"
                    : "Secure your account with 2FA"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {userSettings.twoFactorEnabled && (
                <Button variant="outline" size="sm">
                  View Codes
                </Button>
              )}
              <Switch
                checked={userSettings.twoFactorEnabled}
                onCheckedChange={(checked) =>
                  setUserSettings((prev) => ({
                    ...prev,
                    twoFactorEnabled: checked,
                  }))
                }
              />
            </div>
          </div>
          {userSettings.twoFactorEnabled && (
            <Alert className="mt-4">
              <Check className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is active. Make sure to save your
                backup codes in a secure location.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                device: "Chrome on MacBook Pro",
                location: "Denver, CO",
                current: true,
                lastActive: "Active now",
                ip: "192.168.1.100",
              },
              {
                device: "Mobile App on iPhone",
                location: "Denver, CO",
                current: false,
                lastActive: "2 hours ago",
                ip: "192.168.1.101",
              },
              {
                device: "Firefox on Windows",
                location: "Los Angeles, CA",
                current: false,
                lastActive: "1 day ago",
                ip: "10.0.0.5",
              },
            ].map((session, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Monitor className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">
                        {session.device}
                      </p>
                      {session.current && (
                        <Badge variant="secondary">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {session.location} • {session.lastActive}
                    </p>
                    <p className="text-xs text-gray-400">{session.ip}</p>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700"
            >
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
