import { User as TUser } from "@/types/users";
import { formatDate } from "@/utils/dateHelpers";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  Badge,
} from "app-core/src/components";
import { CheckCircle, Mail, MapPin, Phone, Shield, User } from "lucide-react";

export default function Profile({ userData }: { userData: TUser }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-24 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800"></div>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-6 -mt-12 mb-6">
          <Avatar className="w-20 h-20 sm:w-24 sm:h-24 border-4 border-white shadow-lg mx-auto sm:mx-0">
            <AvatarImage src={userData?.image || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl sm:text-2xl font-semibold">
              {userData?.name
                ? userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 sm:mt-12 flex-1 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {userData?.name || "Unknown User"}
                </h2>
                <Badge variant="secondary" className="mt-2">
                  {userData?.memberRole || "Member"}
                </Badge>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  Member since {formatDate(userData?.memberSince as string)}
                </p>
              </div>
              <div className="mt-3 sm:mt-0 sm:text-right space-y-2">
                {userData?.emailVerified && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200"
                  >
                    <CheckCircle className="w-3 h-3 mr-1" /> Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                {userData?.email ? (
                  <p className="font-medium text-gray-900 break-words">
                    {userData.email}
                  </p>
                ) : (
                  <p className="text-xs text-black opacity-90 mt-2 line-through">
                    Not provided
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Organization Phone</p>
                {userData?.currentOrganization?.phone ? (
                  <p className="font-medium text-gray-900">
                    {userData?.currentOrganization?.phone}
                  </p>
                ) : (
                  <p className="text-xs text-black opacity-90 mt-2 line-through">
                    Not provided
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                {userData?.id ? (
                  <p className="font-mono text-sm font-medium text-gray-900 break-words">
                    {userData.id}
                  </p>
                ) : (
                  <p className="text-xs text-black opacity-90 mt-2 line-through">
                    Not provided
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                {userData?.currentOrganization?.address ? (
                  <p className="text-sm font-medium text-gray-900 break-words">
                    {userData.currentOrganization.address}
                  </p>
                ) : (
                  <p className="text-xs text-black opacity-90 mt-2 line-through">
                    Not provided
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-500">Two-Factor Auth</p>
                <Badge
                  variant={
                    userData?.twoFactorEnabled ? "default" : "destructive"
                  }
                >
                  {userData?.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
