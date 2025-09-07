import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "app-core/src/components";
import {
  Badge,
  Briefcase,
  CheckCircle,
  Edit,
  Mail,
  Trash2,
  UserIcon,
} from "lucide-react";
import { getRoleBadgeColor } from "@/utils/users";

export const roles = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "manager", label: "Manager" },
  { value: "analyst", label: "Analyst" },
  { value: "contributor", label: "Contributor" },
  { value: "employee", label: "Employee" },
  { value: "intern", label: "Intern" },
];

export function createTableColumns({
  handleRoleChange,
  onTrashClick,
}: {
  handleRoleChange: (id: string, role: string) => void;
  onTrashClick: (user: any) => void;
}) {
  return [
    {
      key: "name",
      header: (
        <div className="flex justify-center items-center space-x-2">
          <UserIcon className="h-4 w-4" /> <span>Name</span>
        </div>
      ),
      render: (user: any) => (
        <span className="flex justify-center font-medium text-gray-800">
          {user.name}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium",
      cellClass: "font-medium text-gray-800 break-words",
    },
    {
      key: "email",
      header: (
        <div className="flex justify-center items-center space-x-2">
          <Mail className="h-4 w-4" /> <span>Email</span>
        </div>
      ),
      render: (user: any) => (
        <span className="flex justify-center text-gray-600 break-words">
          {user.email}
        </span>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium",
      cellClass: "text-gray-600 break-words",
    },
    {
      key: "role",
      header: (
        <div className="flex justify-center items-center space-x-2">
          <Briefcase className="h-4 w-4" /> <span>Role</span>
        </div>
      ),
      render: (user: any) => (
        <Select
          value={user.memberRole}
          onValueChange={(value) => handleRoleChange(user.id, value)}
        >
          <SelectTrigger className="w-full  rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {roles.map(({ value, label }) => (
              <SelectItem key={label} value={value}>
                {label}
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
        <div className="flex justify-center items-center space-x-2">
          <CheckCircle className="h-4 w-4" /> <span>Status</span>
        </div>
      ),
      render: (user: any) => (
        <div
          className={`rounded-full ${getRoleBadgeColor(
            user.memberRole
          )} flex items-center justify-center space-x-2 py-1`}
        >
          <Badge></Badge>
          <p>{user.status}</p>
        </div>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center",
    },
    {
      key: "actions",
      header: <div className="text-center">Action</div>,
      render: (user: any) => (
        <div className="flex justify-center  space-x-2">
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
            onClick={() => onTrashClick(user)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-right",
      cellClass: "text-right",
    },
  ];
}
