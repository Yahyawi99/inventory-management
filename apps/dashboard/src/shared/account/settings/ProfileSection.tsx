import { authClient } from "@/lib/auth-client";
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
import { useRef, useState } from "react";

interface ProfileSectionProps {
  user: UserSettings;
  setUser: React.Dispatch<React.SetStateAction<UserSettings>>;
}

const MAX_SIZE_MB = Number(process.env.MAX_SIZE_MB);
const ACCEPTED_TYPES = process.env.ACCEPTED_TYPES?.split(",") || [];
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

export default function ProfileSection({ user, setUser }: ProfileSectionProps) {
  const oldEmail = user.email;

  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(user.image);

  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // upload image
  const handleFileChange = async (event: any) => {
    const file = event.currentTarget.files[0];
    // setisS(null);
    setMessage(null);

    if (!file) {
      return;
    }

    // Validate file type and size
    if (!ACCEPTED_TYPES.includes(file.type)) {
      // setError("Invalid file type. Please use JPG, PNG, or GIF.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      // setError(`File size exceeds the ${MAX_SIZE_MB}MB limit.`);
      return;
    }

    // setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${"CLOUDINARY_CLOUD_NAME"}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary.");
      }

      const data = await response.json();
      setProfileImage(data.secure_url);
      setMessage("Profile picture updated successfully!");
    } catch (err) {
      // setError("Failed to upload the image. Please try again.");
      console.error(err);
    } finally {
      // setLoading(false);
      // Reset the file input value to allow the same file to be selected again
      // fileInputRef.current.value = null;
    }
  };

  // save user profile
  const updateUser = async () => {
    console.log(user);
    if (!user.name || !user.email) {
      setIsSuccess(false);
      setMessage("Please provide valid name and email!");
      return;
    }

    setMessage(null);
    setIsLoading(true);

    try {
      // update image and name
      if (user.name)
        await authClient.updateUser(
          {
            image: user.image,
            name: user.name,
          },
          {
            onError: (ctx) => {
              setIsSuccess(false);
              setMessage(ctx.error.message);
            },
          }
        );

      // update email
      if (oldEmail !== user.email) {
        await authClient.changeEmail(
          {
            newEmail: user.email,
            callbackURL: "/en",
          },
          {
            onError: (ctx) => {
              setIsSuccess(false);
              setMessage(ctx.error.message);
            },
          }
        );
      }

      setIsSuccess(true);
      setMessage("Profile updated successfully!");
    } catch (error: any) {
      setIsSuccess(false);
      setMessage(error.message || "Failed to update user profile");
    } finally {
      setIsLoading(false);
    }
  };

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
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-semibold">
                {user.name
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
                value={user.name}
                onChange={(e) => {
                  setUser({ ...user, name: e.currentTarget.value });
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.currentTarget.value });
                  }}
                  className="pr-10"
                />
                {user.emailVerified && (
                  <Check className="absolute right-3 top-2.5 w-5 h-5 text-green-500" />
                )}
              </div>
              {user.emailVerified ? (
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

          <Button disabled={isLoading} onClick={updateUser}>
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
