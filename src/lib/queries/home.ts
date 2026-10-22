import "server-only";

import { cache } from "react";

import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import { requireAdmin } from "@/lib/dal";

export type HomeData = {
  greeting: string;
  name: string;
  role: string;
  bio: string;
  availability: string;
  location: string;
  email: string;
  /** Cloudinary delivery URL for the hero portrait, or `null` when unset. */
  photoUrl: string | null;
};

export const getHomeContent = cache(async (): Promise<HomeData> => {
  const row = await db.homeContent.findFirst({
    select: {
      greeting: true,
      name: true,
      role: true,
      bio: true,
      availability: true,
      location: true,
      email: true,
      photoUrl: true,
    },
  });

  if (!row) {
    return {
      greeting: siteConfig.greeting,
      name: siteConfig.name,
      role: siteConfig.role,
      bio: siteConfig.bio,
      availability: siteConfig.availability,
      location: siteConfig.location,
      email: siteConfig.email,
      photoUrl: null,
    };
  }

  return row;
});

export async function getHomeContentAdmin(): Promise<HomeData> {
  await requireAdmin();
  return getHomeContent();
}
