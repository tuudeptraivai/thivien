# Màn hình 05 — Đọc Thơ Chi Tiết (Poem Reader)

## Mô tả chức năng

Trang đọc một bài thơ cụ thể — màn hình quan trọng nhất của toàn bộ ứng dụng. Với thơ chữ Hán/Nôm: hiển thị nguyên tác + phiên âm + dịch nghĩa + các bản dịch thơ song song. Tích hợp từ điển popover, công cụ đọc tùy chỉnh và bình luận.

## URL: `/tho/[slug]`  
Ví dụ: `/tho/tuong-tu-nguyen-binh`

## Các thành phần UI

| Vùng | Thành phần | Hành động |
|---|---|---|
| Reader toolbar | Font size / Font family / Theme / Audio | Tùy chỉnh đọc |
| Nội dung thơ | Split view: Hán tự / Phiên âm / Dịch thơ | Hover từ → popup |
| Bản dịch | Accordion các bản dịch khác nhau | Chọn bản dịch |
| Chú thích | Điển tích, từ khó | — |
| Điều hướng | Bài trước / Bài sau cùng tác giả | Navigate |
| Bình luận | Nested comments | Post comment |

## Chế độ Split View

| Mode | Mô tả |
|---|---|
| Single | Chỉ hiện bản dịch thơ |
| Split 2 | Nguyên tác + Dịch thơ song song |
| Split 3 | Nguyên tác + Phiên âm + Dịch thơ |

## Stitch Prompt

```
Create the most beautiful and functional Poem Reading page ever designed for "Thi Uyển" poetry library. This is the heart of the app — where users spend the most time.

VISUAL STYLE: An open, illuminated manuscript — generous whitespace, beautiful serif type, no distractions. The poem is the star.
COLORS: Soft sepia reading background #F4EFE6, pure paper card #FCFBF9, deep maroon #7D1D1D for links and markers, charcoal #2A2A2E for text.

[FLOATING READER TOOLBAR — fixed top, thin glassmorphic bar]:
- A compact horizontal floating bar (not full-width, centered, ~600px wide, pill-shaped):
  - Font size: A− and A+ buttons
  - Font style toggle: "Serif (Lora)" ↔ "Sans (Inter)"
  - Theme: three circle icons — ☀️ Cream | 🌙 Dark | 📜 Sepia (currently active)
  - Audio: 🎵 Play button "Nghe ngâm thơ" — circular progress ring animates while playing
  - Share: 🔗 Copy link icon
  - Bookmark: 🔖 icon, hollow → solid red when bookmarked

[POEM HEADER — centered, 60px padding top]:
- Breadcrumb: Trang chủ > Tác giả > Nguyễn Đề > Bài thơ này
- Title in Lora 32px, centered: "Tống Tố Như đệ tự Phú Xuân kinh Bắc hoàn ngũ thủ kỳ 5"
- Author: "Nguyễn Đề (1753–1794)" — red linked name
- Meta row: 📂 Đường luật thất ngôn | 👁 14.205 lượt xem | 📅 Thêm: 15/03/2019
- Source note: "Xuất xứ: Thanh Hiên thi tập" in muted gray

[VIEW MODE SWITCHER — pill toggle]:
"📜 Đơn" | "📄📄 Song song 2" | "📄📄📄 Song song 3" — currently "Song song 2" active

[MAIN POEM DISPLAY — Split View, equal columns, 40px gap]:

LEFT COLUMN — "Nguyên tác Chữ Hán":
- Column header in small caps: "NGUYÊN TÁC (CHỮ HÁN)"
- The classical Chinese poem in a beautiful large Han font (Noto Serif CJK), font-size 22px, line-height 2.4:
  "慇懃千里送君旋，
   北樹南雲復各天。
   瓊海煙霞吟眼闊，
   ..."
- Each Chinese character is individually hoverable: hover reveals a small floating tooltip card showing:
  - The character in large font
  - Pronunciation in red: "ân"
  - Definition: "ân cần, chu đáo"
- Below Chinese: sub-section "PHIÊN ÂM" with Latin transliteration in Lora italic 17px

RIGHT COLUMN — "Dịch thơ":
- Column header: "BẢN DỊCH THƠ"
- A dropdown to select translation:
  "Lê Quang Trường — Thơ Đường luật ⭐" (default best translation, gold star)
  Other options in dropdown: "Bản dịch xuôi | Dịch giả Hoàng Long | ..."
- Translation text in Lora italic, 19px, line-height 2.2, generous left/right padding:
  "Ân cần ngàn dặm tiễn em về,
   Cây Bắc mây Nam thảm thiết ghê.
   Quỳnh Hải khói mây đầy ánh mắt,
   ..."
- Below translation: a muted "Dịch nghĩa (prose)" collapsible section

[ALTERNATIVE TRANSLATIONS — accordion below the poem]:
- Title: "Các bản dịch khác (3 bản)"
- Each collapsed accordion row: translator name + type + preview of first line
- Expand to see full translation
- "Đóng góp bản dịch mới +" button in bamboo green outline

[ANNOTATIONS — warm card below]:
- Title "Giải thích Điển tích & Từ khó"
- Definition list, 2-column:
  - "Tố Như" — "Tên tự của Nguyễn Du, em ruột của tác giả Nguyễn Đề."
  - "Quỳnh Hải" — "Địa danh cổ, nay thuộc tỉnh Thái Bình."
- Each keyword is highlighted in amber within the poem text above

[NAVIGATION ROW]:
← Bài trước: "Tống Tố Như... kỳ 4"     Bài tiếp →: "Kỳ 1 bài..."

[COMMENTS — full width below]:
- Header: "Thảo luận (28 bình luận)"
- Guest-friendly comment form: name + email + textarea + submit
- Nested comments with avatar, name, timestamp, reply button
- Thread depth max 3 levels, then "Xem thêm trả lời..."

FEEL: A tranquil reading sanctuary. Every element is in service of the poem. The UI fades away and the poetry takes center stage. Generous padding everywhere — this is NOT a cramped web page.
```

## API calls

- `GET /poems/[slug]` — full poem with versions, translations, annotations
- `GET /comments?entity_type=poem&entity_id=2048&page=1`
- `POST /comments` — post comment (guest or authenticated)
- `POST /bookmarks` — bookmark poem
- Tăng view count: server-side middleware khi hit endpoint `GET /poems/:slug`
