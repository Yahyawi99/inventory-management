"use client";

import { useEffect, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "app-core/src/components";
import { Eye, EyeOff, Lock, LogOut, MapPin, RefreshCw } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Session } from "@/types/users";
import { timeSince, parseUserAgent } from "@/utils/users";

export default function SecuritySection() {
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

  const t = useTranslations("personal_settings_page.security_section");

  const updatePassword = async () => {
    if (!data.currentPassword || !data.newPassword || !data.confirmPassword) {
      setMessage(t("messages.password.error_required"));
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      setMessage(t("messages.password.error_mismatch"));
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
            setMessage(t("messages.password.success_updated"));
            setIsSuccess(true);

            await authClient.signOut();
            router.push("/auth/sign-in");
          },
        },
      );
    } catch (error: any) {
      setIsSuccess(false);
      setIsSuccess(error.message || t("messages.password.error_generic"));
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
        const { device, Icon } = parseUserAgent(session.userAgent as string);
        const lastActive = timeSince(session.updatedAt.toISOString());
        return {
          ...session,
          device,
          Icon,
          lastActive,
          ip: session.ipAddress || t("messages.sessions.ip_fallback"),
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
      setMessage(t("messages.sessions.error_fetch_generic"));
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card className="shadow-md shadow-accent">
        <CardHeader>
          <CardTitle>{t("password_card.title")}</CardTitle>
          <CardDescription>{t("password_card.subtitle")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">
              {t("password_card.fields.current")}
            </Label>
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
                className="absolute right-3 top-2.5 text-muted-foreground/50 hover:text-muted-foreground"
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
            <Label htmlFor="new-password">
              {t("password_card.fields.new")}
            </Label>
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
            <Label htmlFor="confirm-password">
              {t("password_card.fields.confirm")}
            </Label>
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
          <div className="p-3 bg-background rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">
              {t("password_card.requirements.title")}
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• {t("password_card.requirements.item_1")}</li>
              <li>• {t("password_card.requirements.item_2")}</li>
              <li>• {t("password_card.requirements.item_3")}</li>
              <li>• {t("password_card.requirements.item_4")}</li>
            </ul>
          </div>

          <Button
            className="bg-sidebar hover:bg-sidebar hover:opacity-75"
            disabled={isLoading}
            onClick={updatePassword}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Lock className="w-4 h-4 mr-2" />
            )}
            {t("password_card.action")}
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
          <CardTitle>{t("sessions_card.title")}</CardTitle>
          <CardDescription>{t("sessions_card.subtitle")}</CardDescription>
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
                        ? "border-green-300 bg-green-50 hover:bg-green-100"
                        : "border-gray-100 bg-white hover:bg-gray-50 dark:bg-background dark:border-accent"
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
                          <p
                            className={`font-semibold text-lg ${
                              current ? "text-gray-900" : "text-foreground"
                            }`}
                          >
                            {session.device}
                          </p>
                          {current && (
                            <Badge
                              className="bg-card text-muted-foreground dark:text-white"
                              variant="default"
                            >
                              {t("sessions_card.current_label")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted mt-1">
                          <MapPin className="inline w-3 h-3 mr-1 text-muted-foreground/60" />
                          {session.location}
                          <span
                            className={`font-medium ${
                              current
                                ? "text-green-700"
                                : "text-muted-foreground"
                            }`}
                          >
                            • {session.lastActive}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {t("sessions_card.ip_label")}: {session.ip}
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
                          {t("sessions_card.revoke")}
                        </Button>
                      ) : (
                        <p className="text-sm font-medium text-green-700 italic">
                          <span className="hidden sm:inline">
                            {t("sessions_card.authenticated")}
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
              className={`w-full bg-sidebar hover:bg-sidebar hover:opacity-75 ${
                userSessions && userSessions.length > 1
                  ? "shadow-lg shadow-blue-500/50"
                  : ""
              }`}
            >
              <LogOut className="w-5 h-5 mr-3" />
              {t("sessions_card.action_sign_out_others", {
                count: (userSessions && userSessions.length - 1) || 0,
              })}
            </Button>
            {!(userSessions && userSessions.length > 1) && (
              <p className="text-center text-xs text-gray-500 mt-2">
                {t("sessions_card.empty_state")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
