# Màn hình 11 — Từ Điển Hán Việt Tích Hợp (Sino-Vietnamese Dictionary)

## Mô tả chức năng

Công cụ tra cứu từ điển Hán-Việt trực tuyến. Hỗ trợ nhập chữ Hán, phiên âm Hán-Việt, hoặc tra nghĩa từ tiếng Việt. Tích hợp sâu với trang đọc thơ chữ Hán qua popover hover-to-lookup.

## URL: `/tu-dien`  
Cũng hoạt động như popover overlay trong `/tho/[slug]` khi hover chữ Hán

## Các chế độ tra cứu

| Chế độ | Input | Ví dụ |
|---|---|---|
| Hán tự → Nghĩa | Dán chữ Hán | "慇懃" |
| Phiên âm → Hán | Gõ âm Hán-Việt | "ân cần" |
| Việt → Hán-Việt | Gõ tiếng Việt | "ân cần" |
| Vẽ chữ Hán | Stroke input | Vẽ nét bằng chuột/touch |

## Stitch Prompt — Dictionary Full Page

```
Design a beautiful Sino-Vietnamese (Hán-Việt) Dictionary page for "Thi Uyển" poetry library.

VISUAL STYLE: Scholar's reference tool — precise, organized, elegant. Like a digitized version of Đào Duy Anh's famous Hán-Việt từ điển.
COLORS: Parchment background #F7F4EB, ivory result cards #FAF8F5, lacquer red for pronunciation highlights, charcoal text.

[PAGE HEADER]:
- H1 "Từ điển Hán-Việt" in Lora 32px
- Subtitle: "Tra nghĩa từ chữ Hán, tìm chữ Hán qua phiên âm Hán-Việt, hoặc vẽ chữ để nhận dạng"

[SEARCH INPUT — large, prominent]:
- A large search input (650px wide, centered, 56px height)
- Toggle tabs above/inside: "Nhập chữ Hán" | "Nhập phiên âm HV" | "Nhập tiếng Việt" | "✏ Vẽ chữ"
- Current mode: "Nhập chữ Hán" active
- Input value: "慇懃"
- Right side: language keyboard toggle (Traditional Chinese / Simplified)
- "Tra cứu" red button

[STROKE DRAWING PANEL — shows when "Vẽ chữ" mode active]:
- 300x300px canvas with grid lines (8x8 pale gray grid)
- "Vẽ nét chữ vào đây..." instruction text
- Below: "Xóa" and "Nhận dạng" buttons
- Right panel: suggested characters based on strokes drawn

[SEARCH RESULT — main card]:
For query "慇懃":

RESULT CARD (white, prominent border):
- Top row: The character(s) in HUGE font (Noto Serif CJK, 72px): "慇懃"
- Right side: stroke count badge "24 nét | 15 nét"
- PRONUNCIATION ROW: Red bold text "ÂN CẦN" with tone marks, then in smaller gray: "yīn qín (Mandarin)"
- DEFINITION BLOCK (formatted):
  ▪ Tính từ: Ân cần, chu đáo, tử tế, chăm chút.
  ▪ "Ân cần nghĩa là chăm lo, quan tâm một cách chu đáo, tỉ mỉ."
- EXAMPLE IN POETRY section:
  "Ân cần thiên lý tống quân tuyền" — bài thơ [Tống Tố Như] của Nguyễn Đề
  → Clickable link to the poem
- STROKE ORDER ANIMATION: Small animated GIF/SVG showing how to write each character stroke-by-stroke
- Radicals breakdown: "Thành phần: 忄(tâm) + 殷 (ân)"

[RELATED TERMS — below main result]:
"Từ liên quan":
- Grid of chips: "ân cần" | "ân huệ" | "ân nhân" | "ân sủng" | "ân tình"
- Click any chip → instant lookup

[RECENT LOOKUPS — sidebar]:
"Vừa tra cứu": 慇懃 | 瓊海 | 千里 | 南雲

FEEL: Scholarly but accessible. A tool a literature student would have open next to their Chinese poetry book. Fast, clean, precise. The large character display is the hero — everything else supports it.
```

## Stitch Prompt — Dictionary Popover (embedded in Poem Reader)

```
Design a compact, floating Dictionary Popover component for the Poem Reader page of "Thi Uyển".

This appears when user hovers or taps a Chinese character within the poem text.

POPOVER SPECS (280px wide, variable height, rounded corners, shadow):
- Trigger: hovering over character "慇" within the poem text
- Pointer/arrow: pointing up toward the character

POPOVER CONTENT:
- TOP: Character in large font "慇" (40px, Noto Serif CJK) — centered, lacquer red
- PRONUNCIATION: "Ân" in bold red, then "(yīn)" in muted gray
- DEFINITION: Short 1-2 line definition in Inter 13px:
  "Ân cần, chu đáo, chăm lo tận tình."
- DIVIDER LINE
- COMPOUND: "Trong bài thơ này: 慇懃 = ân cần"
- LINK: "Xem đầy đủ trong từ điển →" small red text link

ANIMATION: Fade in 150ms ease, fade out 100ms on mouse leave.
DARK MODE: Dark card #252528, cream text, red pronunciation.

FEEL: Instant, informative, non-intrusive. Disappears gracefully when not needed.
```

## API calls

- `GET /dictionary/lookup?q=慇懃&mode=hanzi` — tra chữ Hán
- `GET /dictionary/lookup?q=an+can&mode=phienam` — tra phiên âm
- `GET /dictionary/stroke-order?char=慇` — animation data
- `GET /annotations/lookup?keyword=慇懃` — tra trong kho điển tích thơ
