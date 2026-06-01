"use client";

import { useState, useTransition, useCallback } from "react";
import { useStore } from "@/stores/useStore";
import { postComment } from "@/lib/api";
import type { CommentItem } from "@/lib/types";
import { formatDistanceToNow } from "@/lib/utils";

interface Props {
  poemId: number;
  initialComments: CommentItem[];
  initialTotal: number;
}

// ─── shared helpers ──────────────────────────────────────────────────────────

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  return (
    <div
      className="rounded-full shrink-0 flex items-center justify-center text-xs text-white font-semibold"
      style={{
        background: "var(--color-lacquer-red)",
        width: size,
        height: size,
        minWidth: size,
        fontSize: size < 30 ? 10 : 12,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const INPUT_CLASS =
  "w-full border rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--color-lacquer-red)] transition-colors";
const INPUT_STYLE = {
  borderColor: "var(--color-border-tan)",
  background: "var(--color-surface-container-lowest)",
  fontFamily: "var(--font-inter)",
  color: "var(--fg)",
} as const;

// ─── inline reply form ────────────────────────────────────────────────────────

interface ReplyFormProps {
  parentId: number;
  replyingToName: string;
  onClose: () => void;
  onSubmit: (parentId: number, content: string, guestName?: string, guestEmail?: string) => Promise<void>;
}

function ReplyForm({ parentId, replyingToName, onClose, onSubmit }: ReplyFormProps) {
  const user = useStore((s) => s.user);
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!content.trim()) { setError("Vui lòng nhập nội dung."); return; }
    if (!user) {
      if (!guestName.trim()) { setError("Vui lòng nhập tên."); return; }
      if (!guestEmail.trim()) { setError("Vui lòng nhập email."); return; }
    }
    startTransition(async () => {
      try {
        await onSubmit(parentId, content.trim(), guestName.trim() || undefined, guestEmail.trim() || undefined);
        onClose();
      } catch {
        setError("Gửi thất bại. Vui lòng thử lại.");
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-3 ml-10 pl-4 border-l-2"
      style={{ borderColor: "var(--color-border-tan)" }}
    >
      <p className="text-xs mb-2" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
        Trả lời{" "}
        <span style={{ color: "var(--color-lacquer-red)", fontWeight: 600 }}>
          {replyingToName}
        </span>
      </p>

      {!user && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="text"
            placeholder="Tên *"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
          <input
            type="email"
            placeholder="Email *"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            className={INPUT_CLASS}
            style={INPUT_STYLE}
          />
        </div>
      )}

      <textarea
        rows={2}
        autoFocus
        placeholder={`Trả lời ${replyingToName}...`}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border rounded-lg p-2 text-sm resize-none outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
        style={INPUT_STYLE}
      />

      {error && (
        <p className="text-xs mt-1" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>
          {error}
        </p>
      )}

      <div className="flex gap-2 justify-end mt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
          style={{
            borderColor: "var(--color-border-tan)",
            color: "var(--color-muted-gray)",
            fontFamily: "var(--font-inter)",
          }}
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="btn-primary px-3 py-1.5 text-xs disabled:opacity-60"
        >
          {isPending ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </form>
  );
}

// ─── single comment bubble ────────────────────────────────────────────────────

interface BubbleProps {
  comment: CommentItem;
  depth?: number;
  replyingTo: number | null;
  onSetReplyingTo: (id: number | null) => void;
  onSubmitReply: ReplyFormProps["onSubmit"];
}

function CommentBubble({ comment, depth = 0, replyingTo, onSetReplyingTo, onSubmitReply }: BubbleProps) {
  const displayName = comment.author.display_name ?? "Ẩn danh";
  const isReplying = replyingTo === comment.id;

  return (
    <div className={depth > 0 ? "mt-4" : ""}>
      <div className="flex gap-3">
        <Avatar name={displayName} size={depth > 0 ? 26 : 32} />
        <div className="flex-1 min-w-0">
          {/* Author + time */}
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span
              className="text-sm font-semibold"
              style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}
            >
              {displayName}
            </span>
            {comment.author.is_guest && (
              <span className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
                (khách)
              </span>
            )}
            <span className="text-xs" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
              {formatDistanceToNow(comment.created_at)}
            </span>
          </div>

          {/* Content */}
          <p className="text-sm leading-relaxed" style={{ fontFamily: "var(--font-inter)", color: "var(--color-on-surface-variant)" }}>
            {comment.content}
          </p>

          {/* Reply button — only on root & depth-1 comments */}
          {depth < 2 && (
            <button
              onClick={() => onSetReplyingTo(isReplying ? null : comment.id)}
              className="mt-1 text-xs flex items-center gap-1 transition-colors"
              style={{
                color: isReplying ? "var(--color-lacquer-red)" : "var(--color-muted-gray)",
                fontFamily: "var(--font-inter)",
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              {isReplying ? "Đóng" : "Trả lời"}
            </button>
          )}
        </div>
      </div>

      {/* Inline reply form */}
      {isReplying && (
        <ReplyForm
          parentId={comment.id}
          replyingToName={displayName}
          onClose={() => onSetReplyingTo(null)}
          onSubmit={onSubmitReply}
        />
      )}

      {/* Nested replies */}
      {comment.replies.length > 0 && (
        <div className="ml-10 mt-1 pl-3 border-l" style={{ borderColor: "var(--color-border-tan)" }}>
          {comment.replies.map((reply) => (
            <CommentBubble
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              replyingTo={replyingTo}
              onSetReplyingTo={onSetReplyingTo}
              onSubmitReply={onSubmitReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── main section ─────────────────────────────────────────────────────────────

export default function CommentsSection({ poemId, initialComments, initialTotal }: Props) {
  const user = useStore((s) => s.user);
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [total, setTotal] = useState(initialTotal);

  // Root comment form state
  const [content, setContent] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  // Which comment is currently showing reply form
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  // ── root comment submit ──
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!content.trim()) { setError("Vui lòng nhập nội dung bình luận."); return; }
    if (!user) {
      if (!guestName.trim()) { setError("Vui lòng nhập tên của bạn."); return; }
      if (!guestEmail.trim()) { setError("Vui lòng nhập email của bạn."); return; }
    }
    startTransition(async () => {
      try {
        const saved = await postComment({
          entity_type: "poem",
          entity_id: poemId,
          content: content.trim(),
          guest_name: user ? undefined : guestName.trim(),
          guest_email: user ? undefined : guestEmail.trim(),
        });
        const newComment: CommentItem = {
          id: saved.id,
          content: saved.content,
          author: user
            ? { id: user.id, display_name: user.display_name }
            : { display_name: guestName.trim(), is_guest: true },
          created_at: new Date().toISOString(),
          replies: [],
        };
        setComments((prev) => [newComment, ...prev]);
        setTotal((t) => t + 1);
        setContent(""); setGuestName(""); setGuestEmail("");
        setSuccess("Bình luận của bạn đã được đăng!");
      } catch {
        setError("Đăng bình luận thất bại. Vui lòng thử lại.");
      }
    });
  }

  // ── reply submit — appends to the correct parent in tree ──
  const handleSubmitReply = useCallback(async (
    parentId: number,
    replyContent: string,
    gName?: string,
    gEmail?: string,
  ) => {
    const saved = await postComment({
      entity_type: "poem",
      entity_id: poemId,
      parent_id: parentId,
      content: replyContent,
      guest_name: user ? undefined : gName,
      guest_email: user ? undefined : gEmail,
    });
    const newReply: CommentItem = {
      id: saved.id,
      content: saved.content,
      author: user
        ? { id: user.id, display_name: user.display_name }
        : { display_name: gName ?? "Ẩn danh", is_guest: true },
      created_at: new Date().toISOString(),
      replies: [],
    };

    // Recursively append reply to the right parent
    function addReplyToTree(list: CommentItem[]): CommentItem[] {
      return list.map((c) => {
        if (c.id === parentId) return { ...c, replies: [...c.replies, newReply] };
        if (c.replies.length) return { ...c, replies: addReplyToTree(c.replies) };
        return c;
      });
    }
    setComments((prev) => addReplyToTree(prev));
    setTotal((t) => t + 1);
  }, [poemId, user]);

  return (
    <section>
      <h2 className="text-label-caps mb-4" style={{ color: "var(--color-bamboo-green)" }}>
        BÌNH LUẬN {total > 0 && `(${total})`}
      </h2>
      <div className="card p-6" style={{ background: "var(--color-paper-pure)" }}>

        {/* ── Root comment form ── */}
        <form onSubmit={handleSubmit} className="mb-8">
          {!user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text" placeholder="Tên của bạn *"
                value={guestName} onChange={(e) => setGuestName(e.target.value)}
                className={INPUT_CLASS} style={INPUT_STYLE}
              />
              <input
                type="email" placeholder="Email của bạn *"
                value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)}
                className={INPUT_CLASS} style={INPUT_STYLE}
              />
            </div>
          )}

          {user && (
            <div className="flex items-center gap-2 mb-3">
              <Avatar name={user.display_name} size={28} />
              <span className="text-sm font-medium" style={{ fontFamily: "var(--font-inter)", color: "var(--fg)" }}>
                {user.display_name}
              </span>
            </div>
          )}

          <textarea
            rows={3}
            placeholder="Chia sẻ cảm nhận của bạn về bài thơ này..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm resize-none outline-none focus:border-[var(--color-lacquer-red)] transition-colors"
            style={INPUT_STYLE}
          />

          {error && <p className="text-xs mt-1" style={{ color: "var(--color-lacquer-red)", fontFamily: "var(--font-inter)" }}>{error}</p>}
          {success && <p className="text-xs mt-1" style={{ color: "var(--color-bamboo-green)", fontFamily: "var(--font-inter)" }}>{success}</p>}

          <div className="flex justify-end mt-2">
            <button type="submit" disabled={isPending} className="btn-primary px-4 py-2 text-sm disabled:opacity-60">
              {isPending ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </div>
        </form>

        {/* Divider */}
        {comments.length > 0 && (
          <hr style={{ borderColor: "var(--color-border-tan)", marginBottom: "1.25rem" }} />
        )}

        {/* ── Comment list ── */}
        {comments.length === 0 ? (
          <p className="text-sm text-center py-6" style={{ color: "var(--color-muted-gray)", fontFamily: "var(--font-inter)" }}>
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận!
          </p>
        ) : (
          <div className="space-y-6">
            {comments.map((c) => (
              <CommentBubble
                key={c.id}
                comment={c}
                replyingTo={replyingTo}
                onSetReplyingTo={setReplyingTo}
                onSubmitReply={handleSubmitReply}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
