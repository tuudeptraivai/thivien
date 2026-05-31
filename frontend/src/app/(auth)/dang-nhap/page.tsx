"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { login as loginApi } from "@/lib/api";
import { useStore } from "@/stores/useStore";

declare global {
  interface Window {
    FB: {
      init: (opts: { appId: string; cookie: boolean; xfbml: boolean; version: string }) => void;
      login: (cb: (res: { authResponse?: { accessToken: string } }) => void, opts: { scope: string }) => void;
    };
    fbAsyncInit?: () => void;
  }
}

type FieldErrors = { email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/v1";
const FB_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID ?? "";

export default function LoginPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const setAuth = useStore((s) => s.setAuth);

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  // Load Facebook JS SDK
  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({ appId: FB_APP_ID, cookie: true, xfbml: true, version: "v19.0" });
    };

    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/vi_VN/sdk.js";
      document.body.appendChild(js);
    }
  }, []);

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!form.email.trim()) errs.email = "Vui lòng nhập email";
    else if (!EMAIL_RE.test(form.email.trim())) errs.email = "Email không hợp lệ";
    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 6) errs.password = "Mật khẩu tối thiểu 6 ký tự";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const errs = validate();
    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const { user, access_token } = await loginApi(form.email.trim(), form.password);
      setAuth(user, access_token);
      router.replace("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const body = err.response?.data as
          | { message?: string | string[]; error?: { message?: string | string[] } }
          | undefined;
        const raw = body?.error?.message ?? body?.message;
        const message = Array.isArray(raw) ? raw[0] : raw;

        if (status === 404) {
          setFieldErrors({ email: message ?? "Email chưa được đăng ký" });
        } else if (status === 401) {
          setFieldErrors({ password: message ?? "Mật khẩu không đúng" });
        } else if (status === 403) {
          setServerError(message ?? "Tài khoản đã bị khoá");
        } else if (status === 400) {
          setServerError(message ?? "Dữ liệu không hợp lệ");
        } else {
          setServerError(message ?? "Không thể kết nối máy chủ. Vui lòng thử lại.");
        }
      } else {
        setServerError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleFacebookLogin() {
    setFacebookLoading(true);
    setServerError(null);

    window.FB.login(
      (response) => {
        if (!response.authResponse) {
          setFacebookLoading(false);
          return;
        }
        axios
          .post(`${API_URL}/auth/facebook/token`, {
            access_token: response.authResponse.accessToken,
          })
          .then(({ data }) => {
            setAuth(data.data.user, data.data.access_token);
            router.replace("/");
          })
          .catch((err: unknown) => {
            if (axios.isAxiosError(err)) {
              const body = err.response?.data as { message?: string } | undefined;
              setServerError(body?.message ?? "Đăng nhập Facebook thất bại.");
            } else {
              setServerError("Đăng nhập Facebook thất bại.");
            }
            setFacebookLoading(false);
          });
      },
      { scope: "public_profile" },
    );
  }

  if (user) return null;

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
        <Link
          href="/"
          className="text-2xl font-semibold"
          style={{ fontFamily: "var(--font-lora)", color: "#d4a09a" }}
        >
          ❧ Thi Uyển
        </Link>

        <div>
          <p
            className="text-4xl leading-[1.6] mb-6"
            style={{ fontFamily: "var(--font-lora)", fontStyle: "italic", color: "#EAE3D2", lineHeight: 2.0 }}
          >
            &ldquo;Trăm năm trong cõi người ta,
            <br />
            Chữ tài chữ mệnh khéo là ghét nhau.&rdquo;
          </p>
          <p style={{ color: "#8a7a6e", fontFamily: "var(--font-inter)", fontSize: 14 }}>
            — Nguyễn Du, Truyện Kiều
          </p>
        </div>

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

          {serverError && (
            <div
              role="alert"
              className="mb-4 rounded-lg border px-3 py-2 text-sm"
              style={{
                borderColor: "var(--color-lacquer-red)",
                color: "var(--color-lacquer-red)",
                background: "rgba(180, 50, 50, 0.06)",
                fontFamily: "var(--font-inter)",
              }}
            >
              {serverError}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="login-email"
                className="text-label-caps block mb-1.5"
                style={{ color: "var(--color-bamboo-green)" }}
              >
                EMAIL
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="email@example.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                style={{
                  borderColor: fieldErrors.email ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
                  background: "var(--color-paper-pure)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
              {fieldErrors.email && (
                <p id="login-email-error" className="mt-1 text-xs" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="text-label-caps block mb-1.5"
                style={{ color: "var(--color-bamboo-green)" }}
              >
                MẬT KHẨU
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="••••••••"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                  className="w-full border rounded-lg px-4 py-2.5 pr-12 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                  style={{
                    borderColor: fieldErrors.password ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
                    background: "var(--color-paper-pure)",
                    fontFamily: "var(--font-inter)",
                    color: "var(--fg)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
                  aria-pressed={showPassword}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 text-xs rounded hover:bg-black/5 transition-colors"
                  style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {fieldErrors.password && (
                <p id="login-password-error" className="mt-1 text-xs" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>
                  {fieldErrors.password}
                </p>
              )}
              <div className="flex justify-end mt-1.5">
                <Link
                  href="/quen-mat-khau"
                  className="text-xs hover:underline"
                  style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-sm mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5" aria-hidden="true">
            <div className="flex-1 h-px" style={{ background: "var(--color-border-tan)" }} />
            <span className="text-xs uppercase tracking-wider" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Hoặc
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border-tan)" }} />
          </div>

          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={facebookLoading}
            className="w-full py-3 text-sm rounded-lg flex items-center justify-center gap-2 font-medium transition-opacity disabled:opacity-60"
            style={{ background: "#1877F2", color: "#fff", fontFamily: "var(--font-inter)" }}
            aria-label="Đăng nhập với Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            {facebookLoading ? "Đang xử lý…" : "Đăng nhập với Facebook"}
          </button>

          <p
            className="text-center mt-6 text-sm"
            style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
          >
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
