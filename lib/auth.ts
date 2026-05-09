import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ERP_NEXT_SESSION_COOKIE,
  LOGIN_ROUTE,
} from "@/lib/auth-config";
import { fetchAuthenticatedUserBySessionId } from "@/lib/auth-session";

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ERP_NEXT_SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  return fetchAuthenticatedUserBySessionId(sessionId);
}

export async function requireAuthenticatedUser() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect(LOGIN_ROUTE);
  }

  return user;
}
