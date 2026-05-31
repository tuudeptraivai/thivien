"use client";
import Link from "next/link";
import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api/v1";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [facebookLoading, setFacebookLoading] = useState(false);

  const handleFacebookLogin = () => {
    setFacebookLoading(true);
    window.location.href = `${API_URL}/auth/facebook`;
  };

  return (
    <div
      className="min-h-[calc(100vh-64px)] grid grid-cols-1 md:grid-cols-2"
      style={{ background: "var(--color-background-parchment)" }}
    >
      {/* Left panel — decorative */}
      <div
        className="hidden md:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1a0a0a 0%, #3b1212 50%, #1a0a0a 100%)",
          color: "#EAE3D2",
        }}
      >
        {/* Logo */}
        <Link href="/" className="text-2xl font-semibold" style={{ fontFamily: "var(--font-lora)", color: "#d4a09a" }}>
          ❧ Thi Uyển
        </Link>

        {/* Featured poem */}
        <div>
          <p
            className="text-4xl leading-[1.6] mb-6"
            style={{
              fontFamily: "var(--font-lora)",
              fontStyle: "italic",
              color: "#EAE3D2",
              lineHeight: 2.0,
            }}
          >
            "Trăm năm trong cõi người ta,
            <br />
            Chữ tài chữ mệnh khéo là ghét nhau."
          </p>
          <p style={{ color: "#8a7a6e", fontFamily: "var(--font-inter)", fontSize: 14 }}>
            — Nguyễn Du, Truyện Kiều
          </p>
        </div>

        {/* Decorative CJK */}
        <div
          className="absolute right-8 bottom-12 text-[180px] opacity-[0.04] pointer-events-none select-none"
          style={{ fontFamily: "var(--font-cjk)", color: "#fff", lineHeight: 1 }}
        >
          詩
        </div>

        <p style={{ color: "#4a3a3a", fontFamily: "var(--font-inter)", fontSize: 12 }}>
          © 2024 Thi Uyển — 112.000 tác phẩm thi ca
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1
              className="text-headline-md mb-2"
              style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
            >
              Đăng nhập
            </h1>
            <p className="text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Chào mừng trở lại Thi Uyển
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label className="text-label-caps block mb-1.5" style={{ color: "var(--color-bamboo-green)" }}>
                TÊN ĐĂNG NHẬP / EMAIL
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="username hoặc email@example.com"
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                style={{
                  borderColor: "var(--color-border-tan)",
                  background: "var(--color-paper-pure)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
            </div>

            <div>
              <label className="text-label-caps block mb-1.5" style={{ color: "var(--color-bamboo-green)" }}>
                MẬT KHẨU
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                style={{
                  borderColor: "var(--color-border-tan)",
                  background: "var(--color-paper-pure)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
              <div className="flex justify-end mt-1.5">
                <Link href="/quen-mat-khau" className="text-xs hover:underline" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <button type="submit" className="btn-primary w-full py-3 text-sm mt-2">
              Đăng nhập
            </button>
          </form>

          <div className="flex items-center gap-3 my-5" aria-hidden="true">
            <div className="flex-1 h-px" style={{ background: "var(--color-border-tan)" }} />
            <span
              className="text-xs uppercase tracking-wider"
              style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
            >
              Hoặc
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border-tan)" }} />
          </div>

          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={facebookLoading}
            className="w-full py-3 text-sm rounded-lg flex items-center justify-center gap-2 font-medium transition-opacity disabled:opacity-60"
            style={{
              background: "#1877F2",
              color: "#fff",
              fontFamily: "var(--font-inter)",
            }}
            aria-label="Đăng nhập với Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {facebookLoading ? "Đang chuyển hướng…" : "Đăng nhập với Facebook"}
          </button>

          <p className="text-center mt-6 text-sm" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky" className="font-medium hover:underline" style={{ color: "var(--color-lacquer-red)" }}>
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
