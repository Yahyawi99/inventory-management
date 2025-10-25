import {
  Button,
  Input,
  RecordActions,
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
  DollarSign,
  Edit,
  Mail,
  Package,
  ShoppingCart,
  Trash2,
  TrendingUp,
  UserIcon,
} from "lucide-react";
import { getRoleBadgeColor } from "@/utils/users";
import { SubmitData, User } from "@/types/users";
import { Column, FormConfig } from "app-core/src/types";
import { boolean } from "better-auth/*";

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

// Table
export const tableColumns: Column<User>[] = [
  {
    key: "checkbox",
    header: (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    render: () => (
      <Input type="checkbox" className="h-4 w-4 rounded-sm border-gray-300" />
    ),
    headClass: "w-[50px] px-4 py-3",
    cellClass: "text-center px-4 py-3",
  },
  {
    key: "name",
    header: (
      <div className="flex justify-center items-center space-x-2">
        <UserIcon className="h-4 w-4" /> <span>Name</span>
      </div>
    ),
    render: (user: User) => (
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
    render: (user: User) => (
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
    render: (user: User) => (
      <div
        className={`rounded-full ${getRoleBadgeColor(
          user.memberRole
        )} flex items-center justify-center space-x-2 py-1`}
      >
        <p>{user.memberRole}</p>
      </div>
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
    render: (user: User) => (
      <div
        className={`rounded-full ${getRoleBadgeColor(
          user.status
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
    header: "Action",
    render: (user: User) => (
      <RecordActions<SubmitData> record={user} formConfig={UserFormConfig} />
    ),
    headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
    cellClass: "text-center px-4 py-3",
  },
];

// Form config
export const UserFormConfig: FormConfig<SubmitData> = {
  title: "Update User",
  description: "Modify user information and permissions.",
  entityName: "User",
  fields: [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
      placeholder: "John Doe",
      gridArea: "1",
    },
    {
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
      placeholder: "john.doe@example.com",
      gridArea: "1",
    },
    {
      name: "role",
      label: "User Role",
      type: "select",
      required: false,
      options: [
        { id: "ADMIN", name: "Administrator" },
        { id: "MANAGER", name: "Manager" },
        { id: "EMPLOYEE", name: "Employee" },
        { id: "VIEWER", name: "Viewer" },
        { id: "INTERN", name: "Intern" },
      ],
      gridArea: "1/2",
      defaultValue: "EMPLOYEE",
    },
    {
      name: "status",
      label: "Account Status",
      type: "select",
      required: true,
      defaultValue: "Active",
      options: [
        { id: "Active", name: "Active" },
        { id: "Suspended", name: "Suspended" },
        { id: "Terminated", name: "Terminated" },
      ],
      gridArea: "1/2",
    },
    {
      name: "image",
      label: "Profile Image URL",
      type: "text",
      required: false,
      placeholder: "https://example.com/avatar.jpg",
      gridArea: "1",
    },
    {
      name: "emailVerified",
      label: "Email Verified",
      type: "checkbox",
      required: false,
      defaultValue: false,
      gridArea: "1/2",
    },

    {
      name: "banned",
      label: "Ban User",
      type: "checkbox",
      required: false,
      defaultValue: false,
      gridArea: "1/2",
    },
    {
      name: "banReason",
      label: "Ban Reason",
      type: "textarea",
      required: false,
      placeholder: "Reason for banning this user",
      gridArea: "1/2",
      rows: 2,
      dependsOn: {
        field: "banned",
        value: true,
      },
    },
    {
      name: "banExpires",
      label: "Ban Expiry Date",
      type: "date",
      required: false,
      placeholder: "When the ban expires",
      gridArea: "1/2",
      dependsOn: {
        field: "banned",
        value: true,
      },
    },
  ],
  onSubmit: async (
    data: SubmitData
  ): Promise<{ ok: boolean; message: string }> => {
    return { ok: true, message: "string" };
  },
  onDelete: async (
    recordId: string
  ): Promise<{ ok: boolean; message: string }> => {
    return { ok: true, message: "string" };
  },
};

// Account stats
export const stats = [
  {
    label: "Orders Processed",
    value: "ordersProcessed",
    icon: ShoppingCart,
    color: "bg-green-50 text-green-600",
  },
  {
    label: "Total Sales Generated",
    value: "totalSales",
    icon: DollarSign,
    color: "bg-blue-50 text-blue-600",
  },
  {
    label: "Total Purchases Made",
    value: "totalPurchases",
    icon: Package,
    color: "bg-purple-50 text-purple-600",
  },
  {
    label: "Stock Items Updated",
    value: "stockItemsUpdated",
    icon: TrendingUp,
    color: "bg-orange-50 text-orange-600",
  },
];
