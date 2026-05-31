import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { MOCK_FORUM_TOPICS } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ "topic-slug": string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "topic-slug": slug } = await params;
  const topic = MOCK_FORUM_TOPICS.find((t) => t.slug === slug);
  return { title: topic?.title ?? "Chủ đề diễn đàn" };
}

const SAMPLE_REPLIES = [
  {
    id: 1,
    author: "GS. Nguyễn Văn A",
    time: "20/05/2026",
    content:
      'Truyện Kiều của Nguyễn Du không chỉ là câu chuyện về số phận Thuý Kiều mà còn là bức tranh toàn cảnh của xã hội phong kiến Việt Nam thế kỷ XVIII–XIX. Nghệ thuật đặc sắc nhất là sự kết hợp giữa thể thơ lục bát truyền thống với ngôn ngữ Hán-Nôm điêu luyện.',
    isOP: true,
  },
  {
    id: 2,
    author: "ThS. Trần Thị B",
    time: "21/05/2026",
    content:
      "Tôi đồng ý với quan điểm trên. Thêm vào đó, Nguyễn Du đã sử dụng kỹ thuật 'điểm nhãn' rất tài tình — chỉ vài nét phác họa đã lột tả được chiều sâu tâm lý nhân vật.",
    isOP: false,
  },
  {
    id: 3,
    author: "Độc giả Phạm C",
    time: "22/05/2026",
    content:
      "Câu thơ 'Trăm năm trong cõi người ta / Chữ tài chữ mệnh khéo là ghét nhau' đã nói lên được cái nghịch lý muôn đời của tài năng và số phận.",
    isOP: false,
    quote: {
      author: "GS. Nguyễn Văn A",
      text: "Nghệ thuật đặc sắc nhất là sự kết hợp giữa thể thơ lục bát truyền thống...",
    },
  },
];

export default async function ForumTopicPage({ params }: Props) {
  const { "topic-slug": slug } = await params;
  const topic = MOCK_FORUM_TOPICS.find((t) => t.slug === slug) ?? MOCK_FORUM_TOPICS[0];

  return (
    <div style={{ background: "var(--color-background-parchment)", minHeight: "100vh" }}>
      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs flex items-center gap-2 mb-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          <Link href="/dien-dan" className="hover:underline">Diễn đàn</Link>
          <span>/</span>
          <span style={{ color: "var(--fg)" }}>{topic.title}</span>
        </nav>

        {/* Topic header */}
        <div className="mb-8">
          <Badge variant="muted" className="mb-3">{topic.category}</Badge>
          <h1 className="text-headline-md mb-2" style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}>
            {topic.title}
          </h1>
          <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Tạo bởi <strong style={{ color: "var(--fg)" }}>{topic.author_name}</strong>
            {" · "}{formatDate(topic.created_at)}
            {" · "}{topic.reply_count} trả lời
            {" · "}{topic.view_count} lượt xem
          </p>
        </div>

        {/* Replies */}
        <div className="space-y-4 mb-10">
          {SAMPLE_REPLIES.map((reply) => (
            <div
              key={reply.id}
              className="card p-6"
              style={{
                background: reply.isOP ? "var(--color-paper-pure)" : "var(--card-bg)",
                borderColor: reply.isOP ? "var(--color-lacquer-red)" : "var(--color-border-tan)",
                borderLeftWidth: reply.isOP ? 3 : 1,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white shrink-0"
                  style={{ background: reply.isOP ? "var(--color-lacquer-red)" : "var(--color-bamboo-green)" }}
                >
                  {reply.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                    {reply.author}
                    {reply.isOP && (
                      <Badge variant="red" className="ml-2">Tác giả chủ đề</Badge>
                    )}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                    {reply.time}
                  </p>
                </div>
              </div>

              {reply.quote && (
                <blockquote
                  className="mb-4 pl-4 py-2 text-sm italic"
                  style={{
                    borderLeft: "3px solid var(--color-border-tan)",
                    color: "var(--color-muted-gray)",
                    fontFamily: "var(--font-inter)",
                  }}
                >
                  <strong>{reply.quote.author}</strong> viết: &ldquo;{reply.quote.text}&rdquo;
                </blockquote>
              )}

              <p className="leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)", fontSize: 15 }}>
                {reply.content}
              </p>
            </div>
          ))}
        </div>

        {/* Reply form */}
        <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
          <h3 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
            VIẾT TRẢ LỜI
          </h3>
          <textarea
            rows={5}
            placeholder="Chia sẻ quan điểm của bạn về chủ đề này..."
            className="w-full border rounded-lg p-4 text-sm resize-none outline-none focus:border-[var(--color-lacquer-red)] transition-colors mb-4"
            style={{
              borderColor: "var(--color-border-tan)",
              background: "var(--color-surface-container-lowest)",
              fontFamily: "var(--font-inter)",
              color: "var(--fg)",
            }}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              Vui lòng <Link href="/dang-nhap" className="underline" style={{ color: "var(--color-lacquer-red)" }}>đăng nhập</Link> để bình luận
            </p>
            <button className="btn-primary px-5 py-2 text-sm">
              Gửi trả lời
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
