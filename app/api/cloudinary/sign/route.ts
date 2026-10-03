import { auth } from "@/auth";
import { getCloudinaryConfig, signCloudinaryParams } from "@/lib/cloudinary";

/**
 * Upload signature endpoint for the Cloudinary widget.
 *
 * The widget POSTs the exact parameter set it is about to send, so signing that
 * payload keeps the browser upload direct-to-Cloudinary while the API secret
 * stays server-side.
 *
 * Unlike the admin pages this route answers with 401 instead of redirecting:
 * it is called by `fetch` from the widget, and a redirect would be reported to
 * the owner as a broken upload.
 */
export async function POST(request: Request): Promise<Response> {
  const session = await auth();

  if (!session?.user?.id) {
    return Response.json(
      { error: "Not authenticated." },
      { status: 401 },
    );
  }

  const config = getCloudinaryConfig();

  if (!config) {
    return Response.json(
      { error: "Cloudinary is not configured on this server." },
      { status: 503 },
    );
  }

  const body: unknown = await request.json().catch(() => null);

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as { paramsToSign?: unknown }).paramsToSign !== "object" ||
    (body as { paramsToSign?: unknown }).paramsToSign === null
  ) {
    return Response.json(
      { error: "Expected a paramsToSign object." },
      { status: 400 },
    );
  }

  const signature = signCloudinaryParams(
    (body as { paramsToSign: Record<string, string | number | boolean> })
      .paramsToSign,
    config.apiSecret,
  );

  return Response.json({ signature });
}