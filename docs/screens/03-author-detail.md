# Màn hình 03 — Hồ Sơ Tác Giả (Author Profile)

## Mô tả chức năng

Trang chi tiết của một tác giả/nhà thơ. Hiển thị tiểu sử, timeline cuộc đời, toàn bộ tác phẩm có thể lọc/tìm kiếm, và phần thảo luận về tác giả.

## URL: `/tac-gia/[slug]`  
Ví dụ: `/tac-gia/nguyen-du`

## Các thành phần UI

| Vùng | Thành phần | Hành động |
|---|---|---|
| Banner hero | Ảnh nền + chân dung + metadata tác giả | — |
| Tiểu sử | Expandable bio block | Read more |
| Timeline | Các mốc cuộc đời | — |
| Tab tác phẩm | Tìm kiếm + lọc trong tác phẩm + grid | Click → poem detail |
| Bình luận | Nested comments | Post comment |

## Luồng người dùng

```
/tac-gia/nguyen-du
  → Đọc tiểu sử → "Xem thêm" mở ra full bio
  → Duyệt tab "Tác phẩm" → lọc theo thể loại
  → Click bài thơ → /tho/[slug]
  → Tab "Thảo luận" → đọc / đăng bình luận
  → Nút "❤ Yêu thích" → bookmark tác giả (cần đăng nhập)
```

## Stitch Prompt

```
Create a beautiful, high-fidelity Author Profile page for "Thi Uyển" poetry library, showcasing the legendary Vietnamese poet "Nguyễn Du (阮攸)".

VISUAL STYLE: Minimalist luxury literary profile — think a Wikipedia-level informational depth wrapped in the aesthetics of a premium coffee table book.
COLORS: Parchment #F7F4EB, ivory cards #FAF8F5, deep maroon accent #7D1D1D, charcoal text #222225, border lines #E8E2D5.

[HERO BANNER — Full width, 260px height]:
- Background: A heavily blurred, low-opacity traditional shanshui ink painting (misty mountains and bamboo). Semi-transparent warm overlay.
- CONTENT centered/left-aligned:
  - Circular author portrait (100px, 3px maroon border, slight drop shadow)
  - Name: "Nguyễn Du" in Lora 38px semibold, white/cream
  - Chinese name in smaller muted text: "阮攸"
  - Meta badges row: 🇻🇳 Việt Nam | ⏳ 1766–1820 | 📜 275 tác phẩm | ✓ Xác minh
  - Bottom-right corner: "❤ 110 người yêu thích" + Bookmark button

[BIOGRAPHY BLOCK — white card with left red border accent]:
- Title: "Tiểu sử" in Lora 20px
- Rich text biography paragraph (first 3 lines visible), then "Xem thêm →" link in maroon that smoothly expands the full text.
- Inline highlighted mentions: when "Truyện Kiều" appears, it's a subtle link.

[TWO-COLUMN LAYOUT below bio (65% right, 30% left sidebar)]:

LEFT SIDEBAR:
1. Life Timeline Card:
   - Vertical timeline with dot markers in maroon:
   - 1766: Sinh tại Nghi Xuân, Hà Tĩnh
   - 1783: Đậu Tam trường (Tú tài)
   - 1802: Phục vụ triều Nguyễn
   - 1813: Đi sứ sang Trung Quốc
   - 1820: Mất tại Huế
2. Related Tags Card:
   - "Văn học trung đại" | "Chữ Nôm" | "Đường luật" — clickable pill tags

RIGHT CONTENT — Poem Portfolio:
- Filter row inside this panel:
  - Search: "Tìm trong tác phẩm của Nguyễn Du..."
  - Dropdown: "Thể loại: Tất cả ▾" (Chữ Hán | Thơ Nôm | Lục bát | Song thất)
  - Sort: "Xem nhiều nhất ▾"
- Tabs: "Tất cả (275)" | "Nổi bật" | "Theo tập thơ" | "Thảo luận"

Under "Tất cả" tab — List view (not grid):
Each poem row:
- Poem title in Lora 17px maroon, clickable
- 2-line excerpt in Lora italic muted
- Right side: category badge + view count + date added
- Subtle hover: left border animates to maroon, row background shifts to ivory

Under "Theo tập thơ" tab:
- Accordion sections for each collection:
  - "📗 Thanh Hiên thi tập (78 bài)" — click to expand poem list
  - "📗 Nam trung tạp ngâm (40 bài)"
  - "📗 Bắc hành tạp lục (132 bài)"
  - "📕 Truyện Kiều (22 đoạn)"

[COMMENTS SECTION — full width below]:
- Title: "Thảo luận về Nguyễn Du"
- Comment input: guest-friendly (name + email fields for non-logged-in), rich textarea
- Comment tree: nested, indented replies, user avatar circles, timestamps
- Pagination for comments: "Xem thêm 42 bình luận..."

FEEL: A respectful, scholarly profile page that treats the poet with gravitas. Spacious, never cramped. Beautiful typography throughout.
```

## API calls

- `GET /authors/nguyen-du` — full profile
- `GET /poems?author_id=101&page=1&limit=20&category_id=&sort=views`
- `GET /comments?entity_type=author&entity_id=101`
- `POST /comments` — post comment
