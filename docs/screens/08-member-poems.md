# Màn hình 08 — Thơ Thành Viên & Không Gian Sáng Tác (Member Poems & Creative Studio)

## Mô tả chức năng

Hai màn hình liên quan: (A) trang công khai hiển thị bài thơ tự sáng tác của các thành viên, và (B) trang soạn thảo riêng tư để thành viên viết và xuất bản thơ, có trợ lý AI hỗ trợ gieo vần và kiểm tra luật thơ.

## URL: `/sang-tac` (danh sách) và `/sang-tac/viet` (soạn thảo)

---

## 8A — Trang Thơ Thành Viên (Member Poems Gallery)

### Stitch Prompt — Member Poems Gallery

```
Design a Member Poetry Gallery page for "Thi Uyển" — a space where community poets share original works.

VISUAL STYLE: Warmer, more personal than the classical library — this is a living creative community, not just an archive.
COLORS: Slightly warmer cream #F9F6EF background, ivory cards, bamboo green #2C5E43 as primary accent (represents growth/creativity), lacquer red for editorial picks.

[PAGE HEADER]:
- Left: H1 "Thơ Thành Viên" in Lora 32px + green "✍ Viết thơ mới" CTA button
- Filter row: Search | Sort (Mới nhất / Xem nhiều / Yêu thích) | Category | "Chỉ xem người tôi theo dõi" toggle

[FEATURED MEMBER POEM — top banner card]:
- Label: "THƠ THÀNH VIÊN NỔI BẬT TUẦN NÀY" in green small caps
- Poem excerpt, author info, view count

[POEM GRID — Masonry/Pinterest-style, 3 columns]:
Each card (variable height based on poem length):
- Author: avatar (40px circle) + display name + "Thành viên từ 2022"
- Poem title in Lora 18px semibold, hover → green
- Poem text preview (first 4–6 lines) in Lora italic
- Category badge: "Lục bát" | "Thơ tự do" | "Haiku"
- Interaction row: ❤ 124 | 💬 18 | 🔖 Lưu
- "Đọc tiếp →" green text link

FEEL: Creative, personal, community-driven. Like an Instagram for poetry, but with literary taste and classic typography.
```

---

## 8B — Trang Soạn Thảo Thơ (Creative Studio)

### Stitch Prompt — Creative Writing Studio

```
Create a highly innovative online Creative Writing Studio and AI-assisted poem editor for "Thi Uyển" website.

VISUAL STYLE: A distraction-free creative sanctuary. Clean, focused, encouraging. Like a high-end Markdown editor meets a poetry tutor.
COLORS: Linen paper workspace #FAF9F6, pure white editor canvas #FFFFFF with warm gold border, pale sage sidebar #F0F4F1 (calm and creative).

[THREE-COLUMN LAYOUT]:

LEFT COLUMN (220px) — Document Manager:
- Section "Bản nháp của tôi":
  - List: "📝 Mưa mùa xuân" · "📝 Chiều sông Hương" · "📝 Untitled #3"
  - Each: click to load, pencil icon to rename, trash icon to delete
- Large green "+ Bài thơ mới" button at bottom

MIDDLE COLUMN (flexible) — Distraction-Free Editor:
- Minimal top bar: poem status "● Đang soạn" | last saved "Lưu lúc 14:32"
- TITLE: Large input field "Tiêu đề bài thơ..." in Lora 28px, no border, just underline on focus
- STYLE SELECTOR: "Thể loại: [Lục bát ▾]" — options: Lục bát | Đường luật 7 chữ | Song thất | Tự do | Haiku
- MAIN EDITOR: Large textarea, Lora 17px, line-height 2.0
  Current poem:
  "Mưa bay lất phất ngoài hiên,
   Giọt sương đọng lại buồn riêng nỗi niềm."
  
  - Each line shows a floating syllable counter at line-end:
    "Mưa bay lất phất ngoài hiên" → [6] in gray badge (green when correct for Lục bát)
    "Giọt sương đọng lại buồn riêng nỗi niềm." → [8] in green badge
  - Line with rhythm error: amber left border indicator, no red — gentle, encouraging
  - Format toolbar (hover to reveal): B I — ¶ (stanza break) Center Align Quote

RIGHT COLUMN (260px) — AI Poetry Assistant Sidebar:
- Header: "✨ Trợ lý Thơ AI" with subtle gradient text
- RHYTHM MAP section:
  - Title: "Bản đồ Luật Bằng-Trắc — Lục bát"
  - Visual grid showing B (Bằng = circle outline) and T (Trắc = filled circle):
    Row 1 (6 chữ): ○ ● ○ ○ ● ○  with warning on position 5 amber
    Row 2 (8 chữ): ○ ● ○ ○ ● ○ ● ○
  - Warning message: "⚠ Tiếng 5 câu 1 cần là Bằng. Gợi ý: 'lất' → thay bằng 'nhẹ', 'bay', 'phất'"
- RHYME SUGGESTION section:
  - Title: "Vần của 'hiên':"
  - Word cloud / chips: "yên" · "thiền" · "miền" · "duyên" · "niềm" · "huyền"
  - Each chip: click → copies word to clipboard
- CHARACTER COUNT: 45/56 chữ | 2 khổ thơ
- BOTTOM ACTIONS:
  - "💾 Lưu nháp" green ghost button
  - "🚀 Xuất bản" solid bamboo green button

FEEL: Calm, focused, encouraging. A poet's favorite app. No noise, only the craft. Spacious canvas, gentle AI guidance that helps but never intrudes.
```

## API calls

- `GET /member-poems?sort=newest&page=1` — gallery
- `GET /member-poems/drafts` — my drafts (auth)
- `POST /member-poems` — publish new poem (auth)
- `PUT /member-poems/:id` — edit poem (auth)
- `DELETE /member-poems/:id` — delete draft (auth)
- `POST /member-poems/:id/like` — like poem (auth)
- `GET /ai/rhyme-suggest?word=hiên` — rhyme suggestion
- `POST /ai/rhythm-check` — check rhythm rule for a poem stanza
