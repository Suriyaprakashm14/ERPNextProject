import { NextResponse } from "next/server";

import type { SessionResponse } from "@/features/auth/authTypes";
import { ERP_NEXT_SESSION_COOKIE } from "@/lib/auth-config";
import { fetchAuthenticatedUserBySessionId } from "@/lib/auth-session";

export async function GET(request: Request) {
  const sessionId = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ERP_NEXT_SESSION_COOKIE}=`))
    ?.split("=")[1];

  const user = sessionId
    ? await fetchAuthenticatedUserBySessionId(sessionId)
    : null;

  if (!user) {
    return NextResponse.json(
      {
        error: "Not authenticated.",
      },
      { status: 401 },
    );
  }

  return NextResponse.json<SessionResponse>({
    authenticated: true,
    user,
  });
}
