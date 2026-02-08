import { Input, RecordActions } from "app-core/src/components";
import {
  Badge,
  Briefcase,
  CheckCircle,
  DollarSign,
  Mail,
  Package,
  ShoppingCart,
  TrendingUp,
  UserIcon,
} from "lucide-react";
import { getRoleBadgeColor } from "@/utils/users";
import { SubmitData, User } from "@/types/users";
import { Column, FormConfig, Translator } from "app-core/src/types";

export const roles = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "manager", label: "Manager" },
  { value: "analyst", label: "Analyst" },
  { value: "contributor", label: "Contributor" },
  { value: "employee", label: "Employee" },
  { value: "intern", label: "Intern" },
];

// Table
export const getTableColumns = (
  t: Translator,
  formConfig: FormConfig<SubmitData>,
): Column<User>[] => {
  return [
    {
      key: "name",
      header: (
        <div className="flex justify-center items-center space-x-2">
          <UserIcon className="h-4 w-4" />
          <span>{t("users.table.name")}</span>
        </div>
      ),
      render: (user: User) => (
        <span className="flex justify-center font-medium text-foreground">
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
          <Mail className="h-4 w-4" />
          <span>{t("users.table.email")}</span>
        </div>
      ),
      render: (user: User) => (
        <span className="flex justify-center text-muted-foreground break-words">
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
          <Briefcase className="h-4 w-4" />
          <span>{t("users.table.role")}</span>
        </div>
      ),
      render: (user: User) => (
        <div
          className={`rounded-full ${getRoleBadgeColor(
            user.memberRole,
          )} flex items-center justify-center py-1`}
        >
          <p>{t(`roles.${user.memberRole.toLowerCase()}`)}</p>
        </div>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium",
      cellClass: "text-center",
    },

    {
      key: "status",
      header: (
        <div className="flex justify-center items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span>{t("users.table.status")}</span>
        </div>
      ),
      render: (user: User) => (
        <div
          className={`rounded-full ${getRoleBadgeColor(
            user.status,
          )} flex items-center justify-center py-1`}
        >
          <Badge />
          <p>{t(`record_form.status_options.${user.status.toLowerCase()}`)}</p>
        </div>
      ),
      headClass: "px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center",
    },

    {
      key: "actions",
      header: <span className="text-center">{t("users.table.action")}</span>,
      render: (user: User) => (
        <RecordActions<SubmitData>
          record={user}
          formConfig={formConfig}
          page="users_roles_page"
        />
      ),
      headClass: "w-[100px] px-4 py-3 text-gray-700 font-medium text-center",
      cellClass: "text-center px-4 py-3",
    },
  ];
};

// Form config
export const getUserFormConfig = async (
  t: Translator,
): Promise<FormConfig<SubmitData>> => {
  return {
    title: t("record_form.title_edit"),
    description: t("record_form.description_edit"),
    entityName: t("record_form.entity_name"),

    fields: [
      {
        name: "name",
        label: t("record_form.fields.name"),
        type: "text",
        required: true,
        placeholder: t("record_form.placeholders.name"),
        gridArea: "1",
      },
      {
        name: "email",
        label: t("record_form.fields.email"),
        type: "email",
        required: true,
        placeholder: t("record_form.placeholders.email"),
        gridArea: "1",
      },
      {
        name: "memberRole",
        label: t("record_form.fields.member_role"),
        type: "select",
        required: true,
        options: [
          { id: "admin", name: t("record_form.roles.admin") },
          { id: "analyst", name: t("record_form.roles.analyst") },
          { id: "manager", name: t("record_form.roles.manager") },
          { id: "member", name: t("record_form.roles.member") },
          { id: "contributor", name: t("record_form.roles.contributor") },
          { id: "employee", name: t("record_form.roles.employee") },
          { id: "viewer", name: t("record_form.roles.viewer") },
          { id: "intern", name: t("record_form.roles.intern") },
        ],
        gridArea: "1/2",
        defaultValue: "employee",
      },
      {
        name: "status",
        label: t("record_form.fields.status"),
        type: "select",
        required: true,
        defaultValue: "Active",
        options: [
          { id: "Active", name: t("record_form.status_options.active") },
          { id: "Suspended", name: t("record_form.status_options.suspended") },
          {
            id: "Terminated",
            name: t("record_form.status_options.terminated"),
          },
        ],
        gridArea: "1/2",
      },
      {
        name: "image",
        label: t("record_form.fields.image"),
        type: "text",
        required: false,
        placeholder: t("record_form.placeholders.image"),
        gridArea: "1",
      },
      {
        name: "emailVerified",
        label: t("record_form.fields.email_verified"),
        type: "checkbox",
        required: false,
        defaultValue: false,
        gridArea: "1/2",
      },
      {
        name: "banned",
        label: t("record_form.fields.banned"),
        type: "checkbox",
        required: false,
        defaultValue: false,
        gridArea: "1/2",
      },
      {
        name: "banReason",
        label: t("record_form.fields.ban_reason"),
        type: "textarea",
        required: false,
        placeholder: t("record_form.placeholders.ban_reason"),
        gridArea: "1/2",
        rows: 2,
        dependsOn: {
          field: "banned",
          value: true,
        },
      },
    ],

    onUpdate: async (
      id: string,
      data: SubmitData,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!data.name || !data.email || !data.role || !data.status) {
        return {
          ok: false,
          message: t("record_form.messages.required_error"),
        };
      }

      if (!id) {
        return {
          ok: false,
          message: t("record_form.messages.id_required"),
        };
      }

      try {
        const response = await fetch(`/api/user/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const { error } = await response.json();
          return { ok: false, message: error };
        }

        return {
          ok: true,
          message: t("record_form.messages.update_success"),
        };
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : t("record_form.messages.update_error"),
        };
      }
    },

    onDelete: async (
      recordId: string,
    ): Promise<{ ok: boolean; message: string }> => {
      if (!recordId) {
        return {
          ok: false,
          message: t("record_form.messages.id_required"),
        };
      }

      try {
        const response = await fetch(`/api/user/${recordId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          const { error } = await response.json();
          return { ok: false, message: error };
        }

        return {
          ok: true,
          message: t("record_form.messages.delete_success"),
        };
      } catch {
        return {
          ok: false,
          message: t("record_form.messages.delete_error"),
        };
      }
    },
  };
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
