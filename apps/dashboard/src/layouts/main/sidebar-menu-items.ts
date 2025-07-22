import {
  faBox,
  faChartSimple,
  faBoxesStacked,
  faTags,
  faBoxesPacking,
  faBarcode,
  faFileInvoice,
  faUsers,
  faUserGear,
  faChartLine,
  faGear,
  faBuilding,
  faBell,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "@config/routes";
import { MenuItemType } from "@/types/sidebar";

export const MenuItems: MenuItemType[] = [
  {
    id: "dashboard",
    name: "Dashboard", // Display name
    href: routes.dashboard,
    icon: faChartSimple,
    subMenuItems: [], // Empty array as it has no sub-items
  },
  {
    id: "inventory",
    name: "Inventory", // Display name
    icon: faBoxesStacked,
    subMenuItems: [
      {
        id: "inventory-products-sub", // Unique ID for sub-item
        name: "Products",
        href: routes.inventory.products,
      },
      {
        id: "inventory-categories-sub", // Unique ID for sub-item
        name: "Categories",
        href: routes.inventory.categories,
      },
      {
        id: "inventory-stock-levels-sub", // Unique ID for sub-item
        name: "Stock Levels",
        href: routes.inventory.stockLevels,
      },
      {
        id: "inventory-barcodes-sub", // Unique ID for sub-item
        name: "Barcodes",
        href: routes.inventory.barcodes,
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
    name: "Users & Roles", // Display name
    icon: faUsers,
    subMenuItems: [
      {
        id: "users-roles-manage-sub", // Unique ID for sub-item
        name: "Manage Users",
        href: routes.usersRoles.manageUsers,
      },
      {
        id: "users-roles-permissions-sub", // Unique ID for sub-item
        name: "Roles & Permissions",
        href: routes.usersRoles.rolesPermissions,
      },
    ],
  },
  {
    id: "reports",
    name: "Reports", // Display name
    href: routes.reports,
    icon: faChartLine,
    subMenuItems: [], // Empty array as it has no sub-items
  },
  {
    id: "settings",
    name: "Settings", // Display name
    icon: faGear,
    subMenuItems: [
      {
        id: "settings-company-profile-sub", // Unique ID for sub-item
        name: "Company Profile",
        href: routes.settings.companyProfile,
      },
      {
        id: "settings-integrations-sub", // Unique ID for sub-item
        name: "Integrations",
        href: routes.settings.integrations,
      },
      {
        id: "settings-notifications-sub", // Unique ID for sub-item
        name: "Notifications",
        href: routes.settings.notifications,
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
];
