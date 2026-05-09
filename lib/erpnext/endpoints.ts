export const ERP_NEXT_ENDPOINTS = {
  login: "/api/method/login",
  logout: "/api/method/logout",
  getLoggedUser: "/api/method/frappe.auth.get_logged_user",
} as const;

export const ERP_NEXT_RESOURCES = {
  user: "/api/resource/User",
} as const;
