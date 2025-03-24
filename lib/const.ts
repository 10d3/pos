// Role definitions
export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrateur",
  STAFF: "Personnel",
  MANAGER: "Manager",
  CASHIER: "Caissier",
  WAITER: "Serveur",
  KITCHEN: "Cuisine",
  INVENTORY: "Inventaire",
  READONLY: "Lecture seule",
};

// Role-based permissions
export const ROLE_PERMISSIONS = {
  // Full access to everything
  ADMIN: {
    dashboard: true,
    orders: { view: true, create: true, update: true, delete: true },
    menu: { view: true, create: true, update: true, delete: true },
    customers: { view: true, create: true, update: true, delete: true },
    loyalty: { view: true, create: true, update: true },
    reports: { view: true, export: true },
    settings: { view: true, update: true },
    staff: { view: true, create: true, update: true, delete: true },
  },

  // Manager has most permissions except some sensitive settings
  MANAGER: {
    dashboard: true,
    orders: { view: true, create: true, update: true, delete: true },
    menu: { view: true, create: true, update: true, delete: false },
    customers: { view: true, create: true, update: true, delete: false },
    loyalty: { view: true, create: true, update: true },
    reports: { view: true, export: true },
    settings: { view: true, update: false },
    staff: { view: true, create: false, update: false, delete: false },
  },

  // General staff with basic permissions
  STAFF: {
    dashboard: true,
    orders: { view: true, create: true, update: true, delete: false },
    menu: { view: true, create: false, update: false, delete: false },
    customers: { view: true, create: true, update: true, delete: false },
    loyalty: { view: true, create: true, update: false },
    reports: { view: false, export: false },
    settings: { view: false, update: false },
    staff: { view: false, create: false, update: false, delete: false },
  },

  // Cashier focused on orders and customers
  CASHIER: {
    dashboard: true,
    orders: { view: true, create: true, update: true, delete: false },
    menu: { view: true, create: false, update: false, delete: false },
    customers: { view: true, create: true, update: true, delete: false },
    loyalty: { view: true, create: true, update: false },
    reports: { view: false, export: false },
    settings: { view: false, update: false },
    staff: { view: false, create: false, update: false, delete: false },
  },

  // Waiter focused on taking orders
  WAITER: {
    dashboard: true,
    orders: { view: true, create: true, update: true, delete: false },
    menu: { view: true, create: false, update: false, delete: false },
    customers: { view: true, create: true, update: false, delete: false },
    loyalty: { view: true, create: false, update: false },
    reports: { view: false, export: false },
    settings: { view: false, update: false },
    staff: { view: false, create: false, update: false, delete: false },
  },

  // Kitchen staff focused on viewing and updating orders
  KITCHEN: {
    dashboard: true,
    orders: { view: true, create: false, update: true, delete: false },
    menu: { view: true, create: false, update: false, delete: false },
    customers: { view: false, create: false, update: false, delete: false },
    loyalty: { view: false, create: false, update: false },
    reports: { view: false, export: false },
    settings: { view: false, update: false },
    staff: { view: false, create: false, update: false, delete: false },
  },

  // Inventory manager focused on menu items and stock
  INVENTORY: {
    dashboard: true,
    orders: { view: true, create: false, update: false, delete: false },
    menu: { view: true, create: true, update: true, delete: false },
    customers: { view: false, create: false, update: false, delete: false },
    loyalty: { view: false, create: false, update: false },
    reports: { view: true, export: false },
    settings: { view: false, update: false },
    staff: { view: false, create: false, update: false, delete: false },
  },

  // Read-only access for auditing or training
  READONLY: {
    dashboard: true,
    orders: { view: true, create: false, update: false, delete: false },
    menu: { view: true, create: false, update: false, delete: false },
    customers: { view: true, create: false, update: false, delete: false },
    loyalty: { view: true, create: false, update: false },
    reports: { view: true, export: false },
    settings: { view: false, update: false },
    staff: { view: false, create: false, update: false, delete: false },
  },
};

// Route permissions mapping
export const ROUTE_PERMISSIONS: Record<
  string,
  keyof (typeof ROLE_PERMISSIONS)[keyof typeof ROLE_PERMISSIONS]
> = {
  "/pos": "dashboard",
  "/pos/orders": "orders",
  "/pos/menu": "menu",
  "/pos/customers": "customers",
  "/pos/customers/loyalty": "loyalty",
  "/pos/reports": "reports",
  "/pos/reports/sales": "reports",
  "/pos/reports/inventory": "reports",
  "/pos/reports/staff": "reports",
  "/pos/settings": "settings",
  "/pos/settings/staff": "staff",
};
