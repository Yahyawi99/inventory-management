"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  DataTable,
  TableView,
} from "app-core/src/components";
import { createTableColumns } from "@/constants/users";
import { Pagination } from "app-core/src/types";
import UsersHeader from "./Header";
import DeleteModal from "./DeleteModal";
import { User } from "@/types/users";

export default function UsersCard() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [tableUsers, setTableUsers] = useState<User[]>([]);
  const [isFetchingTableUsers, setIsFetchingTableUsers] = useState(false);

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: null,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User>();
  const [error, setError] = useState<string | null>("");

  // Table Users
  const fetchTableUsers = useCallback(async () => {
    if (!user || !user.activeOrganizationId) {
      setIsFetchingTableUsers(false);
      setError("User or organization ID not available for table.");
      return;
    }

    setIsFetchingTableUsers(true);
    setError(null);
    try {
      const response = await fetch("/api/user");

      if (response.status !== 200) {
        throw new Error(
          response.statusText || "Failed to fetch table orders from API."
        );
      }

      const data = await response.json();

      setTableUsers(data.users);
      setPagination({ ...pagination, totalPages: data.totalPages });
    } catch (err: any) {
      console.error("Error fetching table orders:", err);
      setError(
        err.message ||
          "An unexpected error occurred while fetching table orders."
      );
    } finally {
      setIsFetchingTableUsers(false);
    }
  }, [user, isAuthenticated, pagination.page]);

  useEffect(() => {
    if (isAuthenticated && !isAuthLoading) {
      fetchTableUsers();
    }
  }, [isAuthLoading, fetchTableUsers]);

  // Handler to delete a user
  const onTrashClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = () => {};

  // Handler to update a user's role
  const handleRoleChange = (id: string, newRole: string) => {};

  const tableColumns = createTableColumns({
    handleRoleChange: handleRoleChange,
    onTrashClick: onTrashClick,
  });
  return (
    <>
      <Card className="w-full rounded-3xl shadow-xl transition-all duration-300">
        <CardContent className="p-8 pt-0">
          <UsersHeader />

          {/* Table */}
          <TableView
            data={tableUsers}
            isFetchingData={isFetchingTableUsers}
            currentPage={pagination.page}
            totalPages={pagination?.totalPages ? pagination.totalPages : 0}
            setPagination={setPagination}
          >
            <DataTable<User> data={tableUsers} columns={tableColumns} />
          </TableView>
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        handleDeleteUser={handleDeleteUser}
      />
    </>
  );
}
