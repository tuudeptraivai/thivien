import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatNumber } from "@/lib/utils";
import ReaderToolbar from "@/components/poem/ReaderToolbar";
import CommentsSection from "@/components/poem/CommentsSection";
import BookmarkButton from "@/components/poem/BookmarkButton";
import LikeButton from "@/components/poem/LikeButton";
import TranslationSection from "@/components/poem/TranslationSection";
import { getPoemDetail, getInitialComments } from "@/lib/server-api";
import type { PoemVersion, Translation } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const poem = await getPoemDetail(slug);
  return { title: poem ? `${poem.title} – Thi Uyển` : "Đọc thơ" };
}

function PoemLines({ content, className }: { content: string; className?: string }) {
  return (
    <>
      {content.split("\n").map((line, i) => (
        <p key={i} className={className ?? "poem-content"} style={{ marginBottom: "0.2em" }}>
          {line || " "}
        </p>
      ))}
    </>
  );
}

export default async function PoemReaderPage({ params }: Props) {
  const { slug } = await params;
  const poem = await getPoemDetail(slug);

  if (!poem) notFound();

  const { data: initialComments, meta: commentsMeta } = await getInitialComments("poem", poem.id);

  const primaryVersion: PoemVersion | undefined =
    poem.versions?.find((v) => v.is_primary) ?? poem.versions?.[0];
  const isCJK = Boolean(primaryVersion?.transcription);

  return (
    <div style={{ background: "var(--color-reading-sepia)", minHeight: "100vh" }}>
      <ReaderToolbar />

      <div className="max-w-[900px] mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-2 text-xs mb-8"
          style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
        >
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>/</span>
          <Link href="/tho" className="hover:underline">Thơ</Link>
          <span>/</span>
          <span style={{ color: "var(--fg)" }}>{poem.title}</span>
        </nav>

        {/* Title section */}
        <header className="mb-10 text-center">
          <h1
            className="text-headline-lg mb-3"
            style={{ fontFamily: "var(--font-lora)", color: "var(--fg)" }}
          >
            {poem.title}
          </h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {poem.author?.slug ? (
              <Link
                href={`/tac-gia/${poem.author.slug}`}
                className="font-semibold hover:underline"
                style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-lora)" }}
              >
                {poem.author.name}
              </Link>
            ) : (
              <span
                className="font-semibold"
                style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-lora)" }}
              >
                {poem.author?.name ?? "Khuyết danh"}
                {poem.is_member_poem && (
                  <span
                    className="ml-1 font-normal text-xs"
                    style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
                  >
                    · thành viên
                  </span>
                )}
              </span>
            )}
            {poem.category && <Badge variant="default">{poem.category.name}</Badge>}
            <span
              className="text-xs flex items-center gap-1"
              style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {formatNumber(poem.view_count)}
            </span>
            <LikeButton poemId={poem.id} initialLikeCount={poem.like_count ?? 0} />
            <BookmarkButton poemId={poem.id} />
          </div>
        </header>

        {/* Poem content */}
        {isCJK && primaryVersion ? (
          <CJKLayout version={primaryVersion} translations={poem.translations ?? []} />
        ) : (
          <div className="card p-8 mb-10" style={{ background: "var(--color-paper-pure)" }}>
            {primaryVersion?.content ? (
              <PoemLines content={primaryVersion.content} />
            ) : (
              <p style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                Nội dung đang được cập nhật.
              </p>
            )}
          </div>
        )}

        {/* Multiple versions (if any) */}
        {(poem.versions?.length ?? 0) > 1 && (
          <section className="mb-10">
            <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
              CÁC PHIÊN BẢN KHÁC
            </h2>
            <div className="space-y-4">
              {poem.versions!.filter((v) => !v.is_primary).map((v) => (
                <div key={v.id} className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
                  <p
                    className="text-xs font-semibold mb-3"
                    style={{ color: "var(--color-bamboo-green)", fontFamily: "var(--font-inter)" }}
                  >
                    {v.version_name}
                  </p>
                  <PoemLines content={v.content} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Annotations */}
        {(poem.annotations?.length ?? 0) > 0 && (
          <section className="mb-10">
            <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
              CHÚ THÍCH & ĐIỂN TÍCH
            </h2>
            <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {poem.annotations!.map((a) => (
                  <div
                    key={a.keyword}
                    className="border-l-2 pl-3"
                    style={{ borderColor: "var(--color-lacquer-red)" }}
                  >
                    <dt
                      className="font-semibold mb-1"
                      style={{ fontFamily: "var(--font-cjk)", color: "var(--fg)", fontSize: 18 }}
                    >
                      {a.keyword}
                    </dt>
                    <dd
                      className="text-sm leading-relaxed"
                      style={{
                        color: "var(--color-on-surface-variant)",
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {a.explanation}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        <TranslationSection
          poemId={poem.id}
          primaryVersionId={primaryVersion?.id}
          initialTranslations={poem.translations ?? []}
        />

        <CommentsSection
          poemId={poem.id}
          initialComments={initialComments}
          initialTotal={commentsMeta.total_records}
        />
      </div>
    </div>
  );
}

function CJKLayout({
  version,
  translations,
}: {
  version: PoemVersion;
  translations: Translation[];
}) {
  const favTranslation = translations.find((t) => t.is_favorite) ?? translations[0];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Left: Original + Transcription */}
        <div>
          <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
            1. NGUYÊN TÁC
          </h2>
          <div className="card p-6 mb-4" style={{ background: "var(--color-paper-pure)" }}>
            {version.content.split("\n").map((line, i) => (
              <p key={i} className="cjk-text" style={{ marginBottom: "0.3em" }}>
                {line || " "}
              </p>
            ))}
          </div>

          <h2 className="text-label-caps mb-3" style={{ color: "var(--color-bamboo-green)" }}>
            2. PHIÊN ÂM HÁN-VIỆT
          </h2>
          <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
            {version.transcription!.split("\n").map((line, i) => (
              <p
                key={i}
                className="poem-content"
                style={{ marginBottom: "0.3em", fontStyle: "normal" }}
              >
                {line || " "}
              </p>
            ))}
          </div>
        </div>

        {/* Right: Translation(s) */}
        <div>
          <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
            3. BẢN DỊCH THƠ
          </h2>
          {favTranslation ? (
            <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {favTranslation.translator && (
                  <span
                    className="text-sm font-medium"
                    style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                  >
                    Dịch giả:{" "}
                    {favTranslation.translator.slug ? (
                      <Link
                        href={`/tac-gia/${favTranslation.translator.slug}`}
                        className="hover:underline"
                        style={{ color: "var(--color-lacquer-red)" }}
                      >
                        {favTranslation.translator.name}
                      </Link>
                    ) : (
                      favTranslation.translator.name
                    )}
                  </span>
                )}
                {favTranslation.translation_type && (
                  <Badge variant="green">{favTranslation.translation_type}</Badge>
                )}
              </div>
              {favTranslation.content.split("\n").map((line, i) => (
                <p key={i} className="poem-content" style={{ marginBottom: "0.3em" }}>
                  {line || " "}
                </p>
              ))}
            </div>
          ) : (
            <div
              className="card p-6 flex items-center justify-center"
              style={{ background: "var(--color-paper-pure)", minHeight: 120 }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}
              >
                Chưa có bản dịch.
              </p>
            </div>
          )}

          {/* Extra translations */}
          {translations.length > 1 && (
            <div className="mt-4 space-y-3">
              {translations.slice(1).map((t) => (
                <div key={t.id} className="card p-4" style={{ background: "var(--color-paper-pure)" }}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {t.translator && (
                      <span
                        className="text-xs font-medium"
                        style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
                      >
                        {t.translator.name}
                      </span>
                    )}
                    {t.translation_type && (
                      <Badge variant="default">{t.translation_type}</Badge>
                    )}
                  </div>
                  {t.content.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className="poem-content text-sm"
                      style={{ marginBottom: "0.15em" }}
                    >
                      {line || " "}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
