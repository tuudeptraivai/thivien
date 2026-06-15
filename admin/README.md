# Thi Uyển · Trang quản trị (Admin)

Bảng điều khiển quản trị cho hệ thống **Thi Uyển**, xây bằng **Vite + React + TypeScript + Ant Design**. Giao tiếp với backend NestJS qua REST (`/v1`).

## Công nghệ
- Vite 5 + React 18 + TypeScript
- Ant Design 5 (bảng, form, modal)
- TanStack Query (data fetching + cache)
- React Router 6
- Axios (gắn JWT tự động)

## Cài đặt & chạy
```bash
cd admin
cp .env.example .env       # chỉnh VITE_API_URL nếu cần
npm install
npm run dev                # http://localhost:3002
```

Backend phải chạy ở `http://localhost:3001` (prefix `/v1`). Đăng nhập bằng tài khoản **admin** hoặc **moderator** (các vai trò khác bị từ chối).

```bash
npm run build              # build production → dist/
npm run preview            # xem thử bản build
```

## Kiến trúc

Toàn bộ trang quản lý dùng chung một **engine CRUD generic**:

- `src/resources/index.tsx` — khai báo từng module bằng một object `ResourceConfig`
  (endpoint list/create/update/remove, các trường, bộ lọc, render…).
- `src/components/ResourceTable.tsx` — bảng + tìm kiếm + lọc + phân trang + nút Thêm/Sửa/Xoá,
  dựng tự động từ config.
- `src/components/ResourceForm.tsx` — modal form Thêm/Sửa, tự nạp option khoá ngoại
  (tác giả, quốc gia, thời kỳ, thể loại…) theo `optionsResource`.
- Thêm một module mới = thêm một object vào `RESOURCES`.

## Các module quản lý

| Module | Endpoint | CRUD |
|---|---|---|
| Người dùng | `/users` | Thêm / Xem / Sửa / Xoá |
| Vai trò & quyền | (tĩnh) | Chỉ xem (RBAC theo trường `role`) |
| Tác giả | `/authors` | Thêm / Xem / Sửa / Xoá |
| Thơ | `/poems` | Thêm / Xem / Sửa / Xoá (mọi trạng thái) |
| Bản dịch | `/translations/member` | Xem / Sửa / Xoá (bản dịch thành viên) |
| Chủ đề diễn đàn | `/forum/topics` | Thêm / Xem / Sửa / Xoá + Ghim/Khoá |
| Bài đăng diễn đàn | `/forum/posts` | Xem / Sửa / Xoá |
| Bình luận | `/comments/admin` | Xem / Sửa (duyệt) / Xoá |
| Chú giải / Điển tích | `/annotations` | Thêm / Xem / Sửa / Xoá |
| Quốc gia | `/countries` | Thêm / Xem / Sửa / Xoá |
| Thời kỳ | `/eras` | Thêm / Xem / Sửa / Xoá |
| Thể loại thơ | `/poem-categories` | Thêm / Xem / Sửa / Xoá |

### Ghi chú / giới hạn
- **Vai trò & quyền**: schema không có bảng roles/permissions riêng — vai trò là trường `role`
  trên người dùng. Đổi vai trò qua mục *Người dùng*.
- **Bản dịch**: backend chỉ có endpoint danh sách cho bản dịch của *thành viên*; tạo mới bản dịch
  gắn với dị bản thơ nên thực hiện ở frontend. Sửa để trống "Nội dung" sẽ giữ nguyên bản gốc.
- **Bài đăng diễn đàn**: tạo bài trong ngữ cảnh chủ đề ở frontend; tại admin sửa/xoá.

> Các endpoint admin (`/users`, `/comments/admin`, `/annotations` list, `/forum/posts`, sửa/xoá
> topic & post) được bổ sung ở backend trong cùng đợt phát triển này, bảo vệ bằng vai trò
> Admin/Moderator.
