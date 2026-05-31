"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/stores/useStore";
import { getMe } from "@/lib/api";

function CallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useStore((s) => s.setAuth);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errParam = searchParams.get("error");

    if (errParam) {
      setError(decodeURIComponent(errParam));
      return;
    }

    if (!token) {
      setError("Không nhận được mã xác thực từ Facebook");
      return;
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("tv_token", token);
    }

    let cancelled = false;
    (async () => {
      try {
        const user = await getMe();
        if (cancelled) return;
        setAuth(user, token);
        router.replace("/");
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : "Không thể lấy thông tin tài khoản",
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, router, setAuth]);

  if (error) {
    return (
      <div className="text-center max-w-sm">
        <h1
          className="text-headline-md mb-3"
          style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
        >
          Đăng nhập thất bại
        </h1>
        <p
          className="text-sm mb-6"
          style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
        >
          {error}
        </p>
        <Link href="/dang-nhap" className="btn-primary inline-block px-6 py-2.5 text-sm">
          Thử lại
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div
        className="inline-block w-8 h-8 rounded-full animate-spin mb-4"
        style={{
          border: "3px solid var(--color-border-tan)",
          borderTopColor: "var(--color-lacquer-red)",
        }}
        role="status"
        aria-label="Đang xử lý đăng nhập"
      />
      <p
        className="text-sm"
        style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
      >
        Đang hoàn tất đăng nhập…
      </p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div
      className="min-h-[calc(100vh-64px)] flex items-center justify-center px-6"
      style={{ background: "var(--color-background-parchment)" }}
    >
      <Suspense
        fallback={
          <p
            className="text-sm"
            style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
          >
            Đang tải…
          </p>
        }
      >
        <CallbackInner />
      </Suspense>
    </div>
  );
}
