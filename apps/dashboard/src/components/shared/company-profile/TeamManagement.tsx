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
import { useTranslations } from "next-intl";
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

  const t = useTranslations("company_profile_page.tab-3");

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
          "Something went wrong while trying to fetch recent members!",
        );
      }

      const { members } = await response.json();
      setRecentMembers(members);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : t("recent_members.messages.error-1"),
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
              (invitation: Invitation) => invitation.status === "pending",
            );

            setPendingInvitations(invitations);
          },
          onError: (ctx) => {
            setInvitationError(ctx.error.message);
          },
        },
      );
    } catch (error) {
      setInvitationError(
        error instanceof Error
          ? error.message
          : t("recent_members.messages.error-1"),
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
    <div className="space-y-6 ">
      {/* Team Members */}
      {!error && !isFetching && (
        <Card className="shadow-md shadow-accent">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t("recent_members.title")}</CardTitle>
                <CardDescription>
                  {t("recent_members.subtitle")}
                </CardDescription>
              </div>

              <Link href="/en/account/premissions">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  {t("actions.manage")}
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
                      className="flex items-center justify-between p-3 border rounded-xl hover:bg-blue-50/50 dark:hover:bg-border transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Badge className={getRoleBadgeVariant(member.role)}>
                          {member.role}
                        </Badge>

                        <p className="text-xs text-muted-foreground hidden sm:block">
                          {t("recent_members.joined")}:{" "}
                          {formatDate(member.createdAt)}
                        </p>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-[16px] text-center mt-3">
                  {t("recent_members.messages.empty_state")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="mb-2 text-[14px] shadow-md shadow-accent">
          <CardHeader>
            <CardTitle>{t("recent_members.title")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-muted-foreground font-medium mb-2">
              {t("recent_members.messages.error-2")}
            </p>
            <p className="text-muted-foreground text-sm mb-4">{error}</p>
            <Button onClick={() => fetchRecentUsers()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("actions.try")}
            </Button>
          </CardContent>
        </Card>
      )}

      {isFetching && (
        <Card className="mb-2 text-[14px] shadow-md shadow-accent">
          <CardHeader>
            <CardTitle>{t("recent_members.title")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <RefreshCw className="w-8 h-8 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground">
              {t("recent_members.messages.loading")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pending Invitations */}
      {isLoading && (
        <Card className="border-amber-300 bg-amber-50 shadow-md shadow-accent">
          <CardHeader className="border-amber-300">
            <CardTitle className="text-amber-800">
              {t("pending_invitations.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <RefreshCw className="w-8 h-8 text-amber-300 animate-spin mb-4" />
            <p className="text-amber-300">
              {t("pending_invitations.messages.loading")}
            </p>
          </CardContent>
        </Card>
      )}

      {invitationError && (
        <Card className="border-amber-300 bg-amber-50 shadow-md shadow-accent">
          <CardHeader className="border-amber-300">
            <CardTitle className="text-amber-800">
              {t("pending_invitations.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-amber-500 font-medium mb-2">
              {t("pending_invitations.messages.error-1")}
            </p>
            <p className="text-amber-500 text-sm mb-2">{error}</p>
            <Button onClick={() => fetchInvitations()} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t("actions.try")}
            </Button>
          </CardContent>
        </Card>
      )}

      {pendingInvitations &&
        !invitationError &&
        !isLoading &&
        pendingInvitations.length > 0 && (
          <Card className="border-amber-300 bg-amber-50 shadow-md shadow-accent">
            <CardHeader className="border-amber-300">
              <CardTitle className="text-amber-800">
                {t("pending_invitations.title")} ({pendingInvitations?.length})
              </CardTitle>
              <CardDescription className="text-amber-700">
                {t("pending_invitations.subtitle")}
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
                        <p className="font-medium text-black/80">
                          {invitation.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {t("pending_invitations.expires")}:{" "}
                          {formatDate(invitation.expiresAt)}
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
                        className="md:flex text-black"
                      >
                        {t("actions.resend")}
                      </Button>
                      <Button
                        onClick={() => cancelInvitation(invitation.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-transparent dark:hover:bg-transparent hover:text-red-600/50 dark:hover:text-red-600/50"
                      >
                        {t("actions.cancel")}
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
