"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  DataTable,
  TableView,
} from "app-core/src/components";
import { getTableColumns, getUserFormConfig } from "@/constants/users";
import { FormConfig, Pagination } from "app-core/src/types";
import { SubmitData, User } from "@/types/users";

interface UsersCardProps {
  children?: React.ReactNode;
}

export default function UsersCard({ children }: UsersCardProps) {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const t = useTranslations("users_roles_page");

  const [tableUsers, setTableUsers] = useState<User[]>([]);
  const [userFormConfig, setUserFormConfig] =
    useState<FormConfig<SubmitData>>();
  const [isFetchingTableUsers, setIsFetchingTableUsers] = useState(false);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: null,
  });
  const [error, setError] = useState<string | null>("");

  // Table Users
  const fetchTableUsers = useCallback(async () => {
    if (!user || !user.activeOrganizationId) {
      setIsFetchingTableUsers(false);
      setError(t("messages.missingContext"));
      return;
    }

    setIsFetchingTableUsers(true);
    setError(null);
    try {
      const response = await fetch("/api/user");

      if (response.status !== 200) {
        throw new Error(response.statusText || t("messages.fetchFailed"));
      }

      const data = await response.json();

      setTableUsers(data.users);
      setPagination({ ...pagination, totalPages: data.totalPages });
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || t("messages.unexpectedError"));
    } finally {
      setIsFetchingTableUsers(false);
    }
  }, [user, isAuthenticated, pagination.page]);

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchTableUsers();
    }
  }, [isAuthLoading, fetchTableUsers]);

  // FormConfig data
  useEffect(() => {
    if (user?.activeOrganizationId)
      getUserFormConfig(t).then(setUserFormConfig);
  }, [user]);

  return (
    <>
      {children ? (
        <Card className="w-full rounded-3xl shadow-xl transition-all duration-300">
          <CardContent className="p-8 pt-0">
            {/* Header */}
            {children}

            {/* Table */}
            <TableView
              data={tableUsers}
              isFetchingData={isFetchingTableUsers}
              currentPage={pagination.page}
              totalPages={pagination?.totalPages ? pagination.totalPages : 0}
              setPagination={setPagination}
            >
              {userFormConfig && (
                <DataTable<User>
                  data={tableUsers}
                  columns={getTableColumns(t, userFormConfig)}
                />
              )}
            </TableView>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Table */}
          <TableView
            data={tableUsers}
            isFetchingData={isFetchingTableUsers}
            currentPage={pagination.page}
            totalPages={pagination?.totalPages ? pagination.totalPages : 0}
            setPagination={setPagination}
          >
            {userFormConfig && (
              <DataTable<User>
                data={tableUsers}
                columns={getTableColumns(t, userFormConfig)}
              />
            )}
          </TableView>
        </>
      )}
    </>
  );
}
