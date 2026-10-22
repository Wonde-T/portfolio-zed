import { z } from "zod";

const optionalCloudinaryImageUrl = z.union([
  z.literal(""),
  z
    .url("Enter the Cloudinary URL of the photo.")
    .max(1024)
    .refine(
      (value) => new URL(value).hostname === "res.cloudinary.com",
      "Photos must be hosted on Cloudinary (res.cloudinary.com).",
    ),
]);

export const homeSchema = z.object({
  greeting: z.string().trim().min(1, "Greeting is required.").max(191),
  name: z.string().trim().min(1, "Name is required.").max(191),
  role: z.string().trim().min(1, "Role is required.").max(191),
  bio: z.string().trim().min(1, "Bio is required."),
  availability: z.string().trim().min(1, "Availability is required.").max(191),
  location: z.string().trim().min(1, "Location is required.").max(191),
  email: z.string().trim().min(1, "Email is required.").max(191),
  photoUrl: optionalCloudinaryImageUrl,
});

export function homeInput(formData: FormData) {
  return {
    greeting: text(formData, "greeting"),
    name: text(formData, "name"),
    role: text(formData, "role"),
    bio: text(formData, "bio"),
    availability: text(formData, "availability"),
    location: text(formData, "location"),
    email: text(formData, "email"),
    photoUrl: text(formData, "photoUrl").trim(),
  };
}

import { text } from "./validations";
