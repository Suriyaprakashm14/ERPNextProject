import { NextResponse } from "next/server";

import type { SignInResponse } from "@/features/auth/authTypes";
import { ERP_NEXT_SESSION_COOKIE } from "@/lib/auth-config";
import { fetchAuthenticatedUserBySessionId } from "@/lib/auth-session";
import { erpNextRequest } from "@/lib/erpnext/client";
import { ERP_NEXT_ENDPOINTS } from "@/lib/erpnext/endpoints";
import { getErpNextErrorMessage } from "@/lib/erpnext/errors";

type LoginRequestBody = {
  username?: string;
  password?: string;
};

type ErpNextLoginResponse = {
  message?: string;
  full_name?: string;
  home_page?: string;
};

type ParsedCookie = {
  name: string;
  value: string;
  maxAge?: number;
  expires?: Date;
};

function getSetCookieHeaders(response: Response) {
  const headers = response.headers as Headers & {
    getSetCookie?: () => string[];
  };

  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const fallback = response.headers.get("set-cookie");
  return fallback ? [fallback] : [];
}

function parseSetCookieHeader(setCookieValue: string): ParsedCookie | null {
  const parts = setCookieValue.split(";").map((part) => part.trim());
  const [cookiePair, ...attributes] = parts;
  const separatorIndex = cookiePair.indexOf("=");

  if (separatorIndex <= 0) {
    return null;
  }

  const name = cookiePair.slice(0, separatorIndex);
  const value = cookiePair.slice(separatorIndex + 1);
  const parsedCookie: ParsedCookie = { name, value };

  for (const attribute of attributes) {
    const [rawKey, ...rawValueParts] = attribute.split("=");
    const key = rawKey.toLowerCase();
    const joinedValue = rawValueParts.join("=");

    if (key === "max-age") {
      const maxAge = Number.parseInt(joinedValue, 10);

      if (!Number.isNaN(maxAge)) {
        parsedCookie.maxAge = maxAge;
      }
    }

    if (key === "expires") {
      const expires = new Date(joinedValue);

      if (!Number.isNaN(expires.getTime())) {
        parsedCookie.expires = expires;
      }
    }
  }

  return parsedCookie;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginRequestBody | null;
  const username = body?.username?.trim();
  const password = body?.password;

  if (!username || !password) {
    return NextResponse.json(
      {
        error: "Username and password are required.",
      },
      { status: 400 },
    );
  }

  const upstreamResponse = await erpNextRequest(ERP_NEXT_ENDPOINTS.login, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usr: username,
      pwd: password,
    }),
  });

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        error: await getErpNextErrorMessage(upstreamResponse),
      },
      { status: upstreamResponse.status },
    );
  }

  const loginPayload =
    ((await upstreamResponse.json().catch(() => null)) as ErpNextLoginResponse | null) ??
    {};

  const sessionCookie = getSetCookieHeaders(upstreamResponse)
    .map(parseSetCookieHeader)
    .find((cookie): cookie is ParsedCookie => cookie?.name === ERP_NEXT_SESSION_COOKIE);

  if (!sessionCookie?.value) {
    return NextResponse.json(
      {
        error: "ERPNext login succeeded, but no session cookie was returned.",
      },
      { status: 502 },
    );
  }

  const user =
    (await fetchAuthenticatedUserBySessionId(sessionCookie.value)) ?? {
      id: username,
      fullName: loginPayload.full_name || username,
      email: username,
      userImage: null,
      userType: null,
      enabled: true,
    };

  const response = NextResponse.json<SignInResponse>({
    authenticated: true,
    message: loginPayload.message || "Logged in",
    homePage: loginPayload.home_page ?? null,
    user,
  });

  response.cookies.set({
    name: ERP_NEXT_SESSION_COOKIE,
    value: sessionCookie.value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: sessionCookie.expires,
    maxAge: sessionCookie.maxAge,
  });

  return response;
}
