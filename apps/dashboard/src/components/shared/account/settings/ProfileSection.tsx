"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { authClient } from "@/lib/auth-client";
import { UserSettings } from "@/types/users";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "app-core/src/components/ui/avatar";
import { Button } from "app-core/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "app-core/src/components/ui/card";
import { Input } from "app-core/src/components/ui/input";
import { Label } from "app-core/src/components/ui/label";
import { AlertTriangle, Camera, Check, RefreshCw, Save } from "lucide-react";

interface ProfileSectionProps {
  user: UserSettings;
  setUser: React.Dispatch<React.SetStateAction<UserSettings>>;
  isFetchingUser: boolean;
}

const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif"];

export default function ProfileSection({
  user,
  setUser,
  isFetchingUser,
}: ProfileSectionProps) {
  const oldEmail = useRef("");

  const t = useTranslations("personal_settings_page.profile_section");

  useEffect(() => {
    oldEmail.current = user.email;
  }, [isFetchingUser]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifyLoading, setIsVerifyLoading] = useState(false);

  // Trigger the hidden file input
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Handle the file upload logic
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(null);
    const file = e.target.files?.[0];

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setIsSuccess(false);
      setMessage(t("messages.upload.error_invalid_file"));
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setIsSuccess(false);
      setMessage(
        t("messages.upload.error_size_limit", {
          maxSize: MAX_SIZE_MB,
        }),
      );
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(t("messages.upload.error_failed"));
      }

      const {
        URL: { secure_url },
      } = await response.json();

      setUser({ ...user, image: secure_url });

      setIsSuccess(true);
      setMessage(t("messages.upload.success_image_changed"));
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error: any) {
      setIsSuccess(false);
      setMessage(error.message || t("messages.upload.error_generic"));
    } finally {
      setIsUploading(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle removing the profile image
  const handleRemoveImage = () => {
    if (!user.image) return;

    setUser({ ...user, image: null });
    setIsSuccess(true);
    setMessage(t("messages.remove_image.success_removed"));
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  // Save all user profile changes
  const updateUser = async () => {
    if (!user.name || !user.email) {
      setIsSuccess(false);
      setMessage(t("messages.update.error_validation"));
      return;
    }

    setMessage(null);
    setIsLoading(true);

    try {
      await authClient.updateUser({
        image: user.image,
        name: user.name,
      });

      if (oldEmail.current !== user.email) {
        try {
          await authClient.changeEmail({
            newEmail: user.email,
            callbackURL: "/en/account",
          });
        } catch (error) {
          setIsSuccess(false);
          setMessage(t("messages.update.error_email_failed"));
          return;
        }
      }

      setIsSuccess(true);
      setMessage(t("messages.update.success_updated"));
    } catch (error: any) {
      setIsSuccess(false);
      setMessage(error.message || t("messages.update.error_generic"));
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email
  const sendVerificationLink = async () => {
    setIsVerifyLoading(true);

    try {
      await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: "/en/account",
      });

      setIsSuccess(true);
      setMessage(t("messages.verification.success_sent"));
    } catch (error) {
      setIsSuccess(false);
      setMessage(t("messages.verification.error_failed"));
      return;
    } finally {
      setIsVerifyLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md shadow-accent">
        <CardHeader>
          <CardTitle>{t("card_title")}</CardTitle>
          <CardDescription>{t("card_subtitle")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.image || undefined} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-semibold text-white">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            {/* Hidden file input */}
            <Input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept={ACCEPTED_TYPES.join(",")}
            />

            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAvatarClick}
                disabled={isUploading}
              >
                {isUploading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {isUploading ? t("photo.uploading") : t("photo.change")}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={handleRemoveImage}
                disabled={isUploading}
              >
                {t("photo.remove")}
              </Button>
              <p className="text-sm text-gray-500">
                {t("photo.hint", { value: 2 })}
              </p>
            </div>
          </div>

          {/* User Details Form */}
          <div className="space-y-4">
            {/* ... (rest of the form for name and email is unchanged) ... */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("fields.full_name")}</Label>
              <Input
                id="name"
                value={user.name}
                onChange={(e) => {
                  setUser({ ...user, name: e.currentTarget.value });
                }}
                placeholder="Yassine"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t("fields.email")}</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.currentTarget.value });
                  }}
                  className="pr-10"
                  placeholder="youremail@gmail.com"
                />
                {user.emailVerified && (
                  <Check className="absolute right-3 top-2.5 h-5 w-5 text-green-500" />
                )}
              </div>
              {user.emailVerified ? (
                <p className="flex items-center text-sm text-green-600">
                  <Check className="mr-1 h-4 w-4" />
                  {t("messages.email_verified")}
                </p>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="flex items-center text-sm text-amber-600">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    {t("messages.email_not_verified")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendVerificationLink}
                    disabled={isVerifyLoading}
                  >
                    {isVerifyLoading
                      ? t("messages.sending")
                      : t("actions.verify")}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Message Display */}
          {message && (
            <p
              className={
                isSuccess ? "text-sm text-green-600" : "text-sm text-red-600"
              }
            >
              {message}
            </p>
          )}

          <Button disabled={isLoading || isUploading} onClick={updateUser}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {t("actions.save")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
