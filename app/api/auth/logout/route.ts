import { NextResponse } from "next/server";

import type { LogoutResponse } from "@/features/auth/authTypes";
import { ERP_NEXT_SESSION_COOKIE } from "@/lib/auth-config";
import { erpNextRequest } from "@/lib/erpnext/client";
import { ERP_NEXT_ENDPOINTS } from "@/lib/erpnext/endpoints";

export async function POST(request: Request) {
  const sessionId = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ERP_NEXT_SESSION_COOKIE}=`))
    ?.split("=")[1];

  if (sessionId) {
    await erpNextRequest(ERP_NEXT_ENDPOINTS.logout, {
      method: "GET",
      headers: {
        Cookie: `${ERP_NEXT_SESSION_COOKIE}=${sessionId}`,
      },
    }).catch(() => null);
  }

  const response = NextResponse.json<LogoutResponse>({
    authenticated: false,
    message: "Logged out",
  });

  response.cookies.set({
    name: ERP_NEXT_SESSION_COOKIE,
    value: "",
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return response;
}
