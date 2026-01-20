export const routes = {
  dashboard: "",
  inventory: {
    products: "/inventory/products",
    categories: "/inventory/categories",
    stockLevels: "/inventory/stock-levels",
  },
  orders: {
    all: "/orders",
    purchase: "/orders/purchase",
    sale: "/orders/sale",
    invoices: "/invoices",
  },
  usersRoles: {
    manageUsers: "/users-roles/manage-users",
    rolesPermissions: "/users-roles/roles-permissions",
  },
  settings: {
    companyProfile: "/settings/company-profile",
    notifications: "/settings/notifications",
  },
  activityLog: "/activity-log",
};
