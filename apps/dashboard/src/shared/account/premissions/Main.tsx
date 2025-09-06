"use client";

import { useState } from "react";
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

export default function UsersCard() {
  const [tableUsers, setTableUsers] = useState([
    {
      id: "user-1",
      organizationId: "ft",
      name: "Alice Smith",
      email: "alice.s@example.com",
      role: "Admin",
      status: "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  const [isFetchingTableUsers, setIsFetchingTableUsers] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    totalPages: null,
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState();

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
            <DataTable<any> data={tableUsers} columns={tableColumns} />
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
