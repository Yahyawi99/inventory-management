export const routes = {
  dashboard: "/",
  inventory: {
    products: "/inventory/products",
    categories: "/inventory/categories",
    stockLevels: "/inventory/stock-levels",
    barcodes: "/inventory/barcodes",
  },
  orders: {
    all: "/orders",
    purchase: "/orders/purchase",
    sale: "/orders/sale",
    invoices: "/orders/invoices",
  },
  usersRoles: {
    manageUsers: "/users-roles/manage-users",
    rolesPermissions: "/users-roles/roles-permissions",
  },
  reports: "/reports",
  settings: {
    companyProfile: "/settings/company-profile",
    integrations: "/settings/integrations",
    notifications: "/settings/notifications",
  },
  activityLog: "/activity-log",
};
