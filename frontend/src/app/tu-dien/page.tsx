"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPopularDictionary, lookupDictionary } from "@/lib/api";
import type { DictionaryEntry } from "@/lib/types";
import { useDebounce } from "@/lib/hooks";

const RECENT_KEY = "tv_dict_recent";
const BOOKMARK_KEY = "tv_dict_bookmarks";
const MAX_RECENT = 10;
const MAX_BOOKMARKS = 50;

function loadList<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function saveList<T>(key: string, list: T[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // localStorage có thể bị block (private mode); im lặng bỏ qua
  }
}

function entryKey(entry: DictionaryEntry) {
  return `${entry.character}|${entry.sinoVietnamese}`;
}

export default function TuDienPage() {
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<DictionaryEntry | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [bookmarks, setBookmarks] = useState<DictionaryEntry[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const debouncedKeyword = useDebounce(keyword, 400);
  const submittedQuery = debouncedKeyword.trim();

  useEffect(() => {
    setRecent(loadList<string>(RECENT_KEY));
    setBookmarks(loadList<DictionaryEntry>(BOOKMARK_KEY));
  }, []);

  const { data: popularData } = useQuery({
    queryKey: ["dictionary", "popular"],
    queryFn: getPopularDictionary,
    staleTime: Infinity,
  });

  const {
    data: lookupData,
    isFetching: isSearching,
    isError,
  } = useQuery({
    queryKey: ["dictionary", "lookup", submittedQuery],
    queryFn: () => lookupDictionary(submittedQuery),
    enabled: submittedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const results = useMemo(() => lookupData?.results ?? [], [lookupData]);
  const suggestedQueries = lookupData?.suggestedQueries ?? [];
  const responseSource = lookupData?.source;
  const responseMessage = lookupData?.message;

  // Sau khi có kết quả mới, ghi vào recent và auto-chọn entry đầu tiên
  useEffect(() => {
    if (!submittedQuery || !lookupData) return;
    if (results.length > 0) {
      setSelected(results[0]);
    }
    setRecent((prev) => {
      const next = [submittedQuery, ...prev.filter((q) => q !== submittedQuery)].slice(
        0,
        MAX_RECENT,
      );
      saveList(RECENT_KEY, next);
      return next;
    });
  }, [submittedQuery, lookupData, results]);

  // Khi vừa mở trang, auto-chọn entry phổ biến đầu tiên
  useEffect(() => {
    if (!submittedQuery && !selected && popularData?.results.length) {
      setSelected(popularData.results[0]);
    }
  }, [popularData, selected, submittedQuery]);

  const sidebarList: DictionaryEntry[] = submittedQuery
    ? results
    : popularData?.results ?? [];

  const isBookmarked = useCallback(
    (entry: DictionaryEntry) =>
      bookmarks.some((b) => entryKey(b) === entryKey(entry)),
    [bookmarks],
  );

  const toggleBookmark = useCallback((entry: DictionaryEntry) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => entryKey(b) === entryKey(entry));
      const next = exists
        ? prev.filter((b) => entryKey(b) !== entryKey(entry))
        : [entry, ...prev].slice(0, MAX_BOOKMARKS);
      saveList(BOOKMARK_KEY, next);
      return next;
    });
  }, []);

  const copyText = useCallback((text: string, key: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    void navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1500);
    });
  }, []);

  const runQuery = useCallback((query: string) => {
    setKeyword(query);
  }, []);

  const clearRecent = useCallback(() => {
    setRecent([]);
    saveList(RECENT_KEY, []);
  }, []);

  const sourceLabel = useMemo(() => {
    if (!responseSource) return null;
    return responseSource === "ai" ? "Nguồn: Claude AI" : "Nguồn: Từ điển nội bộ";
  }, [responseSource]);

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
          CÔNG CỤ
        </p>
        <h1
          className="text-headline-lg mb-2"
          style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
        >
          Từ điển Hán–Việt
        </h1>
        <p
          className="mb-8 max-w-2xl text-sm"
          style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
        >
          Tra cứu thông minh bằng Claude AI — hỗ trợ chữ Hán, phiên âm Hán–Việt, Pinyin
          và nghĩa tiếng Việt. Khi không có kết nối AI, hệ thống tự động chuyển sang bộ
          từ điển tham khảo nội bộ.
        </p>

        {/* Search */}
        <div className="search-pill flex items-center gap-3 px-5 py-3.5 max-w-lg mb-4">
          <svg
            className="w-5 h-5 shrink-0"
            style={{ color: "var(--color-lacquer-red)" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
            />
          </svg>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tra chữ Hán, phiên âm Hán-Việt, pinyin hoặc nghĩa tiếng Việt..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
          />
          {isSearching && (
            <span
              className="text-xs"
              style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
            >
              Đang tra…
            </span>
          )}
        </div>

        {/* Suggested queries */}
        {suggestedQueries.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span
              className="text-label-caps self-center"
              style={{ color: "var(--color-bamboo-green)" }}
            >
              GỢI Ý
            </span>
            {suggestedQueries.map((q) => (
              <button
                key={q}
                onClick={() => runQuery(q)}
                className="px-3 py-1 rounded-full text-xs border transition-colors hover:bg-[rgba(142,36,36,0.06)]"
                style={{
                  borderColor: "var(--color-border-tan)",
                  color: "var(--fg)",
                  fontFamily: "var(--font-inter)",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {responseMessage && submittedQuery && (
          <p
            className="mb-6 text-sm italic"
            style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
          >
            {responseMessage}
          </p>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Left column */}
          <aside className="space-y-6">
            {/* Results / Popular list */}
            <div className="card overflow-hidden">
              <div
                className="px-5 py-3 border-b text-label-caps flex items-center justify-between"
                style={{
                  borderColor: "var(--color-border-tan)",
                  color: "var(--color-bamboo-green)",
                }}
              >
                <span>
                  {submittedQuery ? `KẾT QUẢ (${results.length})` : "TỪ PHỔ BIẾN"}
                </span>
                {sourceLabel && submittedQuery && (
                  <span
                    className="text-[10px] font-normal normal-case tracking-normal"
                    style={{ color: "var(--color-muted-gray)" }}
                  >
                    {sourceLabel}
                  </span>
                )}
              </div>

              {isSearching && submittedQuery && sidebarList.length === 0 ? (
                <div className="p-8 text-center">
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                  >
                    Đang tra cứu…
                  </p>
                </div>
              ) : isError ? (
                <div className="p-8 text-center">
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}
                  >
                    Đã xảy ra lỗi khi tra cứu. Vui lòng thử lại.
                  </p>
                </div>
              ) : sidebarList.length === 0 ? (
                <div className="p-8 text-center">
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                  >
                    {submittedQuery
                      ? "Không tìm thấy kết quả phù hợp."
                      : "Chưa có dữ liệu phổ biến."}
                  </p>
                </div>
              ) : (
                <ul>
                  {sidebarList.map((entry) => {
                    const active = selected && entryKey(selected) === entryKey(entry);
                    return (
                      <li key={entryKey(entry)}>
                        <button
                          onClick={() => setSelected(entry)}
                          className="w-full text-left px-5 py-4 flex items-center gap-4 border-b transition-colors hover:bg-[rgba(142,36,36,0.04)]"
                          style={{
                            borderColor: "var(--color-border-tan)",
                            background: active ? "rgba(142,36,36,0.06)" : "transparent",
                          }}
                        >
                          <span
                            className="text-3xl shrink-0"
                            style={{
                              fontFamily: "var(--font-cjk)",
                              color: active
                                ? "var(--color-lacquer-red)"
                                : "var(--fg)",
                            }}
                          >
                            {entry.character}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p
                              className="font-semibold text-sm"
                              style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                            >
                              {entry.sinoVietnamese}
                              <span
                                className="ml-2 text-xs font-normal"
                                style={{ color: "var(--color-muted-gray)" }}
                              >
                                {entry.pinyin}
                              </span>
                            </p>
                            <p
                              className="text-xs line-clamp-1"
                              style={{
                                color: "var(--color-muted-gray)",
                                fontFamily: "var(--font-inter)",
                              }}
                            >
                              {entry.definition}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Recent searches */}
            <div className="card overflow-hidden">
              <div
                className="px-5 py-3 border-b text-label-caps flex items-center justify-between"
                style={{
                  borderColor: "var(--color-border-tan)",
                  color: "var(--color-bamboo-green)",
                }}
              >
                <span>TRA CỨU GẦN ĐÂY</span>
                {recent.length > 0 && (
                  <button
                    onClick={clearRecent}
                    className="text-[10px] font-normal normal-case tracking-normal underline"
                    style={{ color: "var(--color-muted-gray)" }}
                  >
                    Xoá
                  </button>
                )}
              </div>
              {recent.length === 0 ? (
                <p
                  className="px-5 py-4 text-sm"
                  style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                >
                  Chưa có truy vấn nào.
                </p>
              ) : (
                <ul>
                  {recent.map((q) => (
                    <li key={q}>
                      <button
                        onClick={() => runQuery(q)}
                        className="w-full text-left px-5 py-2 text-sm border-b transition-colors hover:bg-[rgba(142,36,36,0.04)]"
                        style={{
                          borderColor: "var(--color-border-tan)",
                          fontFamily: "var(--font-inter)",
                          color: "var(--fg)",
                        }}
                      >
                        {q}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Bookmarks */}
            <div className="card overflow-hidden">
              <div
                className="px-5 py-3 border-b text-label-caps"
                style={{
                  borderColor: "var(--color-border-tan)",
                  color: "var(--color-bamboo-green)",
                }}
              >
                ĐÃ LƯU
              </div>
              {bookmarks.length === 0 ? (
                <p
                  className="px-5 py-4 text-sm"
                  style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                >
                  Bấm trái tim để lưu chữ Hán.
                </p>
              ) : (
                <ul>
                  {bookmarks.map((entry) => (
                    <li
                      key={entryKey(entry)}
                      className="flex items-center border-b"
                      style={{ borderColor: "var(--color-border-tan)" }}
                    >
                      <button
                        onClick={() => setSelected(entry)}
                        className="flex-1 text-left px-5 py-2 flex items-center gap-3 transition-colors hover:bg-[rgba(142,36,36,0.04)]"
                      >
                        <span
                          className="text-2xl"
                          style={{ fontFamily: "var(--font-cjk)", color: "var(--fg)" }}
                        >
                          {entry.character}
                        </span>
                        <span
                          className="text-sm"
                          style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                        >
                          {entry.sinoVietnamese}
                        </span>
                      </button>
                      <button
                        onClick={() => toggleBookmark(entry)}
                        aria-label="Bỏ lưu"
                        className="px-3 py-2"
                        style={{ color: "var(--color-lacquer-red)" }}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Right column: entry detail */}
          <section className="card p-8" style={{ background: "var(--color-paper-pure)" }}>
            {selected ? (
              <EntryDetail
                entry={selected}
                bookmarked={isBookmarked(selected)}
                onToggleBookmark={() => toggleBookmark(selected)}
                copiedKey={copiedKey}
                onCopy={copyText}
              />
            ) : (
              <div className="py-24 text-center">
                <p
                  className="text-sm"
                  style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                >
                  Nhập một chữ Hán hoặc từ khoá để bắt đầu tra cứu.
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

interface EntryDetailProps {
  entry: DictionaryEntry;
  bookmarked: boolean;
  onToggleBookmark: () => void;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
}

function EntryDetail({
  entry,
  bookmarked,
  onToggleBookmark,
  copiedKey,
  onCopy,
}: EntryDetailProps) {
  const charCopyKey = `char-${entry.character}`;
  return (
    <>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="text-center flex-1">
          <button
            onClick={() => onCopy(entry.character, charCopyKey)}
            title="Bấm để sao chép chữ Hán"
            className="text-[96px] leading-none font-bold mb-2 transition-opacity hover:opacity-80"
            style={{ fontFamily: "var(--font-cjk)", color: "var(--color-lacquer-red)" }}
          >
            {entry.character}
          </button>
          <p
            className="text-2xl font-semibold"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            {entry.sinoVietnamese}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
          >
            {entry.pinyin}
          </p>
          {copiedKey === charCopyKey && (
            <p
              className="text-xs mt-2"
              style={{ color: "var(--color-bamboo-green)", fontFamily: "var(--font-inter)" }}
            >
              Đã sao chép ✓
            </p>
          )}
        </div>
        <button
          onClick={onToggleBookmark}
          aria-label={bookmarked ? "Bỏ lưu" : "Lưu vào danh sách"}
          className="text-2xl transition-transform hover:scale-110"
          style={{
            color: bookmarked
              ? "var(--color-lacquer-red)"
              : "var(--color-muted-gray)",
          }}
        >
          {bookmarked ? "♥" : "♡"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="text-label-caps mb-1" style={{ color: "var(--color-bamboo-green)" }}>
            SỐ NÉT
          </p>
          <p
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            {entry.strokes} nét
          </p>
        </div>
        <div>
          <p className="text-label-caps mb-1" style={{ color: "var(--color-bamboo-green)" }}>
            BỘ THỦ
          </p>
          <p
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            {entry.radical}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
          NGHĨA
        </p>
        <p
          className="leading-relaxed"
          style={{
            fontFamily: "var(--font-inter)",
            color: "var(--fg)",
            fontSize: 15,
            lineHeight: 1.8,
          }}
        >
          {entry.definition}
        </p>
      </div>

      {entry.analyticalNotes && (
        <div className="mb-6 p-4 rounded" style={{ background: "rgba(86,100,55,0.06)" }}>
          <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
            CHIẾT TỰ
          </p>
          <p
            className="text-sm"
            style={{
              fontFamily: "var(--font-inter)",
              color: "var(--fg)",
              lineHeight: 1.7,
            }}
          >
            {entry.analyticalNotes}
          </p>
        </div>
      )}

      {entry.examples.length > 0 && (
        <div>
          <p className="text-label-caps mb-3" style={{ color: "var(--color-bamboo-green)" }}>
            VÍ DỤ
          </p>
          <ul className="space-y-3">
            {entry.examples.map((ex, idx) => {
              const exKey = `ex-${entry.character}-${idx}`;
              return (
                <li
                  key={exKey}
                  className="flex items-start gap-3 p-3 rounded border"
                  style={{ borderColor: "var(--color-border-tan)" }}
                >
                  <button
                    onClick={() => onCopy(ex.word, exKey)}
                    title="Bấm để sao chép"
                    className="text-2xl shrink-0 transition-opacity hover:opacity-80"
                    style={{ fontFamily: "var(--font-cjk)", color: "var(--color-lacquer-red)" }}
                  >
                    {ex.word}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold"
                      style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                    >
                      {ex.transcription}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{
                        color: "var(--color-muted-gray)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {ex.translation}
                    </p>
                  </div>
                  {copiedKey === exKey && (
                    <span
                      className="text-xs shrink-0"
                      style={{ color: "var(--color-bamboo-green)" }}
                    >
                      Đã sao chép ✓
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
