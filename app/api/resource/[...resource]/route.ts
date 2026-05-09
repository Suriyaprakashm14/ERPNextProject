import { NextResponse } from "next/server";

import { ERP_NEXT_SESSION_COOKIE } from "@/lib/auth-config";
import { erpNextRequest } from "@/lib/erpnext/client";
import { getErpNextErrorMessage } from "@/lib/erpnext/errors";

type RouteContext = {
  params: Promise<{
    resource: string[];
  }>;
};

async function proxyResourceRequest(
  request: Request,
  context: RouteContext,
  method: string,
) {
  const { resource } = await context.params;
  const requestUrl = new URL(request.url);
  const resourcePath = resource.map(encodeURIComponent).join("/");
  const upstreamPath = `/api/resource/${resourcePath}${requestUrl.search}`;
  const sessionId =
    request.headers
      .get("cookie")
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${ERP_NEXT_SESSION_COOKIE}=`))
      ?.split("=")[1] ?? null;

  const body =
    method === "GET" || method === "DELETE" ? undefined : await request.text();

  const upstreamResponse = await erpNextRequest(upstreamPath, {
    method,
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
  return proxyResourceRequest(request, context, "GET");
}

export async function POST(request: Request, context: RouteContext) {
  return proxyResourceRequest(request, context, "POST");
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyResourceRequest(request, context, "PUT");
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyResourceRequest(request, context, "PATCH");
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyResourceRequest(request, context, "DELETE");
}
