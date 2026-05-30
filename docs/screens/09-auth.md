# Màn hình 09 — Xác Thực (Authentication — Login / Register)

## Mô tả chức năng

Các màn hình đăng nhập, đăng ký và quên mật khẩu. Giao diện tối giản, sang trọng, phù hợp với văn phong thư viện thơ. Hỗ trợ đăng nhập bằng email/mật khẩu và OAuth (Google).

## URL: `/dang-nhap` và `/dang-ky`

## Stitch Prompt — Login Page

```
Design a beautiful, minimalist Login page for "Thi Uyển" — a premium Vietnamese poetry library.

VISUAL STYLE: Elegant, literary, trustworthy. Like the entrance to a private reading library.

LAYOUT: Split screen — 50% left decorative, 50% right form.

LEFT PANEL (decorative, non-interactive):
- Background: Rich dark charcoal #1A1A1E or deep cinnabar red #5E1010 gradient
- Centered content:
  - Large "Thi Uyển" calligraphy-style logo in cream/gold
  - A beautiful poem verse in Lora italic, cream color, centered:
    "Đọc thơ như uống trà,
     mỗi chữ là một hớp thanh tịnh."
  - Below: small muted text "— Tản Đà, 1926"
  - Very subtle background: low-opacity ink-wash painting of bamboo or mountains

RIGHT PANEL (form):
- Background: Clean warm cream #F7F4EB
- Form container centered vertically (max-width 380px):
  - Logo repeat (small): "Thi Uyển" in red Lora — top of form
  - H2 in Lora 26px: "Chào mừng trở lại"
  - Subtitle in muted Inter: "Đăng nhập để lưu thơ yêu thích và tham gia cộng đồng"

  FORM FIELDS:
  - Email/Username input: clean input with floating label animation, red focus border
  - Password input: with show/hide eye icon toggle
  - "Ghi nhớ tôi" checkbox + "Quên mật khẩu?" right-aligned link in red

  SUBMIT: Full-width red button "Đăng nhập" in Inter semibold 16px, 48px height, smooth hover darken

  DIVIDER: "─── hoặc ───" in muted gray

  SOCIAL LOGIN:
  - Google OAuth button with Google icon, white background, thin border: "Tiếp tục với Google"

  FOOTER LINK: "Chưa có tài khoản? Đăng ký →" in small red text

FEEL: Classy, not corporate. Welcoming, not intimidating. The left panel art makes the login feel like entering a beautiful private library.
```

## Stitch Prompt — Register Page

```
Design the Register/Sign Up page for "Thi Uyển" poetry library.

Same split-screen layout as login but with:
LEFT PANEL: Different poem quote:
  "Thơ là sự thật,
   nhưng là sự thật đẹp hơn."
  — Chế Lan Viên

RIGHT PANEL — form fields:
- H2: "Tham gia cộng đồng Thi Uyển"
- Subtitle: "Miễn phí. Lưu thơ yêu thích, sáng tác và thảo luận cùng 2.479 thi nhân thành viên."
- Fields:
  - Tên hiển thị (display name)
  - Email
  - Mật khẩu (với strength meter — 4 bar indicator: Yếu/Trung bình/Mạnh/Rất mạnh)
  - Xác nhận mật khẩu
- Checkbox: "Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật" (links open modal)
- Submit: "Tạo tài khoản" red button
- Below: "Đã có tài khoản? Đăng nhập →"

PASSWORD STRENGTH METER visual:
- 4 segments, left-to-right filling:
  - 1 segment: red "Yếu"
  - 2 segments: orange "Trung bình"
  - 3 segments: yellow "Mạnh"
  - 4 segments: green "Rất mạnh"

FEEL: Warm invitation. The page should feel like being welcomed into a book club, not filling out a government form.
```

## API calls

- `POST /auth/register` — đăng ký
- `POST /auth/login` — đăng nhập
- `GET /auth/google` — redirect OAuth Google
- `POST /auth/forgot-password` — yêu cầu reset
- `POST /auth/reset-password?token=` — đặt lại mật khẩu
