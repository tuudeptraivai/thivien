import type { Poem, Author, Statistics, ApiMeta, Category, CommentItem } from './types';
import { MOCK_POEMS, MOCK_AUTHORS, MOCK_STATS } from './mockData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1';

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

export async function getHomepagePoems(): Promise<Poem[]> {
  const data = await apiFetch<Poem[]>('/poems?sort=newest&limit=6');
  return data && data.length > 0 ? data : MOCK_POEMS.slice(0, 6);
}

export async function getFeaturedPoem(): Promise<Poem> {
  const data = await apiFetch<Poem[]>('/poems?sort=views&limit=1');
  return data && data.length > 0 ? data[0] : MOCK_POEMS[0];
}

export async function getTopAuthors(): Promise<Author[]> {
  const data = await apiFetch<Author[]>('/authors?limit=4');
  return data && data.length > 0 ? data : MOCK_AUTHORS.slice(0, 4);
}

export async function getHomeStats(): Promise<Statistics> {
  const data = await apiFetch<Statistics>('/statistics/summary');
  return data ?? MOCK_STATS;
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
  return result ?? {
    data: MOCK_POEMS.filter((p) => p.author.id === authorId),
    meta: { total_records: 0, total_pages: 1, current_page: 1, limit },
  };
}

// ──────────────────────────────────────────────
// Poems
// ──────────────────────────────────────────────

export async function getPoemCategories(): Promise<Category[]> {
  const data = await apiFetch<Category[]>('/poem-categories', 300);
  return data ?? [];
}

export async function getPoemsList(params: {
  category_id?: number;
  sort?: string;
  page?: number;
  limit?: number;
  search?: string;
} = {}): Promise<{ data: Poem[]; meta: ApiMeta }> {
  const qs = new URLSearchParams();
  if (params.category_id) qs.set('category_id', String(params.category_id));
  if (params.sort) qs.set('sort', params.sort);
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);

  const result = await apiFetchWithMeta<Poem[]>(`/poems?${qs.toString()}`, 60);
  return result ?? {
    data: MOCK_POEMS,
    meta: { total_records: MOCK_POEMS.length, total_pages: 1, current_page: 1, limit: params.limit ?? 20 },
  };
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

// ──────────────────────────────────────────────
// Authors (continued)
// ──────────────────────────────────────────────

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
    if (!res.ok) return { data: [], meta: { total_records: 0, total_pages: 0, current_page: 1, limit: 20 } };
    const json = await res.json();
    return { data: (json.data ?? []) as CommentItem[], meta: json.meta as ApiMeta };
  } catch {
    return { data: [], meta: { total_records: 0, total_pages: 0, current_page: 1, limit: 20 } };
  }
}

// ──────────────────────────────────────────────
// Authors (continued)
// ──────────────────────────────────────────────

export async function getRelatedAuthors(
  eraId: number | undefined,
  excludeId: number,
  limit = 5,
): Promise<Author[]> {
  const path = eraId
    ? `/authors?era_id=${eraId}&limit=${limit + 1}`
    : `/authors?limit=${limit + 1}`;
  const data = await apiFetch<Author[]>(path, 300);
  const authors = (data ?? MOCK_AUTHORS).filter((a) => a.id !== excludeId);
  return authors.slice(0, limit);
}
