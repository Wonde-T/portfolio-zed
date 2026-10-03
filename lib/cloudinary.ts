import "server-only";

import { createHash } from "node:crypto";

/**
 * Cloudinary credentials and upload signing.
 *
 * Covers are uploaded straight from the browser to Cloudinary (the upload widget
 * asks `/api/cloudinary/sign` for a signature), so the containers never handle
 * image bytes and the database only ever stores the resulting delivery URL.
 *
 * Nothing here throws on a missing configuration: a fresh clone without
 * Cloudinary credentials must still build and render the dashboard, so callers
 * check `isCloudinaryConfigured()` first and fall back to pasting a URL.
 */

/** Params the upload widget always sends itself, so they must not be signed. */
const UNSIGNED_PARAMS = new Set([
  "api_key",
  "cloud_name",
  "file",
  "resource_type",
]);

export type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

export function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryConfig() !== null;
}

/**
 * Signs the parameter object the widget sends, exactly as Cloudinary expects:
 * drop empty values and the widget's own params, sort the remaining keys, join
 * them as `key=value` pairs, append the API secret and hash the result with SHA-1.
 */
export function signCloudinaryParams(
  paramsToSign: Record<string, string | number | boolean>,
  apiSecret: string,
): string {
  const stringToSign = Object.entries(paramsToSign)
    .filter(
      ([key, value]) =>
        !UNSIGNED_PARAMS.has(key) &&
        value !== undefined &&
        value !== null &&
        value !== "",
    )
    .sort(([left], [right]) => (left < right ? -1 : 1))
    .map(([key, value]) => `${key}=${String(value)}`)
    .join("&");

  return createHash("sha1")
    .update(stringToSign + apiSecret)
    .digest("hex");
}