"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

import { TextField } from "@/components/admin/fields";
import { FieldErrors } from "@/components/admin/form-message";
import { cn } from "@/lib/utils";

/** Everything the portfolio uploads lives under this prefix in the media library. */
const UPLOAD_FOLDER = "portfolio/projects";

const SIGNATURE_ENDPOINT = "/api/cloudinary/sign";

type ImageUploadFieldProps = {
  name?: string;
  label: string;
  /** Existing delivery URL, already stored in the database. */
  defaultValue?: string | undefined;
  errors?: string[] | undefined;
  hint?: string;
  /**
   * Whether this server has Cloudinary credentials. Without them the widget
   * cannot sign anything, so the field degrades to a plain URL input instead of
   * rendering a button that would always fail.
   */
  configured: boolean;
};

/**
 * Cover image input backed by Cloudinary's upload widget.
 *
 * The file goes straight from the browser to Cloudinary; only the resulting
 * `secure_url` is written into the hidden field and submitted with the form.
 */
export function ImageUploadField({
  name = "cloudinaryImageUrl",
  label,
  defaultValue,
  errors,
  hint,
  configured,
}: ImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploadError, setUploadError] = useState<string | null>(null);

  if (!configured) {
    return (
      <TextField
        name={name}
        label={label}
        required
        inputMode="url"
        autoComplete="off"
        defaultValue={defaultValue}
        placeholder="https://res.cloudinary.com/<cloud>/image/upload/<id>"
        errors={errors}
        hint={
          hint ??
          "Cloudinary credentials are not set on this server, so paste an existing Cloudinary URL."
        }
      />
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={`${name}-upload`} className="text-sm font-medium text-foreground">
          {label}
        </label>
        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-xs font-medium text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            Clear
          </button>
        ) : null}
      </div>

      {/* The widget writes the Cloudinary URL here; Zod still rejects an empty value. */}
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-wrap items-center gap-4">
        {value ? (
          <Image
            src={value}
            alt=""
            width={160}
            height={120}
            unoptimized
            className="h-28 w-40 shrink-0 rounded-lg border border-border object-cover"
          />
        ) : null}

        <CldUploadWidget
          signatureEndpoint={SIGNATURE_ENDPOINT}
          options={{
            folder: UPLOAD_FOLDER,
            sources: ["local", "url"],
            multiple: false,
            maxFileSize: 8_000_000,
            clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
            // Stored as-is: `next/image` asks Cloudinary for exactly the sizes
            // each layout needs, so there is no upload-time transformation here.
          }}
          onSuccess={(results) => {
            const info = results?.info;

            if (info && typeof info === "object" && "secure_url" in info) {
              setValue(String(info.secure_url));
              setUploadError(null);
            }
          }}
          onError={() =>
            setUploadError("Cloudinary rejected that file. Try a JPG, PNG or WebP.")
          }
        />
      </div>

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {uploadError ? (
        <p className={cn("text-xs text-destructive")}>{uploadError}</p>
      ) : null}
      <div id={`${name}-error`}>
        <FieldErrors errors={errors} />
      </div>
    </div>
  );
}