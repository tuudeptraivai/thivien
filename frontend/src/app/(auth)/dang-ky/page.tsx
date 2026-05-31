"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ username: "", email: "", displayName: "", password: "" });

  return (
    <div
      className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2"
      style={{ background: "var(--color-background-parchment)" }}
    >
      {/* Left panel */}
      <div
        className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #0a1a12 0%, #123b21 50%, #0a1a12 100%)",
          color: "#D5EDE0",
        }}
      >
        <Link href="/" className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)", color: "#9dd3b0" }}>
          ❧ Thi Uyển
        </Link>

        <div>
          <p className="text-xl font-medium mb-4" style={{ fontFamily: "var(--font-lora)", color: "#D5EDE0" }}>
            Tham gia cộng đồng thi ca
          </p>
          <ul className="space-y-3 text-sm" style={{ color: "#8aad96", fontFamily: "var(--font-inter)" }}>
            {[
              "✍️ Sáng tác và chia sẻ thơ của bạn",
              "📚 Tủ thơ yêu thích cá nhân",
              "💬 Tham gia diễn đàn thảo luận văn học",
              "🔤 Trợ lý gieo vần AI thông minh",
            ].map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>

        <p style={{ color: "#2d4a38", fontFamily: "var(--font-inter)", fontSize: 12 }}>
          © 2024 Thi Uyển
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-headline-md mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
              Đăng ký tài khoản
            </h1>
            <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Miễn phí. Không quảng cáo.
            </p>
          </div>

          <form className="space-y-4">
            {[
              { label: "HỌ TÊN HIỂN THỊ", key: "displayName", type: "text", placeholder: "Tên bút danh của bạn" },
              { label: "TÊN ĐĂNG NHẬP", key: "username", type: "text", placeholder: "Chỉ dùng chữ, số, gạch dưới" },
              { label: "EMAIL", key: "email", type: "email", placeholder: "email@example.com" },
              { label: "MẬT KHẨU", key: "password", type: "password", placeholder: "Tối thiểu 8 ký tự" },
            ].map((f) => (
              <div key={f.key}>
                <label className="text-label-caps block mb-1.5" style={{ color: "var(--color-bamboo-green)" }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                  style={{
                    borderColor: "var(--color-border-tan)",
                    background: "var(--color-paper-pure)",
                    fontFamily: "var(--font-inter)",
                    color: "var(--fg)",
                  }}
                />
              </div>
            ))}

            <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link href="/dieu-khoan" className="underline" style={{ color: "var(--color-lacquer-red)" }}>
                điều khoản sử dụng
              </Link>
            </p>

            <button type="submit" className="btn-primary w-full py-3 text-sm">
              Tạo tài khoản
            </button>
          </form>

          <p className="text-center mt-6 text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Đã có tài khoản?{" "}
            <Link href="/dang-nhap" className="font-medium hover:underline" style={{ color: "var(--color-lacquer-red)" }}>
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
