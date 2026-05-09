import { redirect } from "next/navigation";

import { DEFAULT_AUTH_REDIRECT, LOGIN_ROUTE } from "@/lib/auth-config";
import { getAuthenticatedUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getAuthenticatedUser();

  redirect(user ? DEFAULT_AUTH_REDIRECT : LOGIN_ROUTE);
}
