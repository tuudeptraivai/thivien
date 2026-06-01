// ================================================
// API Response wrappers
// ================================================

export interface ApiMeta {
  total_records: number;
  total_pages: number;
  current_page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: ApiMeta;
}

// ================================================
// Core entities
// ================================================

export interface Author {
  id: number;
  name: string;
  slug: string;
  birth_year?: string;
  death_year?: string;
  country: string;
  country_id?: number;
  era: string;
  era_id?: number;
  portrait_url?: string;
  poem_count: number;
  is_verified: boolean;
  biography?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  poem_count?: number;
}

export interface Era {
  id: number;
  name: string;
  start_year?: number;
  end_year?: number;
}

export interface Country {
  id: number;
  name: string;
  flag_emoji?: string;
}

export interface Annotation {
  keyword: string;
  explanation: string;
  type: "allusion" | "location" | "person" | "term";
}

export interface Translator {
  id: number;
  name: string;
  slug: string;
}

export interface Translation {
  id: number;
  translator: Translator;
  translation_title: string;
  content: string;
  translation_type: string;
  is_favorite: boolean;
}

export interface PoemVersion {
  id: number;
  version_name: string;
  is_primary: boolean;
  content: string;
  transcription?: string;
  explanation?: string;
}

export interface Poem {
  id: number;
  title: string;
  slug: string;
  author: Pick<Author, "id" | "name" | "slug">;
  category: Category;
  view_count: number;
  like_count: number;
  source_info?: string;
  is_member_poem: boolean;
  versions?: PoemVersion[];
  translations?: Translation[];
  annotations?: Annotation[];
  excerpt?: string;
}

export interface Comment {
  id: number;
  entity_type: "poem" | "author";
  entity_id: number;
  parent_id: number | null;
  content: string;
  author_name: string;
  created_at: string;
  replies?: Comment[];
}

export interface CommentAuthor {
  id?: number;
  display_name: string;
  avatar_url?: string;
  is_guest?: boolean;
}

export interface CommentItem {
  id: number;
  content: string;
  author: CommentAuthor;
  created_at: string;
  replies: CommentItem[];
}

export interface ForumTopic {
  id: number;
  title: string;
  slug: string;
  category: string;
  author_name: string;
  reply_count: number;
  view_count: number;
  last_reply_at: string;
  created_at: string;
  pinned?: boolean;
}

export interface Statistics {
  total_poems: number;
  total_authors: number;
  total_countries: number;
  total_members: number;
  total_translations: number;
}

export interface DictionaryEntry {
  id: number;
  chinese_char?: string;
  han_viet: string;
  vietnamese_meaning: string;
  stroke_count?: number;
  radical?: string;
  examples?: string[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  display_name: string;
  role: "member" | "poet" | "moderator" | "admin";
  preferences: {
    theme: "light" | "dark";
    font: "Lora" | "Inter";
    vn_typing_mode: number;
  };
  created_at: string;
}

// ================================================
// Filter / Query types
// ================================================

export interface PoemFilters {
  search?: string;
  author_id?: number;
  category_id?: number;
  era_id?: number;
  country_id?: number;
  is_member_poem?: boolean;
  sort?: "newest" | "views" | "abc" | "featured";
  page?: number;
  limit?: number;
}

export interface AuthorFilters {
  search?: string;
  country_id?: number;
  era_id?: number;
  verified?: boolean;
  letter?: string;
  page?: number;
  limit?: number;
}
