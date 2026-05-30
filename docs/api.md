# Tài liệu Đặc tả CRUD API (Backend API Specification)

Tài liệu này đặc tả chi tiết hệ thống giao tiếp giữa Client và Server của dự án **Thi Viện (Modern Clone)** thông qua chuẩn **RESTful API**.

---

## 1. Nguyên tắc thiết kế API chung

* **Base URL**: `https://api.thivien.modern/v1`
* **Định dạng dữ liệu**: Toàn bộ dữ liệu gửi đi (Request Body) và nhận về (Response Body) đều sử dụng định dạng **JSON** chuẩn UTF-8.
* **Xác thực người dùng**: Sử dụng cơ chế **JWT (JSON Web Token)**. Token sẽ được gửi kèm trong Header: `Authorization: Bearer <JWT_TOKEN>`.
* **Phân trang (Pagination)**: Áp dụng phân trang chuẩn sử dụng `page` và `limit` cho tất cả các API truy vấn danh sách.
* **Xử lý lỗi**: Trả về đúng mã HTTP Status Code cùng cấu trúc lỗi chuẩn hóa:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Thông điệp lỗi chi tiết bằng tiếng Việt để hiển thị lên UI",
      "details": {}
    }
  }
  ```

---

## 2. Các Endpoint Chi tiết

### 2.1. Authentication (Xác thực & Tài khoản)

#### [POST] `/auth/register` - Đăng ký tài khoản
* **Mô tả**: Tạo tài khoản thành viên mới.
* **Request Body**:
  ```json
  {
    "username": "hoangnam99",
    "email": "nam@thivien.vn",
    "password": "SecurePassword123",
    "display_name": "Hoàng Nam"
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "message": "Đăng ký tài khoản thành công",
    "data": {
      "user": {
        "id": 42,
        "username": "hoangnam99",
        "email": "nam@thivien.vn",
        "display_name": "Hoàng Nam",
        "role": "member",
        "created_at": "2026-05-30T12:00:00Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

#### [POST] `/auth/login` - Đăng nhập
* **Mô tả**: Xác thực tài khoản thành viên.
* **Request Body**:
  ```json
  {
    "username_or_email": "hoangnam99",
    "password": "SecurePassword123"
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 42,
        "username": "hoangnam99",
        "display_name": "Hoàng Nam",
        "role": "member",
        "preferences": {
          "vn_typing_mode": 3,
          "theme": "light",
          "font": "Lora"
        }
      },
      "token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

#### [GET] `/auth/me` - Lấy thông tin cá nhân hiện tại
* **Yêu cầu đăng nhập**: Có (Header `Authorization: Bearer <token>`)
* **Response (200 OK)**: Lấy về thông tin chi tiết kèm tuỳ chỉnh cá nhân để hiển thị ở góc màn hình hoặc trang cài đặt.

---

### 2.2. Authors API (Quản lý Tác giả / Dịch giả)

#### [GET] `/authors` - Truy vấn danh sách tác giả (Phân trang + Bộ lọc)
* **Tham số truy vấn (Query Params)**:
  * `page` (mặc định: 1)
  * `limit` (mặc định: 20)
  * `search`: Tìm kiếm tên tác giả
  * `country_id`: Lọc theo quốc gia
  * `era_id`: Lọc theo thời kỳ / triều đại
  * `verified`: `true` / `false` (Lọc tác giả chính thống vs Thành viên đăng ký làm tác giả tự sáng tác)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "meta": {
      "total_records": 5284,
      "total_pages": 265,
      "current_page": 1,
      "limit": 20
    },
    "data": [
      {
        "id": 101,
        "name": "Nguyễn Du",
        "slug": "nguyen-du",
        "birth_year": "1766",
        "death_year": "1820",
        "country": "Việt Nam",
        "era": "Trung đại - Hậu Lê / Nguyễn",
        "portrait_url": "https://api.thivien.modern/assets/nguyen-du.jpg",
        "poem_count": 320,
        "is_verified": true
      }
    ]
  }
  ```

#### [GET] `/authors/:slug` - Chi tiết tác giả
* **Response (200 OK)**: Trả về toàn bộ hồ sơ tiểu sử dạng Markdown, các thông tin triều đại, danh sách thơ tiêu biểu, và bình luận liên quan.

#### [POST] `/authors` - Thêm tác giả mới
* **Yêu cầu đăng nhập**: Có (Quyền: Poet, Admin, Moderator)
* **Request Body**:
  ```json
  {
    "name": "Lý Bạch",
    "real_name": "Lý Thái Bạch",
    "birth_year": "701",
    "death_year": "762",
    "country_id": 3,
    "era_id": 11,
    "biography": "# Lý Bạch \nLý Bạch là một trong những nhà thơ lớn nhất thời Đường...",
    "portrait_url": "https://url.to/portrait.jpg"
  }
  ```
* **Response (210 Created)**.

#### [PUT] `/authors/:id` - Cập nhật thông tin tác giả
* **Yêu cầu đăng nhập**: Có (Quyền: Admin, Moderator, hoặc người tạo ra bản ghi)
* **Response (200 OK)**.

#### [DELETE] `/authors/:id` - Xóa tác giả
* **Yêu cầu đăng nhập**: Có (Quyền: Admin)
* **Response (200 OK)**.

---

### 2.3. Poems API (Quản lý Bài thơ)

#### [GET] `/poems` - Danh sách bài thơ (Phân trang + Lọc + Tìm kiếm nâng cao)
* **Query Params**:
  * `page`, `limit`
  * `search`: Từ khóa tìm kiếm bài thơ
  * `author_id`: Lọc theo nhà thơ
  * `category_id`: Lọc theo thể loại (Lục bát, Đường luật...)
  * `era_id`: Lọc theo triều đại
  * `is_member_poem`: `true` / `false` (Phân biệt Thơ thành viên và Thơ sưu tầm cổ điển)
  * `sort`: `newest` (Mới nhất), `views` (Xem nhiều nhất), `abc` (Theo thứ tự chữ cái)
* **Response (200 OK)**: Trả về mảng bài thơ thu gọn kèm tên tác giả để hiển thị dạng lưới (Grid) hoặc danh sách ở Trang chủ.

#### [GET] `/poems/:slug` - Lấy nội dung chi tiết bài thơ (Đọc thơ)
* **Mô tả**: Đây là API quan trọng nhất. Trả về cấu trúc phân cấp gồm bài thơ gốc, các dị bản, phiên âm tiếng Việt (nếu là chữ Hán), dịch nghĩa, danh sách tất cả các bản dịch thơ liên quan kèm dịch giả, danh sách các từ khó/điển tích được chú thích tự động. *Hành động này cũng tự động tăng view_count của bài thơ lên 1.*
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 2048,
      "title": "Tống Tố Như đệ tự Phú Xuân kinh Bắc hoàn ngũ thủ kỳ 5",
      "slug": "tong-to-nhu-de-tu-phu-xuan-kinh-bac-hoan-ngu-thu-ky-5",
      "author": {
        "id": 105,
        "name": "Nguyễn Đề",
        "slug": "nguyen-de"
      },
      "category": {
        "id": 9,
        "name": "Thơ Đường luật"
      },
      "view_count": 14205,
      "source_info": "Thanh Hiên thi tập tham khảo",
      "is_member_poem": false,
      "versions": [
        {
          "id": 4012,
          "version_name": "Bản nguyên tác Chữ Hán",
          "is_primary": true,
          "content": "慇懃千里送君旋，\n北樹南雲復各天。\n瓊海煙霞吟眼闊...",
          "transcription": "Ân cần thiên lý tống quân tuyền,\nBắc thụ nam vân phục các thiên.\nQuỳnh Hải yên hà ngâm nhãn khoát...",
          "explanation": "Ân cần tiễn em về nơi xa ngàn dặm,\nAnh em như mây Nam cây Bắc mỗi người một phương..."
        }
      ],
      "translations": [
        {
          "id": 890,
          "translator": {
            "id": 201,
            "name": "Lê Quang Trường",
            "slug": "le-quang-truong"
          },
          "translation_title": "Tiễn em Tố Như từ kinh đô Phú Xuân về Bắc 5 bài kỳ 5",
          "content": "Ân cần ngàn dặm tiễn em về,\nCây Bắc mây Nam thảm thiết ghê...\nQuỳnh Hải khói mây đầy ánh mắt...",
          "translation_type": "Thơ Đường luật thất ngôn",
          "is_favorite": true
        }
      ],
      "annotations": [
        {
          "keyword": "Tố Như",
          "explanation": "Tức Nguyễn Du, tác giả Truyện Kiều, em ruột của Nguyễn Đề.",
          "type": "allusion"
        },
        {
          "keyword": "Quỳnh Hải",
          "explanation": "Tên vùng đất xưa thuộc tỉnh Thái Bình ngày nay.",
          "type": "location"
        }
      ]
    }
  }
  ```

#### [POST] `/poems` - Đăng bài thơ mới / Sáng tác bài thơ mới
* **Yêu cầu đăng nhập**: Có (Bất kỳ thành viên nào đều có quyền đăng thơ thành viên, Admin/Mod đăng thơ chính thống)
* **Request Body**: Gửi lên tiêu đề, danh mục, tác giả, cấu trúc các bản gốc, phiên âm, dịch nghĩa hoặc bản dịch đi kèm.
* **Response (201 Created)**.

#### [PUT] `/poems/:id` - Chỉnh sửa thông tin bài thơ
* **Yêu cầu đăng nhập**: Có (Quyền chỉnh sửa bài của chính mình hoặc quyền Admin/Mod)

#### [DELETE] `/poems/:id` - Xóa bài thơ
* **Response (200 OK)**.

---

### 2.4. Translations API (Quản lý Bản dịch thơ)

#### [POST] `/poems/:poem_id/versions/:version_id/translations` - Đóng góp bản dịch mới
* **Yêu cầu đăng nhập**: Có. Cho phép thành viên hoặc dịch giả gửi bản dịch thơ của riêng họ lên hệ thống cho một bài thơ cổ sẵn có.
* **Request Body**:
  ```json
  {
    "translator_name": "Lê Quang Trường", -- Hoặc tự động nhận theo user đăng nhập
    "translation_title": "Dịch thơ Tiễn em Tố Như",
    "content": "Lời bài dịch thơ tại đây...",
    "translation_type": "Lục bát"
  }
  ```

#### [PUT] `/translations/:id` - Sửa bản dịch
#### [DELETE] `/translations/:id` - Xóa bản dịch
#### [POST] `/translations/:id/favorite` - Đặt làm bản dịch yêu thích hàng đầu (Yêu cầu Admin/Moderator)

---

### 2.5. Comments API (Hệ thống Bình luận tự do & Hội thoại)

#### [GET] `/comments` - Lấy bình luận của một bài thơ hoặc tác giả (Dạng cây phân cấp)
* **Query Params**:
  * `entity_type`: `poem` hoặc `author`
  * `entity_id`: ID tương ứng
  * `page`, `limit`
* **Response (200 OK)**: Trả về danh sách bình luận đã định dạng lồng nhau (parent-child) hỗ trợ thảo luận sâu.

#### [POST] `/comments` - Đăng bình luận mới (Có tích hợp bình luận vãng lai không cần tài khoản)
* **Request Body**:
  ```json
  {
    "entity_type": "poem",
    "entity_id": 2048,
    "parent_id": null, -- ID của bình luận cha nếu là trả lời (Reply)
    "content": "Bài thơ này Nguyễn Đề viết tiễn em trai mình chứa chan tình cảm anh em cảm động quá.",
    // Nếu chưa đăng nhập, bắt buộc gửi 2 trường này:
    "guest_name": "Độc giả yêu thơ",
    "guest_email": "docgia@gmail.com"
  }
  ```
* **Response (210 Created)**.

---

### 2.6. Annotations & Dictionary API (Tra từ & Điển tích)

#### [GET] `/annotations/lookup` - Tra cứu từ điển Hán Việt trực tuyến / Điển cố thơ ca
* **Query Params**: `keyword` (VD: "châu", "quế", "tố như")
* **Response (200 OK)**: Trả về kết quả tìm thấy trong kho chú giải chung hoặc tích hợp API từ điển chữ Hán.
* **POST/PUT/DELETE `/annotations`**: Quản lý kho điển tích từ khóa dùng chung (Chỉ dành cho Admin/Mod).

---

*Hệ thống API CRUD này bao trùm toàn bộ nghiệp vụ lõi của dự án Thi Viện mới, đảm bảo tính phân quyền, khả năng xử lý bất đồng bộ và cung cấp trải nghiệm đọc-sáng tác tối ưu.*
