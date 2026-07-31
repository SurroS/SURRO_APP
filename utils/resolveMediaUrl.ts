const API_BASE = process.env.EXPO_PUBLIC_API_URL?.replace(/\/+$/, "");
const MEDIA_BASE = API_BASE?.replace(/\/api\/v1\/?$/i, "");

export const resolveProfilePicture = (
  url: string | null | undefined,
): string | null => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (!MEDIA_BASE) return url;
  return `${MEDIA_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};
