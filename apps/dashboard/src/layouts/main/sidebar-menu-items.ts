import {
  faChartSimple,
  faBoxesStacked,
  faFileInvoice,
  faUsers,
  faGear,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@config/routes";
import { MenuItemType } from "@/types/sidebar";

export const MenuItems: MenuItemType[] = [
  {
    id: "dashboard",
    name: "dashboard",
    href: routes.dashboard,
    icon: faChartSimple,
    subMenuItems: [],
  },
  {
    id: "inventory",
    name: "inventory.title",
    icon: faBoxesStacked,
    subMenuItems: [
      {
        id: "inventory-products-sub",
        name: "inventory.products",
        href: routes.inventory.products,
      },
      {
        id: "inventory-categories-sub",
        name: "inventory.categories",
        href: routes.inventory.categories,
      },
      {
        id: "inventory-stock-levels-sub",
        name: "inventory.stock_levels",
        href: routes.inventory.stockLevels,
      },
    ],
  },
  {
    id: "orders",
    name: "orders.title",
    icon: faFileInvoice,
    subMenuItems: [
      {
        id: "orders-all-sub",
        name: "orders.all_orders",
        href: routes.orders.all,
      },
      {
        id: "orders-purchase-sub",
        name: "orders.purchase_orders",
        href: routes.orders.purchase,
      },
      {
        id: "orders-sale-sub",
        name: "orders.sale_orders",
        href: routes.orders.sale,
      },
      {
        id: "orders-invoices-sub",
        name: "orders.invoices",
        href: routes.orders.invoices,
      },
    ],
  },
  {
    id: "users-roles",
    name: "users_roles.title",
    icon: faUsers,
    subMenuItems: [
      {
        id: "users-roles-manage-sub",
        name: "users_roles.manage_users",
        href: routes.usersRoles.manageUsers,
      },
      {
        id: "users-roles-permissions-sub",
        name: "users_roles.roles_permissions",
        href: routes.usersRoles.rolesPermissions,
      },
    ],
  },
  {
    id: "activity-log",
    name: "activity_log",
    href: routes.activityLog,
    icon: faScroll,
    subMenuItems: [],
  },
  {
    id: "settings",
    name: "settings.title",
    icon: faGear,
    subMenuItems: [
      {
        id: "settings-company-profile-sub",
        name: "settings.company_profile",
        href: routes.settings.companyProfile,
      },
      {
        id: "settings-notifications-sub",
        name: "settings.notifications",
        href: routes.settings.notifications,
      },
    ],
  },
];
