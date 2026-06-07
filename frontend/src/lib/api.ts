import axios from "axios";
import type {
  ApiResponse,
  ApiMeta,
  Author,
  Poem,
  Comment,
  ForumTopic,
  ForumCategoryItem,
  Statistics,
  DictionaryEntry,
  PoemFilters,
  AuthorFilters,
  User,
  Era,
  Country,
  Translation,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach JWT token on every request
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("tv_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------------------------------------
// Helpers
// ------------------------------------------------

function buildParams(obj: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") out[k] = String(v);
  }
  return out;
}

// ------------------------------------------------
// Auth
// ------------------------------------------------

export interface LoginResponse {
  user: User;
  access_token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    { email, password }
  );
  return data.data;
}

export async function register(payload: {
  username: string;
  email: string;
  password: string;
  display_name: string;
}): Promise<LoginResponse> {
  const { data } = await apiClient.post<ApiResponse<LoginResponse>>(
    "/auth/register",
    payload
  );
  return data.data;
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
  return data.data;
}

// ------------------------------------------------
// Authors
// ------------------------------------------------

export async function getAuthors(filters: AuthorFilters = {}): Promise<{
  data: Author[];
  meta: ApiMeta;
}> {
  const params = buildParams(filters as Record<string, unknown>);
  const { data } = await apiClient.get<ApiResponse<Author[]> & { meta: ApiMeta }>(
    "/authors",
    { params }
  );
  return { data: data.data, meta: data.meta! };
}

export async function getAuthor(slug: string): Promise<Author> {
  const { data } = await apiClient.get<ApiResponse<Author>>(`/authors/${slug}`);
  return data.data;
}

export async function getAuthorPoems(authorId: number, page = 1) {
  return getPoems({ author_id: authorId, page });
}

// ------------------------------------------------
// Poems
// ------------------------------------------------

export async function getPoems(filters: PoemFilters = {}): Promise<{
  data: Poem[];
  meta: ApiMeta;
}> {
  const params = buildParams(filters as Record<string, unknown>);
  const { data } = await apiClient.get<ApiResponse<Poem[]> & { meta: ApiMeta }>(
    "/poems",
    { params }
  );
  return { data: data.data, meta: data.meta! };
}

export async function getPoem(slug: string): Promise<Poem> {
  const { data } = await apiClient.get<ApiResponse<Poem>>(`/poems/${slug}`);
  return data.data;
}

// ------------------------------------------------
// Member compositions (Sáng tác)
// ------------------------------------------------

export interface ComposePayload {
  title: string;
  content: string;
  status?: "draft" | "pending" | "published";
  source_info?: string;
  author_id?: number;
  author_name?: string;
}

export async function createPoem(payload: ComposePayload): Promise<Poem> {
  const { data } = await apiClient.post<ApiResponse<Poem>>("/poems", {
    title: payload.title,
    status: payload.status,
    source_info: payload.source_info,
    author_id: payload.author_id,
    author_name: payload.author_name,
    versions: [{ content: payload.content, is_primary: true }],
  });
  return data.data;
}

export async function updatePoem(
  id: number,
  payload: Partial<ComposePayload>,
): Promise<Poem> {
  const { data } = await apiClient.put<ApiResponse<Poem>>(`/poems/${id}`, payload);
  return data.data;
}

export interface DraftPoem {
  id: number;
  title: string;
  slug: string;
  status: "draft" | "pending" | "published";
  source_info?: string;
  content: string;
  updated_at: string;
}

export async function getMyDrafts(): Promise<DraftPoem[]> {
  const { data } = await apiClient.get<ApiResponse<DraftPoem[]>>("/poems/mine", {
    params: { status: "draft" },
  });
  return data.data;
}

// ------------------------------------------------
// Search
// ------------------------------------------------

export async function searchPoems(
  q: string,
  filters: Omit<PoemFilters, "search"> = {}
): Promise<{ data: Poem[]; meta: ApiMeta }> {
  return getPoems({ search: q, ...filters });
}

// ------------------------------------------------
// Translations
// ------------------------------------------------

export async function submitTranslation(
  poemId: number,
  versionId: number,
  payload: {
    content: string;
    translation_title?: string;
    translation_type?: string;
  }
): Promise<Translation> {
  const { data } = await apiClient.post<ApiResponse<Translation>>(
    `/poems/${poemId}/versions/${versionId}/translations`,
    payload
  );
  return data.data;
}

// ------------------------------------------------
// Likes
// ------------------------------------------------

export async function checkLiked(poemId: number): Promise<boolean> {
  const { data } = await apiClient.get<ApiResponse<{ liked: boolean }>>(
    `/poems/${poemId}/liked`
  );
  return data.data.liked;
}

export async function likePoem(
  poemId: number
): Promise<{ liked: boolean; like_count: number; message: string }> {
  const { data } = await apiClient.post<
    ApiResponse<null> & { liked: boolean; like_count: number; message: string }
  >(`/poems/${poemId}/like`);
  return { liked: data.liked, like_count: data.like_count, message: data.message };
}

// ------------------------------------------------
// Bookmarks
// ------------------------------------------------

export interface BookmarkItem {
  poem_id: number;
  title: string;
  slug: string;
  author: { name: string } | null;
  bookmarked_at: string;
}

export async function getMyBookmarks(page = 1): Promise<BookmarkItem[]> {
  const { data } = await apiClient.get<ApiResponse<BookmarkItem[]>>("/bookmarks", {
    params: { page },
  });
  return data.data;
}

export async function checkBookmark(poemId: number): Promise<boolean> {
  const { data } = await apiClient.get<ApiResponse<{ bookmarked: boolean }>>(
    `/bookmarks/check/${poemId}`
  );
  return data.data.bookmarked;
}

export async function toggleBookmark(
  poemId: number
): Promise<{ bookmarked: boolean; message: string }> {
  const { data } = await apiClient.post<
    ApiResponse<null> & { bookmarked: boolean; message: string }
  >(`/bookmarks/${poemId}`);
  return { bookmarked: data.bookmarked, message: data.message };
}

// ------------------------------------------------
// Comments
// ------------------------------------------------

export async function getComments(
  entityType: "poem" | "author",
  entityId: number,
  page = 1
): Promise<Comment[]> {
  const { data } = await apiClient.get<ApiResponse<Comment[]>>("/comments", {
    params: { entity_type: entityType, entity_id: entityId, page },
  });
  return data.data;
}

export async function postComment(payload: {
  entity_type: "poem" | "author";
  entity_id: number;
  parent_id?: number | null;
  content: string;
  guest_name?: string;
  guest_email?: string;
}) {
  const { data } = await apiClient.post("/comments", payload);
  return data.data;
}

// ------------------------------------------------
// Forum
// ------------------------------------------------

export async function getForumTopics(page = 1): Promise<{
  data: ForumTopic[];
  meta: ApiMeta;
}> {
  const { data } = await apiClient.get<ApiResponse<ForumTopic[]> & { meta: ApiMeta }>(
    "/forum/topics",
    { params: { page } }
  );
  return { data: data.data, meta: data.meta! };
}

export async function getForumTopic(slug: string): Promise<ForumTopic> {
  const { data } = await apiClient.get<ApiResponse<ForumTopic>>(`/forum/topics/${slug}`);
  return data.data;
}

export async function getForumCategories(): Promise<ForumCategoryItem[]> {
  const { data } = await apiClient.get<ApiResponse<ForumCategoryItem[]>>("/forum/categories");
  return data.data;
}

export async function createForumTopic(payload: {
  category_id: number;
  title: string;
  content: string;
}): Promise<{ slug: string }> {
  const { data } = await apiClient.post<ApiResponse<{ topic: { slug: string } }>>(
    "/forum/topics",
    payload
  );
  return { slug: data.data.topic.slug };
}

export async function createForumPost(
  topicId: number,
  content: string,
  parentId?: number
) {
  const { data } = await apiClient.post(`/forum/topics/${topicId}/posts`, {
    content,
    parent_id: parentId,
  });
  return data.data;
}

// ------------------------------------------------
// Eras & Countries
// ------------------------------------------------

export async function getEras(): Promise<Era[]> {
  const { data } = await apiClient.get<ApiResponse<Era[]>>("/eras");
  return data.data;
}

export async function getCountries(): Promise<Country[]> {
  const { data } = await apiClient.get<ApiResponse<Country[]>>("/countries");
  return data.data;
}

// ------------------------------------------------
// Statistics
// ------------------------------------------------

export async function getStatistics(): Promise<Statistics> {
  const { data } = await apiClient.get<ApiResponse<Statistics>>("/statistics/summary");
  return data.data;
}

// ------------------------------------------------
// Dictionary
// ------------------------------------------------

export async function lookupDictionary(keyword: string): Promise<DictionaryEntry[]> {
  const { data } = await apiClient.get<ApiResponse<DictionaryEntry[]>>(
    "/annotations/lookup",
    { params: { keyword } }
  );
  return data.data;
}
