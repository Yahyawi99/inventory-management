import {
  faChartSimple,
  faBoxesStacked,
  faFileInvoice,
  faUsers,
  faChartLine,
  faGear,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@config/routes";
import { MenuItemType } from "@/types/sidebar";

export const MenuItems: MenuItemType[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    href: routes.dashboard,
    icon: faChartSimple,
    subMenuItems: [],
  },
  {
    id: "inventory",
    name: "Inventory",
    icon: faBoxesStacked,
    subMenuItems: [
      {
        id: "inventory-products-sub",
        name: "Products",
        href: routes.inventory.products,
      },
      {
        id: "inventory-categories-sub",
        name: "Categories",
        href: routes.inventory.categories,
      },
      {
        id: "inventory-stock-levels-sub",
        name: "Stock Levels",
        href: routes.inventory.stockLevels,
      },
    ],
  },
  {
    id: "orders",
    name: "Orders", // Display name
    icon: faFileInvoice,
    subMenuItems: [
      {
        id: "orders-all-sub", // Unique ID for sub-item
        name: "All Orders",
        href: routes.orders.all,
      },
      {
        id: "orders-purchase-sub", // Unique ID for sub-item
        name: "Purchase Orders",
        href: routes.orders.purchase,
      },
      {
        id: "orders-sale-sub", // Unique ID for sub-item
        name: "Sale Orders",
        href: routes.orders.sale,
      },
      {
        id: "orders-invoices-sub", // Unique ID for sub-item
        name: "Invoices",
        href: routes.orders.invoices,
      },
    ],
  },
  {
    id: "users-roles",
    name: "Users & Roles",
    icon: faUsers,
    subMenuItems: [
      {
        id: "users-roles-manage-sub",
        name: "Manage Users",
        href: routes.usersRoles.manageUsers,
      },
      {
        id: "users-roles-permissions-sub",
        name: "Roles & Permissions",
        href: routes.usersRoles.rolesPermissions,
      },
    ],
  },

  {
    id: "activity-log",
    name: "Activity Log", // Display name
    href: routes.activityLog,
    icon: faScroll,
    subMenuItems: [], // Empty array as it has no sub-items
  },
  {
    id: "reports",
    name: "Reports",
    href: routes.reports,
    icon: faChartLine,
    subMenuItems: [],
  },
  {
    id: "settings",
    name: "Settings",
    icon: faGear,
    subMenuItems: [
      {
        id: "settings-company-profile-sub",
        name: "Company Profile",
        href: routes.settings.companyProfile,
      },
      {
        id: "settings-notifications-sub",
        name: "Notifications",
        href: routes.settings.notifications,
      },
    ],
  },
];
