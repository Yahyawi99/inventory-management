"use client";
import { useState } from "react";
import {
  Button,
  Badge,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  DataTable,
} from "app-core/src/components";

// Lucide React icons
import {
  User as UserIcon,
  Mail,
  Briefcase,
  Trash2,
  CheckCircle,
  Edit,
} from "lucide-react";

export default function UsersTable() {
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
  const roles = ["Admin", "Editor", "Viewer"];

  // Handler for opening the delete confirmation dialog
  const confirmDelete = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  // Handler to update a user's role
  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  // Define the columns for the DataTable
  const userColumns = [
    {
      key: "name",
      header: (
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4" /> <span>Name</span>
        </div>
      ),
      render: (user: any) => (
        <span className="font-medium text-gray-800">{user.name}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium",
      cellClass: "font-medium text-gray-800 break-words",
    },
    {
      key: "email",
      header: (
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4" /> <span>Email</span>
        </div>
      ),
      render: (user: any) => (
        <span className="text-gray-600 break-words">{user.email}</span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium",
      cellClass: "text-gray-600 break-words",
    },
    {
      key: "role",
      header: (
        <div className="flex items-center space-x-2">
          <Briefcase className="h-4 w-4" /> <span>Role</span>
        </div>
      ),
      render: (user: any) => (
        <Select
          value={user.role}
          onValueChange={(value) => handleRoleChange(user.id, value)}
        >
          <SelectTrigger className="w-full rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium",
      cellClass: "text-center",
    },
    {
      key: "status",
      header: (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" /> <span>Status</span>
        </div>
      ),
      render: (user: any) => (
        <Badge className={`rounded-full ${getRoleBadgeColor(user.role)}`}>
          {user.status}
        </Badge>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center",
    },
    {
      key: "actions",
      header: <div className="text-right">Action</div>,
      render: (user: any) => (
        <div className="flex justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-500 hover:text-blue-700"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-700"
            onClick={() => confirmDelete(user)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-right",
      cellClass: "text-right",
    },
  ];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700";
      case "Editor":
        return "bg-blue-100 text-blue-700";
      case "Viewer":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden">
      <DataTable data={users} columns={userColumns} />
    </div>
  );
}
