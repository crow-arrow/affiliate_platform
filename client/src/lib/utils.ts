import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Resolves avatar URL: use as-is if absolute (Clerk, uploaded full URL), else prepend API base. */
export function getAvatarUrl(avatarUrl: string | null | undefined): string {
  if (!avatarUrl) return "";
  if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
    return avatarUrl;
  }
  const base = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
  const path = avatarUrl.replace(/^\//, "");
  return base ? `${base}/${path}` : avatarUrl;
}
