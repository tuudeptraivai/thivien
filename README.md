# Thi Viện Modern Clone - Tài liệu Đặc tả Hệ thống

Chào mừng bạn đến với bộ tài liệu đặc tả kiến trúc, cơ sở dữ liệu, API và giao diện người dùng phục vụ cho việc xây dựng phiên bản clone hiện đại của **Thi Viện (thivien.net)**.

Bộ tài liệu này được cấu trúc hoàn chỉnh nhằm giúp bạn có cái nhìn chi tiết nhất từ khâu thiết kế giao diện (Stitch prompts), xây dựng cơ sở dữ liệu PostgreSQL cho đến hiện thực hóa API phía backend và sơ đồ Next.js frontend.

---

## 📂 Bản đồ Thư mục Tài liệu (`docs/`)

Toàn bộ tài liệu đặc tả đã được khởi tạo trong thư mục `docs/` của dự án với các nội dung chi tiết sau:

1. 🌐 **[1. Tổng quan & Thiết kế (docs/overview.md)](file:///Users/hongtam/Downloads/d%E1%BB%B1%20%C3%A1n%20nh%E1%BB%8F%20m%E1%BB%9Bi%20ai/khoahoc/tho/docs/overview.md)**:
   * Tầm nhìn UX/UI mới: Ngôn ngữ thiết kế *Modern East Asian Heritage (Văn hoá Đông Á đương đại)*.
   * Hệ màu chủ đạo (Light/Dark/Sepia mode tokens), font chữ cổ điển (Serif Playfair/Lora) và hiện đại (Sans-serif Inter).
   * Sơ đồ kiến trúc tổng thể (Next.js + NestJS + PostgreSQL + Redis + Meilisearch).

2. 🗄️ **[2. Cơ sở Dữ liệu (docs/database.md)](file:///Users/hongtam/Downloads/d%E1%BB%B1%20%C3%A1n%20nh%E1%BB%8F%20m%E1%BB%9Bi%20ai/khoahoc/tho/docs/database.md)**:
   * Sơ đồ quan hệ thực thể ERD chi tiết.
   * Toàn bộ mã nguồn SQL khởi tạo bảng (DDL SQL) gồm: người dùng, quốc gia, thời kỳ, tác giả, tác phẩm thơ, các dị bản, bản dịch thơ, chú giải điển tích, bình luận phân cấp và diễn đàn.
   * Thiết lập chỉ mục tìm kiếm toàn văn nâng cao `tsvector` kèm `GIN Index` hỗ trợ tìm kiếm mờ cực nhanh (<5ms).

3. 🔌 **[3. Đặc tả CRUD API (docs/api.md)](file:///Users/hongtam/Downloads/d%E1%BB%B1%20%C3%A1n%20nh%E1%BB%8F%20m%E1%BB%9Bi%20ai/khoahoc/tho/docs/api.md)**:
   * Chuẩn thiết kế RESTful, cấu trúc gói tin request/response JSON và xử lý lỗi.
   * Chi tiết các API CRUD: Xác thực (Auth), Danh mục tác giả/tác phẩm, Chi tiết đọc thơ đa ngôn ngữ, Đóng góp bản dịch, Bình luận tự do (với tuỳ chọn bình luận khách vãng lai) và Tra cứu từ điển điển tích.

4. 🎨 **[4. Giao diện & Prompt Stitch (docs/frontend.md)](file:///Users/hongtam/Downloads/d%E1%BB%B1%20%C3%A1n%20nh%E1%BB%8F%20m%E1%BB%9Bi%20ai/khoahoc/tho/docs/frontend.md)**:
   * Sơ đồ cấu trúc cây thư mục Next.js App Router.
   * Các **Prompt Giao diện Đặc tả Chất lượng cao (High-Fidelity UI Prompts)** viết chi tiết bằng tiếng Anh tối ưu hóa cho AI. Bạn chỉ cần sao chép và dán trực tiếp vào **[Stitch with Google](https://stitch.withgoogle.com/)** để tạo ngay lập tức các bản vẽ giao diện tuyệt vời cho:
     * *Trang chủ (Home Page)*
     * *Trang đọc thơ & Đối chiếu Bản dịch (Poem Reader)*
     * *Trang tiểu sử Tác giả & Tác phẩm (Author Profile)*
     * *Không gian Sáng tác & Trợ lý gieo vần Lục bát (Poem Editor & Helper)*

---

## 🚀 Bước tiếp theo khuyên dùng

* **Dựng Giao diện mẫu**: Hãy sao chép các prompt trong [frontend.md](file:///Users/hongtam/Downloads/dự%20án%20nhỏ%20mới%20ai/khoahoc/tho/docs/frontend.md) dán vào **Stitch with Google** để duyệt và tinh chỉnh các mockup trực quan.
* **Tạo Cấu trúc DB**: Sử dụng mã SQL trong [database.md](file:///Users/hongtam/Downloads/dự%20án%20nhỏ%20mới%20ai/khoahoc/tho/docs/database.md) để khởi tạo các bảng trên cơ sở dữ liệu PostgreSQL của bạn.
* **Xây dựng API Backend**: Hiện thực hóa các API được định nghĩa trong [api.md](file:///Users/hongtam/Downloads/dự%20án%20nhỏ%20mới%20ai/khoahoc/tho/docs/api.md) bằng Node.js / NestJS hoặc Go.

*Chúc bạn xây dựng thành công kho tàng thi ca Thi Viện mới đầy chất thơ và nghệ thuật!*
