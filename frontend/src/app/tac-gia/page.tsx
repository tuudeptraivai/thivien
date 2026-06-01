"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AuthorCard } from "@/components/author/AuthorCard";
import { getAuthors, getEras, getCountries } from "@/lib/api";
import { useDebounce } from "@/lib/hooks";

const LETTERS = "ABCDEFGHIKLMNOPQRSTUVXY".split("");

export default function AuthorListPage() {
  const [search, setSearch] = useState("");
  const [eraId, setEraId] = useState<number | undefined>();
  const [countryId, setCountryId] = useState<number | undefined>();
  const [letter, setLetter] = useState("");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 350);

  const { data: erasData } = useQuery({
    queryKey: ["eras"],
    queryFn: getEras,
    staleTime: Infinity,
  });

  const { data: countriesData } = useQuery({
    queryKey: ["countries"],
    queryFn: getCountries,
    staleTime: Infinity,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["authors", { search: debouncedSearch, eraId, countryId, letter, page }],
    queryFn: () =>
      getAuthors({
        search: debouncedSearch || undefined,
        era_id: eraId,
        country_id: countryId,
        letter: letter || undefined,
        page,
        limit: 12,
      }),
    placeholderData: (prev) => prev,
  });

  const authors = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.total_pages ?? 1;
  const totalRecords = meta?.total_records;

  function resetFilters() {
    setSearch("");
    setEraId(undefined);
    setCountryId(undefined);
    setLetter("");
    setPage(1);
  }

  function handleLetterClick(l: string) {
    setLetter(letter === l ? "" : l);
    setPage(1);
  }

  function handleEraClick(id: number | undefined) {
    setEraId(id);
    setPage(1);
  }

  function handleCountryClick(id: number | undefined) {
    setCountryId(id);
    setPage(1);
  }

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <p className="text-label-caps mb-2" style={{ color: "var(--color-bamboo-green)" }}>
            DANH BẠ
          </p>
          <h1
            className="text-headline-lg"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            Tác giả & Nhà thơ
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            {totalRecords != null
              ? `${totalRecords.toLocaleString()} tác giả`
              : "Đang tải..."}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          {/* Search */}
          <div className="search-pill flex items-center gap-2 px-4 py-2 flex-1 min-w-[200px] max-w-xs">
            <svg className="w-4 h-4 shrink-0" style={{ color: "var(--color-muted-gray)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm tên tác giả..."
              className="bg-transparent outline-none text-sm flex-1"
              style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setPage(1); }} style={{ color: "var(--color-muted-gray)" }}>✕</button>
            )}
          </div>

          {/* Era filter */}
          {erasData && erasData.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleEraClick(undefined)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={{
                  borderColor: eraId === undefined ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
                  color: eraId === undefined ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
                  background: eraId === undefined ? "rgba(142,36,36,0.06)" : "transparent",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Tất cả
              </button>
              {erasData.map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleEraClick(e.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={{
                    borderColor: eraId === e.id ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
                    color: eraId === e.id ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
                    background: eraId === e.id ? "rgba(142,36,36,0.06)" : "transparent",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {e.name}
                </button>
              ))}
            </div>
          )}

          {/* Country filter */}
          {countriesData && countriesData.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCountryClick(undefined)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                style={{
                  borderColor: countryId === undefined ? "var(--color-bamboo-green)" : "var(--color-border-tan)",
                  color: countryId === undefined ? "var(--color-bamboo-green)" : "var(--color-muted-gray)",
                  background: countryId === undefined ? "rgba(44,94,67,0.06)" : "transparent",
                  fontFamily: "var(--font-inter)",
                }}
              >
                Tất cả
              </button>
              {countriesData.slice(0, 8).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCountryClick(c.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                  style={{
                    borderColor: countryId === c.id ? "var(--color-bamboo-green)" : "var(--color-border-tan)",
                    color: countryId === c.id ? "var(--color-bamboo-green)" : "var(--color-muted-gray)",
                    background: countryId === c.id ? "rgba(44,94,67,0.06)" : "transparent",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {c.flag_emoji} {c.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* A-Z Quick jump */}
        <div className="flex flex-wrap gap-1 mb-8">
          {LETTERS.map((l) => (
            <button
              key={l}
              onClick={() => handleLetterClick(l)}
              className="w-8 h-8 rounded text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-inter)",
                color: letter === l ? "#fff" : "var(--color-muted-gray)",
                background: letter === l ? "var(--color-lacquer-red)" : "var(--card-bg)",
                border: letter === l ? "none" : "1px solid var(--color-border-tan)",
              }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Author grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="card p-5 h-24 animate-pulse" style={{ background: "var(--color-paper-pure)" }} />
            ))}
          </div>
        ) : authors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ fontFamily: "var(--font-lora)", color: "var(--color-muted-gray)" }}>
              Không tìm thấy tác giả nào
            </p>
            <button onClick={resetFilters} className="mt-4 text-sm underline" style={{ color: "var(--color-lacquer-red)" }}>
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity ${isFetching ? "opacity-60" : "opacity-100"}`}>
            {authors.map((author) => (
              <AuthorCard key={author.id} author={author} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-9 h-9 rounded-full text-sm transition-colors disabled:opacity-30"
              style={{ border: "1px solid var(--color-border-tan)", color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
            >
              ‹
            </button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className="w-9 h-9 rounded-full text-sm transition-colors"
                  style={{
                    fontFamily: "var(--font-inter)",
                    background: page === p ? "var(--color-lacquer-red)" : "transparent",
                    color: page === p ? "#fff" : "var(--color-muted-gray)",
                    border: page === p ? "none" : "1px solid var(--color-border-tan)",
                  }}
                >
                  {p}
                </button>
              );
            })}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="w-9 h-9 rounded-full text-sm transition-colors disabled:opacity-30"
              style={{ border: "1px solid var(--color-border-tan)", color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
