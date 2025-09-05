"use client";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "app-core/src/components";
import { useState } from "react";
import UsersTable from "./UsersTable";
import UsersHeader from "./Header";

export default function UsersCard() {
  const [users, setUsers] = useState([
    {
      id: "user-1",
      name: "Alice Smith",
      email: "alice.s@example.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: "user-2",
      name: "Bob Johnson",
      email: "bob.j@example.com",
      role: "Editor",
      status: "Active",
    },
    {
      id: "user-3",
      name: "Charlie Brown",
      email: "charlie.b@example.com",
      role: "Viewer",
      status: "Active",
    },
    {
      id: "user-4",
      name: "Diana Prince",
      email: "diana.p@example.com",
      role: "Viewer",
      status: "Active",
    },
  ]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<(typeof users)[0] | null>();

  // Handler to delete a user
  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };
  return (
    <>
      {" "}
      <Card className="w-full max-w-5xl rounded-3xl shadow-xl transition-all duration-300">
        <CardContent className="p-8 pt-0">
          <UsersHeader />
          <UsersTable />
        </CardContent>
      </Card>
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete **{userToDelete?.name}**? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              className="rounded-full"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
