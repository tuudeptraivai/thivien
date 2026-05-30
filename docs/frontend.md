# Đặc tả Giao diện & Prompt Stitch with Google (Frontend & UI/UX Spec)

Tài liệu này mô tả chi tiết kiến trúc Frontend, sơ đồ điều hướng trang (Navigation Flow), các tính năng tương tác của người dùng, và đặc biệt cung cấp các **Prompt Giao diện Chất lượng cao (High-Fidelity UI Prompts)** viết chi tiết bằng tiếng Anh (tối ưu hóa cho AI) để bạn sao chép trực tiếp vào **[Stitch with Google](https://stitch.withgoogle.com/)** nhằm tạo ra giao diện clone tuyệt mỹ, hiện đại bậc nhất.

---

## 1. Cấu trúc Trang & Sơ đồ Điều hướng (Routing & Structure)

Hệ thống Frontend sử dụng **Next.js (App Router)** với cấu trúc thư mục tối ưu cho SEO và tải trang tức thì:

```text
src/
├── app/
│   ├── (home)/page.tsx                 # Trang chủ (Lưới bài thơ, danh sách cập nhật, widget bên)
│   ├── search/page.tsx                 # Trang kết quả tìm kiếm nâng cao (Lọc đa tiêu chí)
│   ├── tac-gia/
│   │   ├── page.tsx                    # Danh bạ tác giả (Bộ lọc A-Z, Triều đại, Quốc gia)
│   │   └── [slug]/page.tsx             # Chi tiết tác giả (Tiểu sử, tác phẩm, bình luận)
│   ├── tho/
│   │   ├── page.tsx                    # Mục lục thể loại thơ, chuyên mục
│   │   └── [slug]/page.tsx             # Đọc thơ (Hán tự, phiên âm, dịch thơ song song, tra từ điển)
│   ├── sang-tac/
│   │   ├── page.tsx                    # Không gian sáng tác & Biên tập thơ thành viên
│   │   └── tro-ly/page.tsx             # Trợ lý gieo vần, đếm từ thơ Lục bát/Đường luật
│   ├── dien-dan/
│   │   ├── page.tsx                    # Trang chủ diễn đàn thảo luận
│   │   └── [topic-slug]/page.tsx       # Chi tiết chủ đề diễn đàn & trả lời bài viết
│   ├── ca-nhan/page.tsx                # Quản lý tủ thơ yêu thích, tuỳ chỉnh giao diện đọc
│   ├── layout.tsx                      # Layout chung chứa Header (Glassmorphic) & Footer văn hoá
│   └── globals.css                     # Cấu hình Token Design, Fonts, Tailwind/Vanilla CSS
```

---

## 2. Đặc tả các Màn hình Lõi & Prompts cho Stitch with Google

Mỗi màn hình được định nghĩa bằng: **Mô tả tính năng**, **Giải pháp UX đột phá**, và **Prompt dành riêng cho Stitch with Google**.

---

### Màn hình 1: Trang chủ (Home Page)

* **Mô tả**: Nơi đón người dùng với không gian thi ca thư thái. Có thanh tìm kiếm thông minh nổi bật, bài thơ nổi bật trong ngày (Featured Quote), và các widget nội dung cập nhật mới nhất.
* **Giải pháp UX đột phá**: Loại bỏ toàn bộ quảng cáo dày đặc như trang cũ. Thay vào đó là một lưới bất đối xứng (asymmetric grid) thanh thoát. Bài thơ của ngày được trình bày trên một thẻ giấy nghệ thuật lớn, chữ Serif bay bổng, tạo cảm giác thư giãn tức thì.

#### 📝 Prompt copy vào Stitch:
```text
Create a modern, premium homepage for a Vietnamese and Asian Poetry Library web application named "Thi Viện". 
Use an elegant, highly aesthetic "Modern East Asian Heritage" design language.

Color Palette: 
- Background: Warm parchment cream (#F7F4EB) mimicking traditional handmade paper texture.
- Cards: Sleek soft off-white (#FAF8F5) with very subtle shadows and smooth borders.
- Accent: Deep cinnabar red / lacquer red (#8E2424) for critical buttons, borders, and logo.
- Typography: Warm dark slate gray (#1E1E22) for content to ensure high readability.

Header:
- Sticky and glassmorphic navigation bar (frosted glass effect) with thin border.
- Elegant Serif brand logo "Thi Viện" on the left in deep red.
- Clean horizontal menu items on the right: "Authors", "Poems", "Member compositions", "Forums".
- A minimalist button "Sign In" with thin red outline.

Main Content Layout (2-column layout, 70% left, 30% right):
Left Column (Main Feed):
1. Hero Search Section: A large, centered, beautiful search input with a magnifying glass icon, a micro-badge saying "[Alt+3]", and clear placeholder text "Search 112,000+ poems, authors, and Chinese transcriptions...".
2. Featured Poem of the Day Card: A spacious, warm cream card with a gorgeous calligraphy style quote: "Thuyền chở trăng trôi nhớ bốn bề / Say bên lò rượu có chi hề...". Large elegant Serif font (Playfair Display or Lora), centered text, with the poem title and author Nguyễn Du beautifully aligned at the bottom.
3. Tabbed Grid Section: Modern tabs ("Recently Added Poems", "Featured Member Poetry", "Latest Announcements"). Under the active tab, display a clean 2x3 grid of cards. Each card contains a poem title (Serif font, hover effect lifts the card slightly), author name, country badge, and a snippet of the first two lines.

Right Column (Side Widgets):
1. Statistics Widget: Sleek minimalist card displaying quick statistics (112k+ works, 5.2k+ authors, 111 countries) using fine geometric graphs.
2. Anniversaries Widget: "Anniversaries Today" listing historical authors born/died on this date with beautiful portrait placeholder circles and elegant faded text.
3. New Authors Widget: Grid list of recently verified authors with their country flags.

Footer:
- Deep charcoal background with cream text, containing columns for legal policies, community forums, link to Sino-Vietnamese online dictionary, and a cultural signature design.

Ensure absolute premium typography (Lora for poems, Inter for UI controls), spacious layout (large paddings), smooth hover animations, and a subtle light/dark mode switch in the top header.
```

---

### Màn hình 2: Trang đọc thơ & So sánh Bản dịch (Poem Reader Page)

* **Mô tả**: Hiển thị chi tiết một bài thơ. Với Đường thi/thơ chữ Hán, màn hình này hiển thị đồng thời: Nguyên tác (Chữ Hán), Phiên âm, Dịch nghĩa và các bản Dịch thơ phong phú.
* **Giải pháp UX đột phá**: Cung cấp chế độ **"Split View" (Song song)** giúp người đọc có thể bật/tắt đối chiếu trực tiếp giữa Chữ Hán - Phiên âm - Dịch thơ bên cạnh nhau. Tích hợp từ điển popover khi rê chuột vào từng từ chữ Hán.
* **Thanh công cụ đọc thơ (Reader Toolbar)** cho phép chỉnh kích thước chữ, chọn font (Serif/Sans-serif), thay đổi màu nền giấy đọc (Sepia/Cream/Dark).

#### 📝 Prompt copy vào Stitch:
```text
Create a premium, high-fidelity article and reader page for a classic poem on the "Thi Viện" poetry website. 
The screen displays "Tống Tố Như đệ tự Phú Xuân kinh Bắc hoàn ngũ thủ kỳ 5" by author "Nguyễn Đề".

Color Palette: 
- Main background: Soft reading-optimized sepia/parchment color (#F4EFE6).
- Card container: Crisp pure paper color (#FCFBF9) with soft rounding.
- Text: Deep charcoal slate (#2A2A2E) for primary texts, warm gray for annotations.

Top Reader Control Panel:
- Floating minimalist toolbar with controls:
  - Font Size adjustments (A-, A+)
  - Font Style switcher (Serif - Lora vs Sans-Serif - Inter)
  - Color Theme switcher (Parchment, Sepia, Deep Slate Dark Mode)
  - Recitation Audio Player: Beautiful play button with circular progress and wave visualizer for "Ngâm thơ" (audio recitation).

Main Reader Layout (Split Comparison View):
- Split layout into two columns for easy dual-language reading.
- Left Column (Original & Transliteration):
  - Sub-header "1. Nguyên tác (Chữ Hán)" in traditional style.
  - Text in beautiful Han-zi characters (large, high-contrast, bold Chinese typeface): "慇懃千里送君旋...".
  - Below it: "2. Phiên âm" showing transliterated Vietnamese: "Ân cần thiên lý tống quân tuyền...". Hovering over any word highlights it with a delicate amber underline and opens a small tooltip showing its literal translation.
- Right Column (Poetic Translation):
  - Dropdown selector: "Translation by Lê Quang Trường (Lục bát)" with a gold verified star.
  - The poetic translation in elegant, highly readable italics Serif font with plenty of line spacing (line-height 2.0):
    "Ân cần ngàn dặm tiễn em về,
     Cây Bắc mây Nam thảm thiết ghê..."
  - Interactive pagination/accordion at the bottom to view "Alternative Translations" by other users.

Annotation & Dictionary Section (Below the Poem):
- A warm card titled "Annotations & Allusions" displaying keywords like "Quỳnh Hải", "Tố Như" with detailed, neat encyclopedic explanations in a two-column definition list.

Discussion & Comments Section:
- Beautiful nested comments section (recursive tree design) with a premium comment input box. Supports "Guest Comments" with minimalist inputs for name and email.

Make the design feel like an open physical poetry book, extremely spacious, clean, and highly focused on the reading experience.
```

---

### Màn hình 3: Chi tiết Tác giả & Danh mục (Author Profile Page)

* **Mô tả**: Trang hồ sơ của một nhà thơ (như Nguyễn Du, Lý Bạch, Xuân Diệu). Gồm ảnh chân dung, tiểu sử tóm tắt dạng danh thiếp, và bộ lọc phân loại toàn bộ tác phẩm của họ.
* **Giải pháp UX đột phá**: Thiết kế phần Header của tác giả cực kỳ sang trọng với banner phong cảnh mờ, khung chân dung bo góc tinh tế, và hệ thống tab trực quan để lọc nhanh tác phẩm theo thời kỳ, thể loại, hoặc lượt xem.

#### 📝 Prompt copy vào Stitch:
```text
Create a high-fidelity Author Profile page for the premium poetry site "Thi Viện", featuring the famous poet "Nguyễn Du".

Design aesthetic: Minimalist, clean grid, traditional touch, luxury literary review style.
Colors: Cream background (#F6F3EB), deep maroon accent (#7D1D1D), dark granite texts (#222225).

Top Author Banner Section:
- A subtle background banner with a blurred traditional landscape ink painting (shanshui style).
- Centered or left-aligned circular author portrait placeholder.
- Large, bold title: "Nguyễn Du (阮攸)" in a classy Serif font.
- Meta badges: "Vietnam (Country)", "Late Le / Early Nguyen Dynasty (Era)", "320 Poems", "Verified Profile" with a gold seal icon.
- A concise, beautifully styled biography summary block in Lora font with a "Read Full Bio" expanding button.

Main Profile Body Layout (Left Sidebar, Right Content Grid):
Left Sidebar:
- "Key Life Periods & Timeline": A neat vertical timeline showing key dates of Nguyễn Du's life and works (e.g., 1766: Birth, 1802: Imperial service, 1820: Passing).
- "Related Literary Groups": Tags linking to other poets of the same era.

Right Content Grid (Poem Portfolio):
- Filter and Search Bar: A dedicated input to "Search within Nguyễn Du's poems..." and a dropdown to select Category (e.g., Chữ Hán, Truyện Nôm, Lục bát).
- Tabs: "Most Popular", "All Works (A-Z)", "About & Criticisms".
- Under the tab: A list of poem cards. Each card has a clean layout:
  - Title in deep maroon color, which scales beautifully on hover.
  - A small excerpt of the poem (2 lines).
  - View count indicator and date added.
  - Type badge (e.g., "Thơ Nôm", "Đường luật").

Everything must have perfect alignments, massive whitespace for breathability, thin borders (#E8E2D5) instead of shadows, and clean elegant hover transitions.
```

---

### Màn hình 4: Không gian Sáng tác & Trợ lý gieo vần (Creative Workspace & Rhythm Helper)

* **Mô tả**: Trang công cụ dành cho các nhà thơ trẻ sáng tác trực tuyến. Gồm trình soạn thảo văn bản không xao lãng (Distraction-free Editor) tích hợp thanh trợ lý bên phải (Rhyme & Syllable Helper) gợi ý luật bằng-trắc và vần.
* **Giải pháp UX đột phá**: Khi người dùng gõ thơ Lục bát hoặc Đường luật, hệ thống AI sẽ tự động phân tích âm tiết, chỉ ra câu đang gõ bị sai luật bằng-trắc ở các âm tiết 2-4-6-8 bằng cảnh báo màu đỏ/xanh lá tinh tế, và gợi ý các từ hiệp vần phù hợp ở cột bên phải.

#### 📝 Prompt copy vào Stitch:
```text
Create a highly innovative and beautiful online writing workspace and interactive poem editor for poets on the "Thi Viện" website. 
The UI is divided into a writing area and an AI interactive sidebar.

Color Palette: 
- Background: Very clean, focused soft linen paper color (#FAF9F6).
- Editor canvas: Pure white sheet (#FFFFFF) with a delicate warm gold border.
- Sidebar: Pale sage green (#F0F4F1) for a calming, creative workspace vibe.

Layout (3-column setup):
Left Column (Document Navigation):
- List of user's active drafts ("Draft 1: Mưa mùa xuân", "Draft 2: Chiều vàng sông Hương").
- A big "+" button "Start New Poem" in deep green.

Middle Column (Distraction-Free Editor):
- The writing workspace itself. It features:
  - Input field for Title: "Mưa mùa xuân" (large Serif font).
  - Select dropdown for Style: "Lục bát (6-8 syllable)".
  - Main text area containing a poem in progress:
    "Mưa bay lất phất ngoài hiên [6 syllables]"
    "Giọt sương đọng lại buồn riêng nỗi niềm [8 syllables]"
  - Live syllable counters floating neatly at the end of each line (e.g., [6] in light gray, [8] in light green).
  - Clean floating text formatting popup (Bold, Italic, Center, Stanza break).

Right Column (AI Rhythm & Rhyme Helper Sidebar):
- Titled "AI Poetry Assistant" with a glowing small spark icon.
- Interactive Rhythm Map: Visualizes the rhythm law of the selected "Lục bát" form:
  - Shows bubbles for syllables: Bằng - Trắc - Bằng - Bằng...
  - Highlights a warning bubble in amber on the current line indicating a rhythm conflict (e.g., "Syllable 6 must be BẰNG tone").
- Rhyming Suggestion Box: Offers a list of rich, poetic Vietnamese words that rhyme with "hiên" (e.g., "yên", "thiền", "miền", "duyên", "niềm") when the user hovers over the word.
- Publish Button: A prominent, solid forest green button at the bottom of the sidebar "Publish to Community" next to a "Save Draft" button.

Ensure the workspace looks extremely clean, distraction-free, encouraging creativity with ample padding, rounded corners, and elegant typography.
```

---

---

### Màn hình 5: Tìm Kiếm Bài Thơ Nâng Cao (Advanced Poem Search)

* **Mô tả**: Trang lọc đa tiêu chí kết hợp full-text search hỗ trợ tiếng Việt có dấu và chữ Hán. Bộ lọc: Quốc gia, Thời đại, Thể loại, Ngôn ngữ, Loại thơ (chính thống/thành viên).
* **Giải pháp UX đột phá**: Sidebar bộ lọc sticky scroll độc lập với kết quả; highlight từ khóa tìm kiếm trực tiếp trong đoạn trích bài thơ với nền màu hổ phách.

#### 📝 Prompt copy vào Stitch:
Xem chi tiết tại [docs/screens/04-poem-search.md](./screens/04-poem-search.md)

---

### Màn hình 6: Chuyên Mục & Thể Loại (Topics & Categories)

* **Mô tả**: Trang khám phá nội dung theo chủ đề: Thể loại thơ (Lục bát, Đường luật), Chủ đề nội dung (Tình yêu, Thiên nhiên), Địa danh, Trường phái.
* **Giải pháp UX đột phá**: Mỗi nhóm chủ đề được trình bày theo kiểu editorial gallery khác nhau — horizontal scroll card cho thể loại, masonry grid cho chủ đề, chip bar cho địa danh.

#### 📝 Prompt copy vào Stitch:
Xem chi tiết tại [docs/screens/06-topics.md](./screens/06-topics.md)

---

### Màn hình 7: Diễn Đàn Văn Học (Forum)

* **Mô tả**: Diễn đàn cộng đồng thảo luận về thơ ca, dịch thuật, phân tích văn học. Gồm danh sách chủ đề và trang chi tiết chủ đề với bài viết phân cấp.
* **Giải pháp UX đột phá**: Thiết kế forum có chiều sâu văn học — không phải social feed. Quote-threading rõ ràng, embedded poem display trong bài viết, badge phân loại chủ đề.

#### 📝 Prompt copy vào Stitch:
Xem chi tiết tại [docs/screens/07-forum.md](./screens/07-forum.md)

---

### Màn hình 8: Thơ Thành Viên & Không Gian Sáng Tác

* **Mô tả**: Hai trang: (A) Gallery thơ tự sáng tác của thành viên (masonry layout), (B) Trình soạn thảo thơ 3 cột với trợ lý AI phân tích luật bằng-trắc và gợi ý gieo vần.
* **Giải pháp UX đột phá**: Real-time syllable counter trên mỗi dòng thơ; visual rhythm map trực quan; rhyme suggestion clickable chips; distraction-free editor ẩn mọi UI trừ poem canvas.

#### 📝 Prompt copy vào Stitch:
Xem chi tiết tại [docs/screens/08-member-poems.md](./screens/08-member-poems.md)

---

### Màn hình 9: Xác Thực (Login / Register)

* **Mô tả**: Split-screen design: panel trái trang trí với thư pháp và trích thơ, panel phải form đăng nhập/đăng ký tối giản.
* **Giải pháp UX đột phá**: Thay vì form login lạnh lẽo thông thường, trang này kết hợp nghệ thuật — người dùng được chào đón bằng một câu thơ trong khi đăng nhập.

#### 📝 Prompt copy vào Stitch:
Xem chi tiết tại [docs/screens/09-auth.md](./screens/09-auth.md)

---

### Màn hình 10: Thống Kê (Statistics Dashboard)

* **Mô tả**: Trang số liệu toàn hệ thống: KPI cards, biểu đồ phân bố thơ theo thời gian/quốc gia/thể loại, top lists tác phẩm và tác giả được xem nhiều.
* **Giải pháp UX đột phá**: Data visualization với màu sắc nhất quán theo design system; không dùng dashboard template lạnh lùng — áp dụng typography Lora cho headings để giữ hơi thở literary.

#### 📝 Prompt copy vào Stitch:
Xem chi tiết tại [docs/screens/10-statistics.md](./screens/10-statistics.md)

---

### Màn hình 11: Từ Điển Hán-Việt (Sino-Vietnamese Dictionary)

* **Mô tả**: Công cụ tra cứu chữ Hán độc lập và dưới dạng popover trong trang đọc thơ. Hỗ trợ tra theo chữ Hán, phiên âm HV, tiếng Việt, hoặc vẽ nét chữ.
* **Giải pháp UX đột phá**: Chữ Hán kết quả hiển thị cực lớn (72px) làm điểm nhấn; stroke order animation; popover mini xuất hiện khi hover từng chữ trong bài thơ chữ Hán.

#### 📝 Prompt copy vào Stitch:
Xem chi tiết tại [docs/screens/11-dictionary.md](./screens/11-dictionary.md)

---

## 3. Cách thức áp dụng vào Stitch with Google

1. Truy cập vào **[Stitch with Google](https://stitch.withgoogle.com/)**.
2. Tạo dự án mới hoặc chọn tạo component/screen.
3. Sao chép toàn bộ nội dung khối **Prompt** tương ứng của màn hình bạn muốn thiết kế vào khung mô tả của Stitch.
4. Bấm **Generate** để AI của Stitch dựng nên toàn bộ hệ thống giao diện mẫu (Mockup) với hệ màu, font chữ, bố cục lưới đúng chuẩn như tài liệu đặc tả.
5. Bạn có thể tiếp tục tinh chỉnh trực tiếp trên giao diện kéo thả của Stitch hoặc yêu cầu AI sửa đổi dựa trên các Design Tokens được cung cấp trong tài liệu [Thiết kế Tổng quan (overview.md)](file:///Users/hongtam/Downloads/d%E1%BB%B1%20%C3%A1n%20nh%E1%BB%8F%20m%E1%BB%9Bi%20ai/khoahoc/tho/docs/overview.md).

---

*Tài liệu đặc tả Frontend này mở đường cho một cuộc cách mạng về trải nghiệm đọc thơ cổ, đưa tinh thần thi ca truyền thống thăng hoa trên nền tảng công nghệ đương đại.*
