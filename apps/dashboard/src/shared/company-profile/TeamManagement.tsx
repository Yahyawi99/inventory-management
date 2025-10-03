"use client";

import { getInitials } from "@/utils/shared";
import { getRoleBadgeVariant } from "@/utils/organization";
import { formatDate } from "@/utils/dateHelpers";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarFallback,
  CardDescription,
  Button,
  Badge,
} from "app-core/src/components";
import { ChevronRight, Mail, Users } from "lucide-react";

export const recentMembers = [
  {
    id: 1,
    name: "Samantha Reyes",
    email: "sam@company.com",
    role: "Admin",
    joinedAt: "2024-08-15",
  },
  {
    id: 2,
    name: "Marcus Chen",
    email: "marcus@company.com",
    role: "Editor",
    joinedAt: "2024-09-01",
  },
  {
    id: 3,
    name: "Laura Martinez",
    email: "laura@company.com",
    role: "Viewer",
    joinedAt: "2024-09-10",
  },
  {
    id: 4,
    name: "David Lee",
    email: "david@company.com",
    role: "Guest",
    joinedAt: "2024-09-20",
  },
];

export const pendingInvitations = [
  {
    id: 101,
    email: "alex.doe@example.com",
    role: "Editor",
    invitedAt: "2024-09-23",
    expiresAt: "2024-09-24",
  },
  {
    id: 102,
    email: "jessica.k@example.com",
    role: "Viewer",
    invitedAt: "2024-09-28",
    expiresAt: "2024-09-29",
  },
];

export default function TeamManagement() {
  return (
    <div className="space-y-6">
      {/* Team Members */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Team Members</CardTitle>
              <CardDescription>
                Last active and recently joined team members.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Members
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMembers.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-xl hover:bg-blue-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge className={getRoleBadgeVariant(member.role)}>
                    {member.role}
                  </Badge>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Joined: {formatDate(member.joinedAt)}
                  </p>
                  <Button variant="ghost" size="sm">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      {pendingInvitations.length > 0 && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader className="border-amber-300">
            <CardTitle className="text-amber-800">
              Pending Invitations ({pendingInvitations.length})
            </CardTitle>
            <CardDescription className="text-amber-700">
              Invites sent awaiting acceptance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInvitations.map((invitation, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-amber-300 bg-white rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {invitation.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        Expires: {formatDate(invitation.expiresAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <Badge className={getRoleBadgeVariant(invitation.role)}>
                      {invitation.role}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex"
                    >
                      Resend
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
