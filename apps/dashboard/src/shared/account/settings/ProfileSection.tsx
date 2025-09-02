import { UserSettings } from "@/types/users";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "app-core/src/components";
import { AlertTriangle, Camera, Check, RefreshCw, Save } from "lucide-react";

interface ProfileSectionProps {
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
  isLoading: boolean;
}

export default function ProfileSection({
  userSettings,
  setUserSettings,
  isLoading,
}: ProfileSectionProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal profile information
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userSettings.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                {userSettings.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 mr-2" />
                Change Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
              <p className="text-sm text-gray-500">
                JPG, PNG or GIF. Max size 2MB.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={userSettings.name}
                onChange={(e) =>
                  setUserSettings((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={userSettings.email}
                  onChange={(e) =>
                    setUserSettings((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="pr-10"
                />
                {userSettings.emailVerified && (
                  <Check className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                )}
              </div>
              {userSettings.emailVerified ? (
                <p className="text-sm text-green-600 flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Email verified
                </p>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-amber-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Email not verified
                  </p>
                  <Button variant="outline" size="sm">
                    Send Verification
                  </Button>
                </div>
              )}
            </div>
          </div>

          <Button disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
