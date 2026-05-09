export const ERP_NEXT_SESSION_COOKIE = "sid";
export const LOGIN_ROUTE = "/login";
export const DEFAULT_AUTH_REDIRECT = "/dashboard";

export function getSafeRedirectPath(value: string | null | undefined) {
  if (!value) {
    return DEFAULT_AUTH_REDIRECT;
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return value;
}
