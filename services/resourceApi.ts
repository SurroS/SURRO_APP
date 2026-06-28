import { publicGet, authenticatedPost } from "./httpClient";
import type { ResourcesApiResponse, BookmarkToggleResponse } from "@/types/resources";

export const getResources = () =>
  publicGet<ResourcesApiResponse>("/resources");

export const toggleBookmark = (resourceId: string) =>
  authenticatedPost<BookmarkToggleResponse>("/resources/bookmark", { resourceId });
