export class ErpNextRequestError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: string,
  ) {
    super(message);
    this.name = "ErpNextRequestError";
  }
}

function stripHtmlTags(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function getErpNextErrorMessage(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as
      | { message?: string; exception?: string; exc?: string }
      | null;

    return (
      payload?.message ??
      payload?.exception ??
      payload?.exc ??
      `ERPNext request failed with status ${response.status}.`
    );
  }

  const rawText = await response.text().catch(() => "");
  const plainText = stripHtmlTags(rawText);

  return plainText || `ERPNext request failed with status ${response.status}.`;
}
