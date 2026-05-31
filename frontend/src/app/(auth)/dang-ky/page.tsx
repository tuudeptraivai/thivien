"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { register as registerApi } from "@/lib/api";
import { useStore } from "@/stores/useStore";

type FieldErrors = {
  display_name?: string;
  username?: string;
  email?: string;
  password?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-zA-Z0-9_]+$/;

export default function RegisterPage() {
  const router = useRouter();
  const user = useStore((s) => s.user);
  const setAuth = useStore((s) => s.setAuth);

  const [form, setForm] = useState({
    display_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  function validate(): FieldErrors {
    const errs: FieldErrors = {};

    const displayName = form.display_name.trim();
    if (!displayName) errs.display_name = "Vui lòng nhập họ tên hiển thị";
    else if (displayName.length > 100) errs.display_name = "Tối đa 100 ký tự";

    const username = form.username.trim();
    if (!username) errs.username = "Vui lòng nhập tên đăng nhập";
    else if (username.length > 50) errs.username = "Tối đa 50 ký tự";
    else if (!USERNAME_RE.test(username))
      errs.username = "Chỉ dùng chữ, số và dấu gạch dưới";

    const email = form.email.trim();
    if (!email) errs.email = "Vui lòng nhập email";
    else if (!EMAIL_RE.test(email)) errs.email = "Email không hợp lệ";

    if (!form.password) errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 8) errs.password = "Mật khẩu tối thiểu 8 ký tự";

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
      const { user: newUser, access_token } = await registerApi({
        display_name: form.display_name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setAuth(newUser, access_token);
      router.replace("/");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const body = err.response?.data as
          | { message?: string | string[]; error?: { message?: string | string[] } }
          | undefined;
        const raw = body?.error?.message ?? body?.message;
        const message = Array.isArray(raw) ? raw[0] : raw;

        if (status === 409) {
          setServerError("Tên đăng nhập hoặc email đã được sử dụng");
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

  if (user) return null;

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
                htmlFor="register-display-name"
                className="text-label-caps block mb-1.5"
                style={{ color: "var(--color-bamboo-green)" }}
              >
                HỌ TÊN HIỂN THỊ
              </label>
              <input
                id="register-display-name"
                type="text"
                autoComplete="name"
                value={form.display_name}
                onChange={(e) => {
                  setForm((f) => ({ ...f, display_name: e.target.value }));
                  if (fieldErrors.display_name)
                    setFieldErrors((p) => ({ ...p, display_name: undefined }));
                }}
                placeholder="Tên bút danh của bạn"
                maxLength={100}
                aria-invalid={!!fieldErrors.display_name}
                aria-describedby={
                  fieldErrors.display_name ? "register-display-name-error" : undefined
                }
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                style={{
                  borderColor: fieldErrors.display_name
                    ? "var(--color-lacquer-red)"
                    : "var(--color-border-tan)",
                  background: "var(--color-paper-pure)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
              {fieldErrors.display_name && (
                <p
                  id="register-display-name-error"
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}
                >
                  {fieldErrors.display_name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-username"
                className="text-label-caps block mb-1.5"
                style={{ color: "var(--color-bamboo-green)" }}
              >
                TÊN ĐĂNG NHẬP
              </label>
              <input
                id="register-username"
                type="text"
                autoComplete="username"
                value={form.username}
                onChange={(e) => {
                  setForm((f) => ({ ...f, username: e.target.value }));
                  if (fieldErrors.username)
                    setFieldErrors((p) => ({ ...p, username: undefined }));
                }}
                placeholder="Chỉ dùng chữ, số, gạch dưới"
                maxLength={50}
                aria-invalid={!!fieldErrors.username}
                aria-describedby={
                  fieldErrors.username ? "register-username-error" : undefined
                }
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                style={{
                  borderColor: fieldErrors.username
                    ? "var(--color-lacquer-red)"
                    : "var(--color-border-tan)",
                  background: "var(--color-paper-pure)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
              {fieldErrors.username && (
                <p
                  id="register-username-error"
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}
                >
                  {fieldErrors.username}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-email"
                className="text-label-caps block mb-1.5"
                style={{ color: "var(--color-bamboo-green)" }}
              >
                EMAIL
              </label>
              <input
                id="register-email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => {
                  setForm((f) => ({ ...f, email: e.target.value }));
                  if (fieldErrors.email)
                    setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
                placeholder="email@example.com"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
                className="w-full border rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                style={{
                  borderColor: fieldErrors.email
                    ? "var(--color-lacquer-red)"
                    : "var(--color-border-tan)",
                  background: "var(--color-paper-pure)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
              {fieldErrors.email && (
                <p
                  id="register-email-error"
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="register-password"
                className="text-label-caps block mb-1.5"
                style={{ color: "var(--color-bamboo-green)" }}
              >
                MẬT KHẨU
              </label>
              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => {
                    setForm((f) => ({ ...f, password: e.target.value }));
                    if (fieldErrors.password)
                      setFieldErrors((p) => ({ ...p, password: undefined }));
                  }}
                  placeholder="Tối thiểu 8 ký tự"
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={
                    fieldErrors.password ? "register-password-error" : undefined
                  }
                  className="w-full border rounded-lg px-4 py-2.5 pr-12 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                  style={{
                    borderColor: fieldErrors.password
                      ? "var(--color-lacquer-red)"
                      : "var(--color-border-tan)",
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
                  style={{
                    color: "var(--color-muted-gray)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
              {fieldErrors.password && (
                <p
                  id="register-password-error"
                  className="mt-1 text-xs"
                  style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <Link href="/dieu-khoan" className="underline" style={{ color: "var(--color-lacquer-red)" }}>
                điều khoản sử dụng
              </Link>
            </p>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
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
