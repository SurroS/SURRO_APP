export interface Resource {
  id: string;
  title: string;
  author: string;
  category: string;
  categoryColor?: string;
  thumbnail?: string;
  type: "article" | "video" | "pdf";
  videoId?: string;
  sourceUrl?: string;
  createdAt?: string;
  isBookmarked?: boolean;
}

export interface ResourcesApiResponse {
  success: boolean;
  data: Resource[];
  categories: string[];
  types: string[];
  total: number;
}

export interface BookmarkToggleResponse {
  success: boolean;
  bookmarked: boolean;
}
