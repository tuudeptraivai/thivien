# Màn hình 02 — Danh Bạ Tác Giả (Author Directory)

## Mô tả chức năng

Trang liệt kê toàn bộ tác giả trong hệ thống (5.284+ tác giả). Cho phép duyệt, lọc và tìm kiếm theo tên, quốc gia, thời đại. Đây là trang phân loại quan trọng thứ hai sau trang chủ.

## URL: `/tac-gia`

## Các thành phần UI

| Vùng | Thành phần | Hành động |
|---|---|---|
| Filter bar | Search + Quốc gia dropdown + Thời đại dropdown + Xác minh toggle | Lọc real-time |
| A-Z Index | 29 chữ cái tiếng Việt dạng thanh ngang | Jump to letter |
| Grid tác giả | Card mỗi tác giả | Click → author detail |
| Pagination | Phân trang | Chuyển trang |

## Luồng người dùng

```
Vào /tac-gia
  → Duyệt grid mặc định (sắp xếp theo A-Z)
  → Lọc theo Quốc gia: Việt Nam / Trung Quốc / Pháp / Nga...
  → Lọc theo Thời đại: Đường / Tống / Trung đại / Hiện đại...
  → Click tên tác giả → /tac-gia/[slug]
```

## Stitch Prompt

```
Design a premium Author Directory page for "Thi Uyển" poetry library.

COLOR PALETTE: Same as homepage — parchment #F7F4EB background, ivory cards #FAF8F5, lacquer red #8E2424 accents, charcoal text #1E1E22.

TYPOGRAPHY: Lora for author names, Inter for filter controls and metadata.

PAGE STRUCTURE (max-width 1280px):

[PAGE HEADER — 60px padding top/bottom]:
- Breadcrumb: Trang chủ > Tác giả
- H1 in Lora 36px: "Thư viện Tác giả"
- Subtitle in Inter muted: "5.284 tác giả từ 111 quốc gia"

[FILTER BAR — sticky on scroll, glass background]:
A horizontal row of filter controls:
1. Search input (280px wide): "Tìm tên tác giả..." with magnifying glass icon
2. Dropdown "Quốc gia": Vietnam 🇻🇳 | China 🇨🇳 | France 🇫🇷 | Russia 🇷🇺 | All
3. Dropdown "Thời đại": Đường triều | Tống triều | Trung đại VN | Hiện đại | Tất cả
4. Toggle chip: "Chỉ tác giả đã xác minh ✓" (when active: bamboo green background)
5. Right-aligned: Sort button "Sắp xếp: A-Z ▾"

[ALPHABET INDEX BAR]:
- A row of clickable letter anchors: A | B | C | D | Đ | E | G | H | I | K | L | M | N | O | P | Q | R | S | T | U | V | X | Y
- Active letter: lacquer red underline
- Smooth scroll to matching author section

[AUTHOR GRID — 4 columns, 20px gap]:
Each author card:
- TOP: Circular avatar (64px) — author portrait or initials-based placeholder in warm gradient
- Country flag emoji (16px) absolute top-right of card
- Author name in Lora semibold 18px, centered, hover → lacquer red
- Era badge: "Đường triều" in small bamboo-green pill
- Stat row: "324 tác phẩm" | ✓ badge if verified
- Hover: 3px lift + subtle shadow + red name transition

[GROUP BY LETTER]:
- Each letter section has a subtle separator: Large faded letter "N" (opacity 0.06, font-size 80px) behind the first author card of that letter group

[PAGINATION]:
- Clean row of page numbers centered: ← 1 2 3 ... 265 →
- Items per page selector: 20 | 40 | 60

RESPONSIVE: 4-col → 3-col → 2-col → 1-col as screen shrinks.

FEEL: A well-organized literary encyclopedia — clean, browsable, respectful of the material. Like the index section of a beautiful hardcover anthology.
```

## API calls

- `GET /authors?page=1&limit=40&sort=asc&search=&country_id=&era_id=`
- `GET /countries` — populate dropdown
- `GET /eras` — populate dropdown
