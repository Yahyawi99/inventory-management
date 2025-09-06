"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "app-core/src/components";
import { Plus } from "lucide-react";

export default function Header() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Handler to add a new user
  const handleAddUser = (e: any) => {
    e.preventDefault();
    // if (!newUserName || !newUserEmail) return;

    // const newUser = {
    //   id: `user-${Date.now()}`,
    //   name: newUserName,
    //   email: newUserEmail,
    //   role: newUserRole,
    //   status: "Active",
    // };
    // setUsers([...users, newUser]);
    // setNewUserName("");
    // setNewUserEmail("");
    // setNewUserRole("Viewer");
    // setIsAddModalOpen(false);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-semibold text-gray-800">Team Members (7)</h3>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center space-x-1 px-4 py-2 bg-sidebar hover:bg-transparent text-white font-semibold rounded-md shadow cursor-pointer border-2 border-transparent hover:border-sidebar hover:text-sidebar">
            <Plus className="h-4 w-4 mr-1" /> Add User
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[450px] rounded-2xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold">
              Add New User
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the new team member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4">
            <DialogFooter className="pt-4 flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="rounded-full">
                Add User
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
