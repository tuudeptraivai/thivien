import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MOCK_POEMS } from "@/lib/mockData";
import { formatNumber } from "@/lib/utils";
import ReaderToolbar from "@/components/poem/ReaderToolbar";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const poem = MOCK_POEMS.find((p) => p.slug === slug);
  return { title: poem?.title ?? "Đọc thơ" };
}

// Sample bilingual poem data
const SAMPLE_POEM = {
  title: "Tĩnh dạ tư (靜夜思)",
  author: { name: "Lý Bạch", slug: "ly-bach" },
  category: "Đường thi",
  view_count: 87500,
  original: {
    title: "1. Nguyên tác (Chữ Hán)",
    content: "床前明月光，\n疑是地上霜。\n舉頭望明月，\n低頭思故鄉。",
  },
  transcription: {
    title: "2. Phiên âm Hán-Việt",
    content:
      "Sàng tiền minh nguyệt quang,\nNghi thị địa thượng sương.\nCử đầu vọng minh nguyệt,\nĐê đầu tư cố hương.",
  },
  translation: {
    translator: "Tương Như",
    type: "Thơ tứ tuyệt",
    content:
      "Đầu giường ánh trăng rọi,\nNgỡ là sương phủ đất.\nNgẩng đầu nhìn trăng sáng,\nCúi đầu nhớ cố hương.",
  },
  annotations: [
    { keyword: "床前", explanation: "Trước giường — đầu giường nơi nằm nghỉ." },
    { keyword: "明月", explanation: "Trăng sáng — biểu tượng cổ điển của tương tư và quê hương trong Đường thi." },
    { keyword: "故鄉", explanation: "Cố hương — quê nhà, nơi người thơ sinh ra và lớn lên." },
  ],
};

export default async function PoemReaderPage({ params }: Props) {
  const { slug } = await params;
  const poem = MOCK_POEMS.find((p) => p.slug === slug);
  const isCJK = slug === "tinh-da-tu" || poem?.category?.name === "Đường thi";

  return (
    <div style={{ background: "var(--color-reading-sepia)", minHeight: "100vh" }}>
      {/* Reader toolbar */}
      <ReaderToolbar />

      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          <Link href="/tho" className="hover:underline">Thơ</Link>
          <span>/</span>
          <span style={{ color: "var(--fg)" }}>{poem?.title ?? SAMPLE_POEM.title}</span>
        </nav>

        {/* Title section */}
        <header className="mb-10 text-center">
          <h1
            className="text-headline-lg mb-3"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            {poem?.title ?? SAMPLE_POEM.title}
          </h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href={`/tac-gia/${poem?.author.slug ?? SAMPLE_POEM.author.slug}`}
              className="font-semibold hover:underline"
              style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-lora)" }}
            >
              {poem?.author.name ?? SAMPLE_POEM.author.name}
            </Link>
            <Badge variant="default">{poem?.category.name ?? SAMPLE_POEM.category}</Badge>
            <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(poem?.view_count ?? SAMPLE_POEM.view_count)}
            </span>
          </div>
        </header>

        {/* Split view: Original + Translation */}
        {isCJK ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {/* Left: Original CJK + Transcription */}
            <div>
              <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
                {SAMPLE_POEM.original.title}
              </h2>
              <div
                className="card p-6 mb-4"
                style={{ background: "var(--color-paper-pure)" }}
              >
                {SAMPLE_POEM.original.content.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className="cjk-text"
                    style={{ marginBottom: "0.3em" }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              <h2 className="text-label-caps mb-3" style={{ color: "var(--color-bamboo-green)" }}>
                {SAMPLE_POEM.transcription.title}
              </h2>
              <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
                {SAMPLE_POEM.transcription.content.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className="poem-content"
                    style={{ marginBottom: "0.3em", fontStyle: "normal" }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Right: Poetic translation */}
            <div>
              <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
                3. BẢN DỊCH THƠ
              </h2>
              <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                    Dịch giả: {SAMPLE_POEM.translation.translator}
                  </span>
                  <Badge variant="green">{SAMPLE_POEM.translation.type}</Badge>
                </div>
                {SAMPLE_POEM.translation.content.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className="poem-content"
                    style={{ marginBottom: "0.3em" }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Single-language poem */
          <div className="card p-8 mb-10" style={{ background: "var(--color-paper-pure)" }}>
            {(poem?.excerpt ?? "").split("\n").map((line, i) => (
              <p key={i} className="poem-content" style={{ marginBottom: "0.2em" }}>
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Annotations */}
        {isCJK && (
          <section className="mb-10">
            <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
              CHÚ THÍCH & ĐIỂN TÍCH
            </h2>
            <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SAMPLE_POEM.annotations.map((a) => (
                  <div key={a.keyword} className="border-l-2 pl-3" style={{ borderColor: "var(--color-lacquer-red)" }}>
                    <dt
                      className="font-semibold mb-1"
                      style={{ fontFamily: "var(--font-cjk)", color: "var(--fg)", fontSize: 18 }}
                    >
                      {a.keyword}
                    </dt>
                    <dd className="text-sm leading-relaxed" style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-inter)" }}>
                      {a.explanation}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Comments */}
        <section>
          <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
            BÌNH LUẬN
          </h2>
          <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
            {/* Comment form */}
            <div className="mb-6">
              <textarea
                rows={3}
                placeholder="Chia sẻ cảm nhận của bạn về bài thơ này..."
                className="w-full border rounded-lg p-3 text-sm resize-none outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
                style={{
                  borderColor: "var(--color-border-tan)",
                  background: "var(--color-surface-container-lowest)",
                  fontFamily: "var(--font-inter)",
                  color: "var(--fg)",
                }}
              />
              <div className="flex justify-end mt-2">
                <button className="btn-primary px-4 py-2 text-sm">
                  Gửi bình luận
                </button>
              </div>
            </div>

            {/* Sample comments */}
            <div className="space-y-4">
              {[
                { name: "Lê Minh Tuấn", time: "2 giờ trước", content: "Bài thơ này thể hiện nỗi nhớ quê hương da diết của Lý Bạch qua hình ảnh ánh trăng đêm khuya. Nghệ thuật đối lập giữa ngẩng đầu và cúi đầu rất tinh tế." },
                { name: "Hoàng Lan Anh", time: "1 ngày trước", content: "Bản dịch của Tương Như rất thoát và giữ được hồn thơ. Tôi thích cách dịch chữ 霜 là 'sương phủ đất'." },
              ].map((c, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs text-white font-semibold"
                    style={{ background: "var(--color-lacquer-red)" }}
                  >
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>{c.name}</span>
                      <span className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>{c.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "var(--color-on-surface-variant)" }}>
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
