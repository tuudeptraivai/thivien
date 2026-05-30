# Màn hình 10 — Thống Kê (Statistics Dashboard)

## Mô tả chức năng

Trang thống kê toàn diện của hệ thống: số lượng tác phẩm, tác giả, hoạt động cộng đồng theo thời gian. Kết hợp số liệu tĩnh và biểu đồ động. Phục vụ cả người dùng thường (thú vị) và quản trị viên (theo dõi tăng trưởng).

## URL: `/thong-ke`

## Các nhóm thống kê

| Nhóm | Nội dung |
|---|---|
| Tổng quan | Tổng thơ, tổng tác giả, quốc gia, lượt xem |
| Tác phẩm | Phân bố theo thể loại, quốc gia, thời đại |
| Hoạt động | Bài thêm mới theo tuần/tháng, bình luận mới |
| Cộng đồng | Thành viên mới, bài thơ thành viên, tương tác |
| Top lists | Top bài thơ / tác giả / chủ đề được xem nhiều nhất |

## Stitch Prompt

```
Design a beautiful Statistics & Analytics Dashboard page for "Thi Uyển" poetry library.

VISUAL STYLE: Data journalism meets literary elegance. Clean, number-forward, but still warm. Think The Pudding meets a library annual report.
COLORS: Clean white #FFFFFF or very light gray #F8F8F6 background for high data clarity. Lacquer red #8E2424 as primary chart color, bamboo green #2C5E43 as secondary, warm amber #C4862A as tertiary.

[PAGE HEADER — 48px padding]:
- H1 in Lora 36px: "Thống kê Thi Uyển"
- Subtitle: "Dữ liệu cập nhật theo thời gian thực"
- Date filter right-aligned: "7 ngày | 30 ngày | 1 năm | Toàn thời gian" pill tabs

[KPI CARDS ROW — 4 cards, equal width]:
Each card: white background, thin border, large number, label, trend indicator
- 📚 "112.381" — "Tổng tác phẩm" — ↑ +96 hôm nay (green)
- 👤 "5.284" — "Tác giả" — ↑ +3 tuần này
- 🌍 "111" — "Quốc gia" — unchanged
- 👁 "3.2M" — "Lượt xem tháng này" — ↑ +14% (green)

[CHARTS GRID — 2x2]:

TOP LEFT — Stacked Area Chart: "Tác phẩm thêm mới theo tháng (2024–2026)":
- X: Months, Y: poem count
- Two stacked areas: red = Classical, green = Member poems
- Clean, smooth curves, no grid clutter

TOP RIGHT — Donut Chart: "Phân bố theo Quốc gia":
- 5 slices with legend: VN 70% | CN 18% | Others 12%
- Center label: "112.381 bài"
- Each slice hover shows tooltip with exact count

BOTTOM LEFT — Horizontal Bar Chart: "Top 10 thể loại phổ biến":
- Bars: Lục bát (34.2k) | Đường luật (21.4k) | Thơ tự do (18.9k) ...
- Red bars, clean labels

BOTTOM RIGHT — Line Chart: "Hoạt động diễn đàn & Bình luận theo tuần":
- Red line: comments, Green line: forum replies
- Time axis: last 12 weeks

[TOP LISTS — 3 columns]:

Column 1 — "Top 10 bài thơ được xem nhiều nhất":
Ranked list: rank badge | poem title | view count bar

Column 2 — "Top 10 tác giả được đọc nhiều nhất":
Avatar + name + view count + country flag

Column 3 — "Thành viên đóng góp nhiều nhất":
Avatar + username + contribution count + join year

[ACTIVITY FEED — right sidebar on larger screens]:
"Hoạt động 24h qua":
- Scrolling list of events: "📝 NamNguyen đã thêm bài thơ 'Mưa chiều'" · "2 phút trước"

FEEL: Clean, number-forward, professional. But the parchment-adjacent color palette and Lora headings keep it from feeling like a cold SaaS dashboard. This is a library's annual report, not a startup metrics board.
```

## API calls

- `GET /statistics/summary` — KPI numbers
- `GET /statistics/poems-over-time?period=12months`
- `GET /statistics/by-country`
- `GET /statistics/by-category`
- `GET /statistics/top-poems?limit=10`
- `GET /statistics/top-authors?limit=10`
- `GET /statistics/activity-feed?limit=20`
