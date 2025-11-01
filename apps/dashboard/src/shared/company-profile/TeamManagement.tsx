"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { getInitials } from "@/utils/shared";
import { getRoleBadgeVariant } from "@/utils/organization";
import { formatDate } from "@/utils/dateHelpers";
import { Invitation, Member } from "@/types/organization";
import { authClient } from "@/lib/auth-client";
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
import {
  AlertCircle,
  ChevronRight,
  Mail,
  RefreshCw,
  Users,
} from "lucide-react";
import { UserRoles } from "@/types/users";

export default function TeamManagement() {
  const [recentMembers, setRecentMembers] = useState<Member[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [pendingInvitations, setPendingInvitations] = useState<
    Invitation[] | null
  >(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [invitationError, setInvitationError] = useState<string | null>(null);

  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const fetchRecentUsers = async () => {
    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch("/api/organization/recent-members");

      if (!response.ok) {
        throw new Error(
          "Something went wrong while trying to fetch recent members!"
        );
      }

      const { members } = await response.json();
      setRecentMembers(members);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch recent members!"
      );
    } finally {
      setIsFetching(false);
    }
  };

  const fetchInvitations = async () => {
    setIsLoading(true);
    setInvitationError(null);

    try {
      await authClient.organization.listInvitations(
        {},
        {
          onSuccess: (ctx) => {
            const invitations = ctx.data.filter(
              (invitation: Invitation) => invitation.status === "pending"
            );

            setPendingInvitations(invitations);
          },
          onError: (ctx) => {
            setInvitationError(ctx.error.message);
          },
        }
      );
    } catch (error) {
      setInvitationError(
        error instanceof Error
          ? error.message
          : "Failed to fetch recent members!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendInvitation = async (email: string, userRole: string) => {
    await authClient.organization.inviteMember({
      email,
      role: userRole as UserRoles,
    });
  };

  const cancelInvitation = async (id: string) => {
    await authClient.organization.cancelInvitation({
      invitationId: id,
    });

    fetchInvitations();
  };

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (isAuthenticated && !isAuthLoading) {
      fetchRecentUsers();
      fetchInvitations();
    }
  }, [isAuthenticated, isAuthLoading, user]);

  return (
    <div className="space-y-6">
      {/* Team Members */}
      {!error && !isFetching && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Team Members</CardTitle>
                <CardDescription>
                  Last active and recently joined team members.
                </CardDescription>
              </div>

              <Link href="/en/account/premissions">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Members
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              {recentMembers && recentMembers.length ? (
                recentMembers.map((member, index) => {
                  const { user } = member;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-xl hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleBadgeVariant(member.role)}>
                          {user.role}
                        </Badge>
                        <p className="text-xs text-gray-500 hidden sm:block">
                          Joined: {formatDate(member.createdAt)}
                        </p>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-[16px] text-center mt-3">
                  No Recent Members Found!
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-2 text-[14px]">
          <CardHeader>
            <CardTitle>Recent Team Members</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              Failed to Load recent team members
            </p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <Button onClick={() => fetchRecentUsers()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {isFetching && (
        <Card className="mb-2 text-[14px]">
          <CardHeader>
            <CardTitle>Recent Team Members</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500">Loading recent team members...</p>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}

      {isLoading && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader className="border-amber-300">
            <CardTitle className="text-amber-800">
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 text-amber-300 animate-spin mb-4" />
            <p className="text-amber-300">Loading pending invitations...</p>
          </CardContent>
        </Card>
      )}

      {invitationError && (
        <Card className="border-amber-300 bg-amber-50">
          <CardHeader className="border-amber-300">
            <CardTitle className="text-amber-800">
              Pending Invitations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-amber-500 font-medium mb-2">
              Failed to Load pending invitations
            </p>
            <p className="text-amber-500 text-sm mb-2">{error}</p>
            <Button onClick={() => fetchInvitations()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {pendingInvitations &&
        !invitationError &&
        !isLoading &&
        pendingInvitations.length > 0 && (
          <Card className="border-amber-300 bg-amber-50">
            <CardHeader className="border-amber-300">
              <CardTitle className="text-amber-800">
                Pending Invitations ({pendingInvitations?.length})
              </CardTitle>
              <CardDescription className="text-amber-700">
                Invites sent awaiting acceptance.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {pendingInvitations?.map((invitation, index) => (
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
                        onClick={() =>
                          resendInvitation(invitation.email, invitation.role)
                        }
                        variant="outline"
                        size="sm"
                        className="md:flex"
                      >
                        Resend
                      </Button>
                      <Button
                        onClick={() => cancelInvitation(invitation.id)}
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
