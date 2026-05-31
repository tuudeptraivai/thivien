import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ background: "#1A1A1E", color: "var(--color-dark-text)" }}
    >
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div>
            <p
              className="text-lg font-semibold mb-3"
              style={{ fontFamily: "var(--font-lora)", color: "var(--color-lacquer-red)" }}
            >
              ❧ Thi Uyển
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#8a8478" }}>
              Thư viện thi ca Việt — 112.000 tác phẩm từ cổ điển đến hiện đại.
            </p>
          </div>

          {/* Khám phá */}
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#8a8478" }}>
              Khám phá
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/tac-gia", label: "Tác giả" },
                { href: "/tho", label: "Thể loại thơ" },
                { href: "/search", label: "Tìm kiếm nâng cao" },
                { href: "/thong-ke", label: "Thống kê" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition-colors"
                    style={{ color: "#8a8478" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cộng đồng */}
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#8a8478" }}>
              Cộng đồng
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/dien-dan", label: "Diễn đàn" },
                { href: "/sang-tac", label: "Sáng tác thành viên" },
                { href: "/dang-ky", label: "Đăng ký thành viên" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition-colors"
                    style={{ color: "#8a8478" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Công cụ */}
          <div>
            <h4 className="text-sm font-semibold mb-3 uppercase tracking-widest" style={{ color: "#8a8478" }}>
              Công cụ
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/tu-dien", label: "Từ điển Hán–Việt" },
                { href: "/sang-tac/tro-ly", label: "Trợ lý gieo vần" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="hover:text-white transition-colors"
                    style={{ color: "#8a8478" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs border-t"
          style={{ borderColor: "#2a2a2e", color: "#6b6560" }}
        >
          <p>© 2024 Thi Uyển. Hoạt động từ năm 2004.</p>
          <p>Lưu giữ tinh hoa thi ca dân tộc.</p>
        </div>
      </div>
    </footer>
  );
}
