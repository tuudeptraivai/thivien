import type {
  Poem,
  Author,
  Statistics,
  ApiMeta,
  Category,
  CommentItem,
  MemberTranslation,
  ForumTopic,
  ForumTopicDetail,
  ForumCategoryItem,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

const EMPTY_META = (limit = 20): ApiMeta => ({
  total_records: 0,
  total_pages: 1,
  current_page: 1,
  limit,
});

const ZERO_STATS: Statistics = {
  total_poems: 0,
  total_authors: 0,
  total_countries: 0,
  total_members: 0,
  total_translations: 0,
};

async function apiFetch<T>(path: string, revalidate = 60): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as T | null;
  } catch {
    return null;
  }
}

async function apiFetchWithMeta<T>(path: string, revalidate = 60): Promise<{ data: T; meta: ApiMeta } | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { next: { revalidate } });
    if (!res.ok) return null;
    const json = await res.json();
    return { data: json.data as T, meta: json.meta as ApiMeta };
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// Homepage
// ──────────────────────────────────────────────

export async function getHomepagePoems(): Promise<Poem[]> {
  return (await apiFetch<Poem[]>('/poems?sort=newest&limit=6')) ?? [];
}

export async function getFeaturedPoem(): Promise<Poem | null> {
  const data = await apiFetch<Poem[]>('/poems?sort=views&limit=1');
  return data && data.length > 0 ? data[0] : null;
}

export async function getTopAuthors(limit = 4): Promise<Author[]> {
  return (await apiFetch<Author[]>(`/authors?sort=poems&limit=${limit}`)) ?? [];
}

export async function getHomeStats(): Promise<Statistics> {
  return (await apiFetch<Statistics>('/statistics/summary')) ?? ZERO_STATS;
}

// ──────────────────────────────────────────────
// Authors
// ──────────────────────────────────────────────

export async function getAuthorDetail(slug: string): Promise<Author | null> {
  return apiFetch<Author>(`/authors/${slug}`, 120);
}

export async function getAuthorPoems(
  authorId: number,
  page = 1,
  limit = 8,
): Promise<{ data: Poem[]; meta: ApiMeta }> {
  const result = await apiFetchWithMeta<Poem[]>(
    `/poems?author_id=${authorId}&page=${page}&limit=${limit}`,
    60,
  );
  return result ?? { data: [], meta: EMPTY_META(limit) };
}

export async function getRelatedAuthors(
  eraId: number | undefined,
  excludeId: number,
  limit = 5,
): Promise<Author[]> {
  const path = eraId
    ? `/authors?era_id=${eraId}&limit=${limit + 1}`
    : `/authors?limit=${limit + 1}`;
  const data = (await apiFetch<Author[]>(path, 300)) ?? [];
  return data.filter((a) => a.id !== excludeId).slice(0, limit);
}

// ──────────────────────────────────────────────
// Poems
// ──────────────────────────────────────────────

export async function getPoemCategories(): Promise<Category[]> {
  return (await apiFetch<Category[]>('/poem-categories', 300)) ?? [];
}

export async function getPoemsList(params: {
  category_id?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
  is_member_poem?: boolean;
} = {}): Promise<{ data: Poem[]; meta: ApiMeta }> {
  const limit = params.limit ?? 20;
  const qs = new URLSearchParams();
  if (params.category_id) qs.set('category_id', String(params.category_id));
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);
  if (params.is_member_poem) qs.set('is_member_poem', 'true');

  const result = await apiFetchWithMeta<Poem[]>(`/poems?${qs.toString()}`, 60);
  return result ?? { data: [], meta: EMPTY_META(limit) };
}

export async function getPoemDetail(slug: string): Promise<Poem | null> {
  try {
    const res = await fetch(`${API_BASE}/poems/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as Poem | null;
  } catch {
    return null;
  }
}

export async function getMemberTranslations(params: { page?: number; limit?: number } = {}): Promise<{ data: MemberTranslation[]; meta: ApiMeta }> {
  const limit = params.limit ?? 12;
  const result = await apiFetchWithMeta<MemberTranslation[]>(
    `/translations/member?page=${params.page ?? 1}&limit=${limit}`,
    30,
  );
  return result ?? { data: [], meta: EMPTY_META(limit) };
}

export async function getMemberPoems(params: { sort?: string; page?: number; limit?: number } = {}): Promise<{ data: Poem[]; meta: ApiMeta }> {
  const limit = params.limit ?? 18;
  try {
    const res = await fetch(
      `${API_BASE}/poems?is_member_poem=true&sort=${params.sort ?? 'newest'}&page=${params.page ?? 1}&limit=${limit}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return { data: [], meta: EMPTY_META(limit) };
    const json = await res.json();
    return { data: (json.data ?? []) as Poem[], meta: (json.meta as ApiMeta) ?? EMPTY_META(limit) };
  } catch {
    return { data: [], meta: EMPTY_META(limit) };
  }
}

// ──────────────────────────────────────────────
// Comments
// ──────────────────────────────────────────────

export async function getInitialComments(
  entityType: 'poem' | 'author',
  entityId: number,
  page = 1,
): Promise<{ data: CommentItem[]; meta: ApiMeta }> {
  try {
    const res = await fetch(
      `${API_BASE}/comments?entity_type=${entityType}&entity_id=${entityId}&page=${page}&limit=20`,
      { cache: 'no-store' },
    );
    if (!res.ok) return { data: [], meta: EMPTY_META(20) };
    const json = await res.json();
    return { data: (json.data ?? []) as CommentItem[], meta: json.meta as ApiMeta };
  } catch {
    return { data: [], meta: EMPTY_META(20) };
  }
}

// ──────────────────────────────────────────────
// Statistics
// ──────────────────────────────────────────────

export async function getStatisticsSummary(): Promise<Statistics> {
  return (await apiFetch<Statistics>('/statistics/summary', 120)) ?? ZERO_STATS;
}

// ──────────────────────────────────────────────
// Forum
// ──────────────────────────────────────────────

export async function getForumCategories(): Promise<ForumCategoryItem[]> {
  return (await apiFetch<ForumCategoryItem[]>('/forum/categories', 300)) ?? [];
}

export async function getForumTopics(params: { page?: number; limit?: number; category_id?: number } = {}): Promise<{ data: ForumTopic[]; meta: ApiMeta }> {
  const limit = params.limit ?? 20;
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.category_id) qs.set('category_id', String(params.category_id));

  const result = await apiFetchWithMeta<ForumTopic[]>(`/forum/topics?${qs.toString()}`, 30);
  return result ?? { data: [], meta: EMPTY_META(limit) };
}

export async function getForumTopicDetail(slug: string): Promise<ForumTopicDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/forum/topics/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? null) as ForumTopicDetail | null;
  } catch {
    return null;
  }
}
