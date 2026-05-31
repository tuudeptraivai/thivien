import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Providers from "@/providers/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Thi Uyển — Thư viện thi ca Việt",
    template: "%s | Thi Uyển",
  },
  description:
    "Thư viện thơ ca lớn nhất Việt Nam — 112.000 tác phẩm từ Đường thi, thơ Nôm, đến thơ hiện đại. Đọc, tra cứu, sáng tác và thảo luận về thơ.",
  keywords: ["thơ", "thi viện", "thơ Đường", "thơ Nôm", "Nguyễn Du", "Truyện Kiều"],
  openGraph: {
    title: "Thi Uyển — Thư viện thi ca Việt",
    description: "112.000 tác phẩm thơ ca từ cổ điển đến hiện đại",
    locale: "vi_VN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
