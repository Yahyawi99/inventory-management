"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
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
  LogOut,
  MapPin,
  Monitor,
  RefreshCw,
  Smartphone,
  SmartphoneIcon,
  Tablet,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Session } from "@/types/users";

interface SecuritySectionProps {
  isTwoFactorEnabled: boolean;
  setIsTwoFactorEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

const timeSince = (dateString: string) => {
  const date = new Date(dateString);
  const seconds = Math.floor((Number(new Date()) - Number(date)) / 1000);

  if (seconds < 30) return "Active now";

  let interval = seconds / 31536000;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " years ago" : " year ago")
    );
  interval = seconds / 2592000;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " months ago" : " month ago")
    );
  interval = seconds / 86400;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " days ago" : " day ago")
    );
  interval = seconds / 3600;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " hours ago" : " hour ago")
    );
  interval = seconds / 60;
  if (interval >= 1)
    return (
      Math.floor(interval) +
      (Math.floor(interval) > 1 ? " minutes ago" : " minute ago")
    );

  return "Active now";
};

const parseUserAgent = (userAgent: string) => {
  if (!userAgent) {
    return { device: "Unknown Client/Device", Icon: Monitor };
  }

  let device = "Unknown Device";
  let Icon = Monitor;
  let browser = "Unknown Browser";

  // 1. Browser Detection
  if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
    browser = "Safari";
  else if (userAgent.includes("Edge")) browser = "Edge";

  // 2. Device/OS Detection
  if (/(iPhone|iPod)/i.test(userAgent)) {
    device = "iPhone / iOS";
    Icon = SmartphoneIcon;
  } else if (/(iPad|tablet)/i.test(userAgent)) {
    device = "iPad / Tablet";
    Icon = Tablet;
  } else if (/(Android)/i.test(userAgent)) {
    device = userAgent.includes("Mobile") ? "Android Mobile" : "Android Tablet";
    Icon = userAgent.includes("Mobile") ? Smartphone : Tablet;
  } else if (userAgent.includes("Windows NT")) {
    device = "Windows Desktop";
    Icon = Monitor;
  } else if (userAgent.includes("Macintosh")) {
    device = "Mac OS Desktop";
    Icon = Monitor;
  } else if (userAgent.includes("Linux")) {
    device = "Linux Desktop";
    Icon = Monitor;
  } else {
    device = "Unknown OS";
  }

  return { device: `${browser} on ${device}`, Icon };
};
// ============

export default function SecuritySection({
  isTwoFactorEnabled,
  setIsTwoFactorEnabled,
}: SecuritySectionProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [userSessions, setUserSessions] = useState<any[] | null>(null);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const router = useRouter();
  const { user } = useAuth();

  const updatePassword = async () => {
    if (data.newPassword !== data.confirmPassword) {
      setMessage("Please provide matched password!!");
      return;
    }

    setIsLoading(true);
    try {
      await authClient.changePassword(
        {
          newPassword: data.newPassword,
          currentPassword: data.currentPassword,
          revokeOtherSessions: true,
        },
        {
          onError: (ctx) => {
            setMessage(ctx.error.message as string);
            setIsSuccess(false);
          },
          onSuccess: async (ctx) => {
            setMessage("Password updated successfully! redirecting...");
            setIsSuccess(true);

            await authClient.signOut();
            router.push("/auth/sign-in");
          },
        }
      );
    } catch (error: any) {
      setIsSuccess(false);
      setIsSuccess(error.message || "Failed to update the password!");
    } finally {
      setIsLoading(false);
    }
  };

  // sessions
  const fetchSessions = async () => {
    try {
      // all sessions
      const { data, error } =
        await authClient.multiSession.listDeviceSessions();

      if (error) {
        setIsSuccess(false);
        setMessage(error.message as string);
        return;
      }

      const processedSessions = data?.map(({ session }) => {
        // Use session.userAgent directly from the input type
        const { device, Icon } = parseUserAgent(session.userAgent as string);
        // Use session.updatedAt directly from the input type
        const lastActive = timeSince(session.updatedAt.toISOString());
        return {
          ...session,
          device,
          Icon, // The React component for the device type (e.g., Monitor)
          lastActive,
          // Handle optional ipAddress field
          ip: session.ipAddress || "IP Redacted / Unknown",
        };
      });

      setUserSessions(processedSessions);

      // current session
      const currentSession = await authClient.getSession();
      if (currentSession.error) {
        setIsSuccess(false);
        setMessage(currentSession.error.message as string);
        return;
      }
      setCurrentSession(currentSession.data);
    } catch (error) {
      setIsSuccess(false);
      setMessage("Can't fetch User Sessions");
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

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
                value={data.currentPassword}
                onChange={(e) =>
                  setData((prev) => ({
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
              value={data.newPassword}
              onChange={(e) =>
                setData((prev) => ({
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
              value={data.confirmPassword}
              onChange={(e) =>
                setData((prev) => ({
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

          <Button disabled={isLoading} onClick={updatePassword}>
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            Update Password
          </Button>

          {message && (
            <div
              className={`p-4 rounded-lg text-sm text-center font-medium ${
                isSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Login Sessions</CardTitle>
          <CardDescription>
            Manage and revoke sessions where your account is currently logged
            in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userSessions &&
              userSessions.map((session) => {
                const current = session.id === currentSession?.session.id;
                return (
                  <div
                    key={session.id}
                    className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 transition duration-150 ease-in-out border rounded-xl ${
                      current
                        ? "border-green-300 bg-green-50 shadow-md"
                        : "border-gray-100 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start space-x-4 mb-3 sm:mb-0 w-full sm:w-auto">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                          current ? "bg-green-200" : "bg-blue-100"
                        }`}
                      >
                        <session.Icon
                          className={`w-6 h-6 ${
                            current ? "text-green-800" : "text-blue-600"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 flex-wrap">
                          <p className="font-semibold text-gray-900 text-lg">
                            {session.device}
                          </p>
                          {current && (
                            <Badge variant="default">Current Session</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          <MapPin className="inline w-3 h-3 mr-1 text-gray-400" />
                          {session.location} •{" "}
                          <span
                            className={`font-medium ${
                              current ? "text-green-700" : "text-gray-700"
                            }`}
                          >
                            {session.lastActive}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          IP Address: {session.ip}
                        </p>
                      </div>
                    </div>

                    <div className="flex-shrink-0 self-end sm:self-center">
                      {!current ? (
                        <Button
                          variant="outline"
                          size="sm"
                          // onClick={() => revokeSession(session.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                        >
                          <LogOut className="w-4 h-4 mr-1.5" />
                          Revoke
                        </Button>
                      ) : (
                        <p className="text-sm font-medium text-green-700 italic">
                          <span className="hidden sm:inline">
                            Authenticated
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="default"
              // onClick={signOutOthers}
              disabled={!(userSessions && userSessions.length > 1)}
              className={`w-full ${
                userSessions && userSessions.length > 1
                  ? "shadow-lg shadow-blue-500/50"
                  : ""
              }`}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out All Other Sessions (
              {(userSessions && userSessions.length - 1) || 0})
            </Button>
            {!(userSessions && userSessions.length > 1) && (
              <p className="text-center text-xs text-gray-500 mt-2">
                No other active sessions detected.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
