# Màn hình 06 — Chuyên Mục & Thể Loại (Topics & Categories)

## Mô tả chức năng

Trang mục lục phân loại thơ theo chủ đề và thể loại. Người dùng khám phá kho thơ theo ngữ cảnh: thơ tình, thơ quê hương, thơ mùa thu, thơ Đường, thơ Lục bát... Đây là con đường duyệt khám phá nội dung thứ ba bên cạnh tìm kiếm và tác giả.

## URL: `/chu-de`

## Các phân loại chính

| Nhóm | Ví dụ chủ đề |
|---|---|
| Thể loại thơ | Lục bát, Đường luật, Song thất lục bát, Từ khúc, Thơ tự do |
| Chủ đề nội dung | Tình yêu, Thiên nhiên, Quê hương, Chiến tranh, Xuân/Thu/Đông/Hạ |
| Vùng địa lý | Hà Nội, Sài Gòn, Huế, Sông Hương, sông Hồng |
| Đối tượng | Trẻ em, Sách giáo khoa, Thơ tặng mẹ |
| Quốc gia / Trường phái | Thơ Đường, Thơ Tống, Thơ Việt cổ, Thơ Nga |

## Stitch Prompt

```
Design a visually rich Topics & Categories page for "Thi Uyển" poetry library — a thematic gateway into the poetry collection.

VISUAL STYLE: A curator's gallery — each topic is a featured exhibit. Think editorial magazine spread meets library catalogue.
COLORS: Parchment #F7F4EB background, deep lacquer red #8E2424 key accent, bamboo green #2C5E43 secondary accent, warm charcoal text #1E1E22.

[PAGE HEADER — 60px padding]:
- Title in Lora 36px: "Khám Phá Theo Chủ Đề"
- Subtitle: "Duyệt qua 1.842 chuyên mục và thể loại thơ ca"

[FEATURED TOPIC SPOTLIGHT — full-width horizontal banner card]:
A large card (full width, 200px height) spotlighting a rotating featured theme.
- Left 60%: Large topic name in Lora 40px: "Thơ Mùa Thu"
  Subtitle: "1.204 bài thơ về mùa thu trong thơ Việt và Đường thi"
  CTA button: "Khám phá →" in red outline
- Right 40%: Decorative illustration — falling maple leaves, ink-wash autumn scenery, very low opacity over a warm orange-amber gradient

[TOPIC GROUPS — stacked sections]:

SECTION 1 — "Thể loại Thơ" (Poetry Forms):
- Title with expand/collapse toggle
- Horizontal scrollable row of large cards (280px × 160px each):
  Each card: 
  - Background: subtle gradient (e.g., warm sepia for classical forms, green for modern)
  - Topic name in Lora 22px white/cream
  - Poem count badge: "8.234 bài"
  - Bottom tag: "Cổ điển" or "Hiện đại"
  Cards: Lục bát | Đường luật thất ngôn | Song thất lục bát | Từ khúc Tống triều | Thơ tự do | Haikư

SECTION 2 — "Chủ đề Nội dung" (Content Themes):
- 4-column grid of medium cards (no image, typography-forward):
  Each card:
  - Large emoji icon centered (decorative): 💕 🌿 🏡 ⚔️ 🌸
  - Theme name in Lora 18px semibold: "Tình yêu", "Thiên nhiên", "Quê hương"...
  - Poem count: "23.451 bài"
  - Hover: red left border appears, card background shifts to slightly warmer ivory

SECTION 3 — "Theo Vùng Địa Lý" (By Place):
- Horizontal list of location chips with map pin icon:
  📍 Hà Nội (2.341) | 📍 Sài Gòn (1.892) | 📍 Huế (1.204) | 📍 Sông Hương (876) | + 34 địa danh khác

SECTION 4 — "Thơ Sách Giáo Khoa & Thiếu Nhi":
- Special callout card with book icon — warm green accent
- "Dành cho học sinh: 1.456 bài thơ trong chương trình phổ thông"
- CTA: "Xem danh sách →"

SECTION 5 — "Trường phái & Quốc gia":
- Flag-emoji + country name + poem count, displayed as a clean table/list:
  🇨🇳 Thơ Đường (4.521) | 🇨🇳 Thơ Tống (2.104) | 🇻🇳 Thơ Việt cổ (12.334) | 🇷🇺 Thơ Nga (2.341)

FEEL: Warm editorial. This is discovery — make each category feel like an invitation to explore. Bold typography, generous spacing, subtle illustration accents.
```

## API calls

- `GET /categories` — danh sách tất cả categories với poem_count
- `GET /topics` — topics nội dung
- `GET /poems?category_id=5&page=1` — khi click vào một category
