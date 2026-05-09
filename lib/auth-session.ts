import type { AuthUser } from "@/features/auth/authTypes";
import { ERP_NEXT_SESSION_COOKIE } from "@/lib/auth-config";
import { erpNextJson } from "@/lib/erpnext/client";
import { ERP_NEXT_ENDPOINTS, ERP_NEXT_RESOURCES } from "@/lib/erpnext/endpoints";
import { ErpNextRequestError } from "@/lib/erpnext/errors";

type LoggedUserResponse = {
  message: string;
};

type UserResourceResponse = {
  data: {
    name: string;
    full_name?: string;
    email?: string;
    user_image?: string | null;
    user_type?: string | null;
    enabled?: number | boolean;
  };
};

function buildCookieHeader(sessionId: string) {
  return `${ERP_NEXT_SESSION_COOKIE}=${encodeURIComponent(sessionId)}`;
}

function mapAuthUser(data: UserResourceResponse["data"]): AuthUser {
  return {
    id: data.name,
    fullName: data.full_name || data.name,
    email: data.email || data.name,
    userImage: data.user_image ?? null,
    userType: data.user_type ?? null,
    enabled: data.enabled === undefined ? true : Boolean(data.enabled),
  };
}

async function getUserDetails(sessionId: string, userId: string) {
  const resourcePath =
    `${ERP_NEXT_RESOURCES.user}/${encodeURIComponent(userId)}` +
    '?fields=["name","full_name","email","user_image","user_type","enabled"]';

  try {
    const response = await erpNextJson<UserResourceResponse>(resourcePath, {
      headers: {
        Cookie: buildCookieHeader(sessionId),
      },
    });

    return mapAuthUser(response.data);
  } catch (error) {
    if (error instanceof ErpNextRequestError) {
      // Don't treat ERPNext timeouts as a successful auth fallback.
      if (error.status === 504) throw error;

      return {
        id: userId,
        fullName: userId,
        email: userId,
        userImage: null,
        userType: null,
        enabled: true,
      } satisfies AuthUser;
    }

    throw error;
  }
}

export async function fetchAuthenticatedUserBySessionId(sessionId: string) {
  try {
    const response = await erpNextJson<LoggedUserResponse>(
      ERP_NEXT_ENDPOINTS.getLoggedUser,
      {
        method: "GET",
        headers: {
          Cookie: buildCookieHeader(sessionId),
        },
      },
    );

    return await getUserDetails(sessionId, response.message);
  } catch (error) {
    if (
      error instanceof ErpNextRequestError &&
      [401, 403, 408, 504].includes(error.status)
    ) {
      return null;
    }

    throw error;
  }
}
