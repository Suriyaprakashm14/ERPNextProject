import { ErpNextRequestError, getErpNextErrorMessage } from "./errors";

function getErpNextBaseUrl() {
  const baseUrl = process.env.ERPNEXT_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error(
      "Missing ERPNEXT_BASE_URL. Add it to .env.local before using authentication.",
    );
  }

  return baseUrl.replace(/\/+$/, "");
}

export async function erpNextRequest(path: string, init: RequestInit = {}) {
  const url = `${getErpNextBaseUrl()}${path}`;

  const timeoutMsRaw = process.env.ERPNEXT_FETCH_TIMEOUT_MS;
  const timeoutMs = timeoutMsRaw ? Number(timeoutMsRaw) : 8000;
  const hasInitSignal = init.signal != null;

  // If the caller already provided a signal, don't override it.
  const controller = hasInitSignal ? null : new AbortController();
  const signal = controller?.signal ?? init.signal;

  const timeoutHandle =
    controller && Number.isFinite(timeoutMs)
      ? setTimeout(() => controller.abort(), timeoutMs)
      : null;

  try {
    return await fetch(url, {
      ...init,
      cache: "no-store",
      redirect: "manual",
      signal,
      headers: {
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch (error) {
    if (
      !hasInitSignal &&
      error instanceof Error &&
      (error.name === "AbortError" || error.message.toLowerCase().includes("aborted"))
    ) {
      throw new ErpNextRequestError(
        `ERPNext request timed out after ${timeoutMs}ms.`,
        504,
      );
    }
    throw error;
  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

export async function erpNextJson<T>(path: string, init: RequestInit = {}) {
  const response = await erpNextRequest(path, init);

  if (!response.ok) {
    throw new ErpNextRequestError(
      await getErpNextErrorMessage(response),
      response.status,
    );
  }

  return (await response.json()) as T;
}
