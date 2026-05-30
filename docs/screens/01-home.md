# Màn hình 01 — Trang Chủ (Home Page)

## Mô tả chức năng

Trang đầu tiên người dùng thấy khi truy cập. Đây là cửa ngõ vào thư viện thơ với hơn 112.000 bài. Mục tiêu: tạo cảm giác văn chương, thư thái; đồng thời dẫn dắt người dùng nhanh nhất đến nội dung họ cần.

## Các thành phần UI

| Vùng | Thành phần | Hành động |
|---|---|---|
| Header | Logo + Nav + Dark mode toggle + Sign In | Sticky, glassmorphic |
| Hero | Search bar lớn | Tìm kiếm instant |
| Featured | Bài thơ/câu thơ nổi bật ngày hôm nay | Hover đổi bài |
| Feed chính | Tabs: Mới nhất / Đọc nhiều / Thành viên | Switch tab |
| Sidebar phải | Thống kê / Kỷ niệm ngày / Tác giả mới | Static widgets |
| Footer | Cột chính sách, forum, từ điển | Links |

## Luồng người dùng

1. Mở trang → thấy thanh tìm kiếm ngay lập tức
2. Gõ từ khóa → dropdown gợi ý tức thì (debounce 300ms)
3. Click bài thơ trong feed → chuyển sang màn hình 05-poem-detail
4. Click tên tác giả → màn hình 03-author-detail
5. Click tab chuyên mục → màn hình 06-topics

## Stitch Prompt

```
Design a stunning, premium homepage for "Thi Uyển" (Poetic Garden) — a modern Vietnamese and Classical Asian Poetry Library.

VISUAL LANGUAGE: "Modern East Asian Heritage" — the feeling of a luxury hand-stitched poetry anthology on washi paper, rendered in a crisp digital interface.

COLOR PALETTE:
- Page background: Warm parchment cream #F7F4EB (simulate aged rice paper texture via subtle grain)
- Card surfaces: Soft ivory #FAF8F5 with 1px border #E8E2D5
- Primary accent: Deep lacquer red #8E2424 (logo, CTAs, active states)
- Secondary accent: Bamboo green #2C5E43 (tags, status indicators)
- Body text: Dark charcoal #1E1E22
- Muted text: Warm gray #7A7165

TYPOGRAPHY:
- Brand name & poem titles: Lora (serif, elegant, literary)
- UI controls & labels: Inter (sans-serif, crisp)
- Poem excerpts: Lora italic, generous line-height 1.9

LAYOUT STRUCTURE (Full width, max 1280px centered):

[STICKY HEADER]:
- Frosted glass navbar (backdrop-blur: 12px, background: rgba(247,244,235,0.88))
- LEFT: Vertical calligraphy-inspired logo mark + "Thi Uyển" wordmark in Lora, lacquer red
- CENTER: Horizontal nav: "Tác giả" | "Thơ" | "Sáng tác" | "Diễn đàn"
- RIGHT: Search icon (magnifying glass) + Moon/Sun toggle + "Đăng nhập" ghost button

[HERO SECTION — full width, 120px vertical padding]:
- One line centered headline in Lora: "Thư viện thi ca Việt — 112.000 tác phẩm"
- Directly below: A large, pill-shaped search input (width: 680px, height: 56px)
  - Left icon: magnifying glass in muted red
  - Placeholder: "Tìm bài thơ, tác giả, câu thơ chữ Hán..."
  - Right: Keyboard shortcut badge "⌘K" in muted gray
- Below search: Three quick-filter chips: "Thơ Đường 🇨🇳" | "Thơ Nôm 🇻🇳" | "Thành viên ✍️"

[FEATURED POEM CARD — full width card, 48px all padding]:
- Label: "THI PHẨM NỔI BẬT HÔM NAY" in small caps, letterspaced, bamboo green
- Large Lora italic poem excerpt (3–4 lines), centered, font-size 24px, line-height 2.1:
  "Trăm năm trong cõi người ta,
   Chữ tài chữ mệnh khéo là ghét nhau..."
- Below: Author name "Nguyễn Du" in red link + poem title "Truyện Kiều" in gray
- RIGHT side of card: Subtle ink-wash landscape illustration (low opacity, decorative)

[MAIN CONTENT — 2 columns: 68% left, 28% right, 32px gap]:

LEFT — Tabbed Poem Feed:
- 3 tabs: "Mới thêm hôm nay" (active, underlined in red) | "Xem nhiều" | "Thơ thành viên"
- Under active tab: 2-column masonry grid of poem preview cards.
  Each card:
  - Title in Lora semibold, 17px, #1E1E22, hover → lacquer red
  - Author + Country flag emoji, 14px muted
  - 2-line excerpt in Lora italic, muted #5A5450
  - Bottom row: eye icon + view count | category badge (e.g., "Lục bát")
  - Hover: card lifts 3px with shadow transition ease-in-out 200ms

RIGHT — Sidebar Widgets (stacked, each a card):
Widget 1 — "Thống kê":
  - 3 stat rows with icon: 📚 112.381 tác phẩm | 👤 5.284 tác giả | 🌏 111 quốc gia
Widget 2 — "Kỷ niệm ngày này":
  - Title "Sinh nhật & Kỵ nhật hôm nay"
  - 3 list items: circular avatar placeholder + "Nguyễn Trãi (1380–1442)" + "Sinh ngày 18/5"
Widget 3 — "Tác giả mới":
  - 4-item list with avatar, name, country, poem count

[FOOTER — dark charcoal #1A1A1E, cream text]:
- 4 columns: About | Features | Community | Tools
- Bottom bar: copyright + "Hoạt động từ năm 2004"

INTERACTIONS:
- All cards: 200ms ease hover lift + shadow
- Tab switch: 150ms fade transition
- Dark mode: swap #F7F4EB ↔ #121214 background, cards #1E1E22, text #EAE3D2
- Smooth scroll entire page

Make the overall feel: literary, refined, spacious — NOT cluttered. No banner ads. Think "premium poetry magazine meets digital library."
```

## Ghi chú triển khai

- Hero search gọi API `GET /search?q=` với debounce 300ms
- Featured poem lấy từ `GET /poems?sort=featured&date=today`
- Feed tab "Mới thêm": `GET /poems?sort=newest&limit=12`
- Feed tab "Xem nhiều": `GET /poems?sort=views&limit=12`
- Sidebar widgets: static data + `GET /statistics/summary`
