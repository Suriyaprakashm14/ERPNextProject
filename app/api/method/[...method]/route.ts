import { NextResponse } from "next/server";

import { ERP_NEXT_SESSION_COOKIE } from "@/lib/auth-config";
import { erpNextRequest } from "@/lib/erpnext/client";
import { getErpNextErrorMessage } from "@/lib/erpnext/errors";

type RouteContext = {
  params: Promise<{
    method: string[];
  }>;
};

async function proxyMethodRequest(
  request: Request,
  context: RouteContext,
  httpMethod: string,
) {
  const { method } = await context.params;
  const requestUrl = new URL(request.url);
  const methodPath = method.map((segment) => encodeURIComponent(segment)).join("/");
  const upstreamPath = `/api/method/${methodPath}${requestUrl.search}`;

  const sessionId =
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${ERP_NEXT_SESSION_COOKIE}=`))
      ?.split("=")[1] ?? null;

  const body =
    httpMethod === "GET" || httpMethod === "DELETE" ? undefined : await request.text();

  const upstreamResponse = await erpNextRequest(upstreamPath, {
    method: httpMethod,
    headers: {
      Accept: "application/json",
      ...(request.headers.get("content-type")
        ? { "Content-Type": request.headers.get("content-type") as string }
        : {}),
      ...(sessionId
        ? { Cookie: `${ERP_NEXT_SESSION_COOKIE}=${sessionId}` }
        : {}),
    },
    body,
  });

  const contentType = upstreamResponse.headers.get("content-type") ?? "";

  if (!upstreamResponse.ok) {
    return NextResponse.json(
      {
        error: await getErpNextErrorMessage(upstreamResponse),
      },
      { status: upstreamResponse.status },
    );
  }

  if (contentType.includes("application/json")) {
    const payload = await upstreamResponse.json().catch(() => null);
    return NextResponse.json(payload, { status: upstreamResponse.status });
  }

  const text = await upstreamResponse.text();

  return new NextResponse(text, {
    status: upstreamResponse.status,
    headers: contentType ? { "Content-Type": contentType } : undefined,
  });
}

export async function GET(request: Request, context: RouteContext) {
  return proxyMethodRequest(request, context, "GET");
}

export async function POST(request: Request, context: RouteContext) {
  return proxyMethodRequest(request, context, "POST");
}
