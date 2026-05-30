# Màn hình 04 — Tìm Kiếm Bài Thơ Nâng Cao (Advanced Poem Search)

## Mô tả chức năng

Trang tìm kiếm và lọc đa tiêu chí cho toàn bộ kho thơ 112.000+ bài. Người dùng có thể kết hợp nhiều bộ lọc đồng thời. Tích hợp full-text search hỗ trợ cả tiếng Việt có dấu và chữ Hán.

## URL: `/tim-kiem?q=&country=&era=&category=&sort=`

## Các thành phần UI

| Vùng | Thành phần | Hành động |
|---|---|---|
| Search bar lớn | Input + nút tìm | Submit search |
| Filter panel | Sidebar trái với nhiều bộ lọc | Apply filter |
| Results area | Danh sách bài thơ + sort controls | Click → poem |
| Empty state | Khi không có kết quả | Suggest alternatives |

## Các bộ lọc (Filters)

| Filter | Kiểu | Giá trị |
|---|---|---|
| Từ khóa | Text input | Tiêu đề / nội dung / tác giả |
| Quốc gia | Checkbox multi | Việt Nam / Trung Quốc / Nga / Pháp... |
| Thời đại | Checkbox multi | Đường / Tống / Trung đại / Hiện đại... |
| Thể loại thơ | Checkbox multi | Lục bát / Đường luật / Từ / Tự do... |
| Ngôn ngữ | Radio | Chữ Quốc ngữ / Chữ Hán / Chữ Nôm |
| Loại thơ | Radio | Chính thống / Thành viên / Tất cả |
| Sắp xếp | Select | Mới nhất / Xem nhiều / A-Z / Liên quan |

## Stitch Prompt

```
Design a polished Advanced Poetry Search Results page for "Thi Uyển" poetry library.

VISUAL STYLE: Clean, functional search experience with literary warmth. Like Google Scholar, but with the soul of a poetry anthology.
COLORS: Parchment #F7F4EB background, ivory panels #FAF8F5, lacquer red #8E2424 for search button and highlights, charcoal text #1E1E22.

[SEARCH BAR SECTION — Top of page, 80px padding]:
- Large search input (full width max 860px, centered) with current query "mưa" filled in
- Red search button "Tìm kiếm" on the right
- Below bar: search tips in small muted text: "Mẹo: Dùng + giữa các từ để tìm chính xác. Ví dụ: +mưa +xuân"
- Result count badge: "Tìm thấy 1.247 kết quả cho "mưa" — 0.04s"

[TWO COLUMN LAYOUT: 24% left filter panel, 72% right results]:

LEFT — Filter Panel (sticky, scrollable independently):
Title: "Bộ lọc" with a "Xóa tất cả" link in red on same row.

Filter Section 1 — Quốc gia:
- Checkbox list with country flags:
  ☑ 🇻🇳 Việt Nam (78.933)
  ☐ 🇨🇳 Trung Quốc (19.877)  
  ☐ 🇷🇺 Nga (2.341)
  ☐ 🇫🇷 Pháp (1.876)
  + "Xem thêm 8 quốc gia"

Filter Section 2 — Thời đại:
- Checkbox list:
  ☐ Đường triều (4.521)
  ☑ Tống triều (2.104)
  ☐ Trung đại Việt Nam (12.334)
  ☐ Hiện đại (34.567)

Filter Section 3 — Thể loại thơ:
- Checkbox list:
  ☐ Lục bát (8.234)
  ☐ Thất ngôn Đường luật (6.891)
  ☐ Từ / Từ khúc Tống (2.104)
  ☐ Thơ tự do (23.451)
  ☐ Song thất lục bát (1.234)

Filter Section 4 — Ngôn ngữ gốc:
- Radio buttons: ● Tất cả  ○ Chữ Quốc ngữ  ○ Chữ Hán  ○ Chữ Nôm

RIGHT — Results Area:
TOP BAR:
- Left: "1.247 bài thơ" in semibold
- Right: Sort dropdown "Liên quan nhất ▾" | Grid/List view toggle icons

RESULTS LIST — List view (default for search):
Each result row (card):
- Poem title in Lora 18px lacquer red, bold — keyword "mưa" highlighted in amber background
- Author: "Xuân Diệu" with country flag 🇻🇳 + era "Hiện đại"
- Excerpt (3 lines) in Lora italic — keyword highlighted wherever it appears in the excerpt
- Meta row: 📂 Thơ tự do | 👁 14.205 lượt xem | 📅 2024-03-15
- Right edge: small bookmark icon (hollow → filled on hover)
Separator between results: thin 1px #E8E2D5 line

EMPTY STATE (when no results):
- A gentle ink-drop illustration (decorative)
- Heading: "Không tìm thấy kết quả cho "xyz""
- Suggestions: "Thử tìm bằng cách khác:", list of similar search ideas
- "Hoặc dùng Google để tìm trong Thi Uyển:" → search-within-site link

[PAGINATION]:
Bottom center: ← Prev | 1 2 3 ... 63 | Next →

FEEL: Functional but warm. No sterile white — the parchment background keeps the literary mood even on a utilitarian search page. Results should feel like browsing a well-organized archive, not a database dump.
```

## API calls

- `GET /poems?search=mưa&country_id=2&era_id=&category_id=&lang=&sort=relevance&page=1&limit=20`
- Sử dụng Meilisearch / Elasticsearch cho full-text search nâng cao
- Highlight từ khóa: trả về `highlight.content` trong response search
