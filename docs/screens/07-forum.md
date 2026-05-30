# Màn hình 07 — Diễn Đàn Văn Học (Forum)

## Mô tả chức năng

Diễn đàn thảo luận văn học cho cộng đồng yêu thơ. Người dùng có thể thảo luận về bài thơ, trao đổi kiến thức văn học cổ điển, góp ý dịch thuật, chia sẻ cảm nhận. Gồm 2 màn hình chính: danh sách chủ đề và chi tiết chủ đề.

## URL: `/dien-dan` và `/dien-dan/[topic-slug]`

## Các thành phần UI — Trang danh sách

| Vùng | Thành phần |
|---|---|
| Header | Tiêu đề + nút tạo chủ đề mới |
| Category tabs | Phân loại chủ đề (Thơ Việt / Đường thi / Dịch thuật / Chung) |
| Topic list | Danh sách chủ đề với metadata |
| Sidebar | Topics hot / Thành viên tích cực |

## Stitch Prompt — Forum List

```
Design a clean, intellectually warm Forum/Discussion page for "Thi Uyển" poetry library community.

VISUAL STYLE: A thoughtful online reading club — welcoming, organized, literary. Like a civilized digital salon.
COLORS: Parchment #F7F4EB background, ivory cards #FAF8F5, lacquer red #8E2424 accent, charcoal #1E1E22.

[PAGE HEADER — with ambient warmth]:
- Left: H1 "Diễn đàn Văn học" in Lora 32px
- Right: Green "✏ Tạo chủ đề mới" button (requires login)
- Subtitle: "Cùng nhau bình giải thơ ca, trao đổi dịch thuật và chia sẻ cảm nhận"

[CATEGORY TABS — horizontal, below header]:
"Tất cả" | "Thơ Việt" | "Đường thi & Tống từ" | "Dịch thuật" | "Nhận xét & Bình luận" | "Thông báo"
Active tab: red underline, bold

[TWO COLUMN LAYOUT: 70% left, 26% right]:

LEFT — Topic List:
Each topic row (thin card with left border):
- Left: User avatar circle (36px) 
- Center:
  - Topic title in Lora 17px semibold, hover → red link
  - First post preview: 1 line excerpt in muted italic
  - Meta row: "Bởi NguyenVanA · 📂 Đường thi · 💬 42 trả lời · 👁 1.204 lượt xem"
- Right:
  - Time of last reply: "2 giờ trước"
  - Last reply avatar (tiny, 28px)
- Special markers:
  - 📌 PINNED: red "Ghim" badge on pinned topics
  - 🔥 HOT: amber glow on topics with 50+ replies this week
  - 🔒 LOCKED: muted style, no reply button

Divider between rows: 1px #E8E2D5

RIGHT — Sidebar:
Widget 1 — "Chủ đề Sôi nổi":
- 5-item list of hot topics with 🔥 icon, title, reply count badge

Widget 2 — "Thành viên Tích cực tuần này":
- 4 avatar + name + contribution count list

Widget 3 — "Nội quy diễn đàn":
- Simple 4-rule list (polite, no spam, literary focus, Vietnamese/Chinese only)

[PAGINATION]: Standard bottom pagination

FEEL: Intellectually stimulating but approachable. This is where scholars and enthusiasts meet. Clean, no visual noise.
```

## Stitch Prompt — Forum Topic Detail

```
Design a Forum Topic Detail page (single discussion thread) for "Thi Uyển" poetry library forum.

Topic title example: "Phân tích bài thơ 'Tống Tố Như' của Nguyễn Đề — tình cảm anh em sâu sắc"

COLORS: Same warm parchment palette. Focus on readability.

[TOPIC HEADER — full width card]:
- Breadcrumb: Diễn đàn > Đường thi > Chủ đề này
- Title in Lora 28px: "Phân tích bài thơ 'Tống Tố Như' của Nguyễn Đề"
- Sub-row: Posted by "NguyenVanA" · "🏷 Đường thi" · "📅 20/05/2026" · "💬 42 trả lời"
- Action buttons: 📌 Ghim | 🔒 Khóa | 🚩 Báo cáo (shown based on role)

[ORIGINAL POST — distinct styling]:
- User info left panel (100px wide, fixed): 
  - Avatar 64px
  - Display name bold, "NguyenVanA"
  - Role badge: "Thành viên" in green pill
  - Join date: "Thành viên từ 2020"
- Right: Rich text post content in Lora 16px, line-height 1.9
  - May include an embedded poem quote (styled differently — indented, italic, sepia background)
- Bottom action row: 👍 32 | 💬 Trả lời | ✏ Sửa (if own post)

[REPLY LIST — stacked below, each with same layout]:
- Alternating very subtle row background tint for readability
- Quote/reply threading: replies to a specific post show a quoted preview in a gray box above
- "Xem thêm 20 trả lời" pagination button

[REPLY INPUT — bottom of page, fixed when scrolled to bottom]:
- Rich text editor (Bold, Italic, Quote, Link, Insert Poem)
- Username/avatar shown if logged in; name+email fields if guest
- "Gửi trả lời" red button

FEEL: A proper literary forum with gravitas — not a social media feed. Thoughtful, text-focused, readable.
```

## API calls

- `GET /forum/topics?category_id=&sort=latest&page=1`
- `GET /forum/topics/[slug]` — topic detail with posts
- `POST /forum/topics` — create topic (auth required)
- `POST /forum/posts?topic_id=` — reply (auth required)
