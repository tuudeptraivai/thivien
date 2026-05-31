"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/stores/useStore";

const NAV_LINKS = [
  { href: "/tac-gia", label: "Tác giả" },
  { href: "/tho",     label: "Thơ" },
  { href: "/sang-tac",label: "Sáng tác" },
  { href: "/dien-dan",label: "Diễn đàn" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme, user, clearAuth } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchRef.current?.focus(), 50);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
      setSearchOpen(false);
      setQ("");
    }
  }

  return (
    <header className="glass-header sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          <span
            className="text-xl font-semibold"
            style={{ color: "var(--color-lacquer-red)" }}
          >
            ❧ Thi Uyển
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              style={{
                fontFamily: "var(--font-inter)",
                color: pathname?.startsWith(l.href)
                  ? "var(--color-lacquer-red)"
                  : "var(--color-muted-gray)",
              }}
            >
              {l.label}
              {pathname?.startsWith(l.href) && (
                <span
                  className="block h-0.5 mt-0.5 rounded-full"
                  style={{ background: "var(--color-lacquer-red)" }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          {/* Search toggle */}
          {searchOpen ? (
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="search-pill flex items-center px-4 py-1.5 gap-2">
                <svg className="w-4 h-4 shrink-0" style={{ color: "var(--color-lacquer-red)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                  ref={searchRef}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Tìm bài thơ, tác giả..."
                  className="bg-transparent outline-none text-sm w-48"
                  style={{ fontFamily: "var(--font-inter)" }}
                  onBlur={() => !q && setSearchOpen(false)}
                />
                <kbd className="text-xs px-1.5 py-0.5 rounded border" style={{ color: "var(--color-muted-gray)", borderColor: "var(--color-border-tan)" }}>
                  Esc
                </kbd>
              </div>
            </form>
          ) : (
            <button
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 50); }}
              className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              title="Tìm kiếm (⌘K)"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </button>
          )}

          {/* More pages */}
          <Link href="/tu-dien" className="hidden lg:block text-sm px-2 py-1" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Từ điển
          </Link>
          <Link href="/thong-ke" className="hidden lg:block text-sm px-2 py-1" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Thống kê
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
          >
            {theme === "dark" ? (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/ca-nhan" className="text-sm font-medium" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>
                {user.display_name}
              </Link>
              <button onClick={clearAuth} className="btn-ghost text-sm px-3 py-1.5">
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link href="/dang-nhap" className="btn-ghost text-sm px-4 py-1.5" style={{ color: "var(--color-lacquer-red)", borderColor: "var(--color-lacquer-red)" }}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
