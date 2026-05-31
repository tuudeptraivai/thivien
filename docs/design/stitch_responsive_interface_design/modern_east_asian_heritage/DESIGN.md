---
name: Modern East Asian Heritage
colors:
  surface: '#fbf8fe'
  surface-dim: '#dcd9de'
  surface-bright: '#fbf8fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2f8'
  surface-container: '#f0edf2'
  surface-container-high: '#eae7ed'
  surface-container-highest: '#e4e1e7'
  on-surface: '#1b1b1f'
  on-surface-variant: '#574140'
  inverse-surface: '#303034'
  inverse-on-surface: '#f3f0f5'
  outline: '#8b716f'
  outline-variant: '#debfbd'
  surface-tint: '#a83734'
  primary: '#6e0a10'
  on-primary: '#ffffff'
  primary-container: '#8e2424'
  on-primary-container: '#ffa49d'
  inverse-primary: '#ffb3ad'
  secondary: '#36684c'
  on-secondary: '#ffffff'
  secondary-container: '#b8efcc'
  on-secondary-container: '#3c6e52'
  tertiary: '#003b43'
  on-tertiary: '#ffffff'
  tertiary-container: '#00545f'
  on-tertiary-container: '#87c6d3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad7'
  primary-fixed-dim: '#ffb3ad'
  on-primary-fixed: '#410004'
  on-primary-fixed-variant: '#871f20'
  secondary-fixed: '#b8efcc'
  secondary-fixed-dim: '#9dd3b0'
  on-secondary-fixed: '#002111'
  on-secondary-fixed-variant: '#1d5036'
  tertiary-fixed: '#adedfa'
  tertiary-fixed-dim: '#91d1dd'
  on-tertiary-fixed: '#001f24'
  on-tertiary-fixed-variant: '#004e59'
  background: '#fbf8fe'
  on-background: '#1b1b1f'
  surface-variant: '#e4e1e7'
  background-parchment: '#F7F4EB'
  surface-ivory: '#FAF8F5'
  border-tan: '#E8E2D5'
  muted-gray: '#7A7165'
  reading-sepia: '#F4EFE6'
  paper-pure: '#FCFBF9'
typography:
  display-lg:
    fontFamily: Lora
    fontSize: 38px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Lora
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Lora
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  poem-body:
    fontFamily: Lora
    fontSize: 22px
    fontWeight: '400'
    lineHeight: '2.2'
  body-lg:
    fontFamily: Lora
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  cjk-character:
    fontFamily: Noto Serif CJK
    fontSize: 22px
    fontWeight: '400'
    lineHeight: '2.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 32px
  margin-mobile: 16px
  margin-desktop: 48px
  section-padding: 80px
---

## Brand & Style

The design system is a "Modern East Asian Heritage" aesthetic, blending the tactile, scholarly atmosphere of a traditional poetry anthology with the precision of a high-end digital library. The brand personality is **literary, tranquil, and scholarly**, aiming to evoke a sense of "slow reading" and cultural reverence.

The target audience includes literature enthusiasts, researchers, and students who value clarity and gravitas. To achieve this, the design system utilizes a **Minimalist approach with Tactile/Skeuomorphic undertones**.

### Key Visual Principles
- **Parchment Texture:** Use a very subtle noise or grain overlay on background surfaces to simulate the organic feel of aged rice paper or washi.
- **Ink and Lacquer:** Visual accents draw from traditional materials—deep reds (lacquer), muted greens (bamboo), and charcoal (ink).
- **Spaciousness:** Generous white space (or "empty space") is essential to maintain a calm, unhurried reading experience.
- **Glassmorphism:** Applied sparingly to sticky headers to provide a modern, ethereal layer that floats above the historical content.

## Colors

The palette is rooted in organic, historical tones. 

- **Primary (Lacquer Red):** Used for brand identity, primary call-to-actions, and active states. It represents the seal (chop) on a scroll.
- **Secondary (Bamboo Green):** Used for status indicators, tags, and secondary decorative elements.
- **Neutral (Ink Charcoal):** The primary color for long-form reading, providing high legibility without the harshness of pure black.

**Surface Strategy:**
The "background-parchment" serves as the global canvas. "surface-ivory" is used for cards and interactive panels to provide a subtle lift against the background. For the dedicated reading experience, "reading-sepia" or "paper-pure" should be used to minimize eye strain.

**Dark Mode:**
When dark mode is active, the background should shift to a deep charcoal (#121214), with cards using a slightly lighter elevation (#1E1E22) and text moving to a soft cream (#EAE3D2).

## Typography

Typography is the core of this design system. We use a dual-font strategy:
1. **Lora (Serif):** The literary voice. Used for all poetry content, author names, and expressive headlines. It conveys elegance and tradition.
2. **Inter (Sans-serif):** The functional voice. Used for UI controls, navigation, metadata, and labels. It provides clarity and modern efficiency.

**Special Roles:**
- **Poem Content:** Use `poem-body` with a generous line-height (2.2) to allow the text to breathe. Classical Chinese characters must use a high-quality Serif CJK font for stroke authenticity.
- **Labels:** Small caps and increased letter spacing should be used for section headers (e.g., "THI PHẨM NỔI BẬT") to distinguish them from the literary content.
- **Mobile:** For screens smaller than 768px, `display-lg` should scale down to 32px and `headline-lg` to 28px.

## Layout & Spacing

This design system follows a **Fixed Grid** model centered on the screen with a maximum width of 1280px. 

**Layout Model:**
- **Desktop:** A 12-column grid. Main content typically spans 8 columns (left) with a 4-column sidebar (right). For reading-focused pages, a single centered column of 800px width is preferred.
- **Mobile:** A single-column fluid layout with 16px side margins. 

**Spacing Rhythm:**
- Use a **8px base unit** for all spacing.
- **Section Padding:** Use large vertical padding (80px - 120px) for Hero sections to emphasize the "Garden" (Uyển) metaphor of openness.
- **Gaps:** Maintain a consistent 32px gap between the main content and sidebar to prevent visual crowding.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and subtle physical metaphors rather than heavy shadows.

- **Surface Tiers:** The background (#F7F4EB) is the lowest level. Card surfaces (#FAF8F5) sit 1px above this.
- **Borders:** Use 1px solid borders (#E8E2D5) for structural definition instead of shadows where possible.
- **The "3px Lift":** Interactive cards should use a transition that lifts the element 3px vertically on hover, accompanied by a soft, diffused ambient shadow (color: #8E2424 at 10% opacity) to signify interaction without breaking the minimalist aesthetic.
- **Glassmorphism:** The sticky header uses a backdrop-blur (12px) with a semi-transparent parchment tint (88% opacity) to create a sense of depth while keeping the user grounded in the content.

## Shapes

The shape language is **Soft and Precise**. 

- **Corners:** Use 0.25rem (4px) as the standard radius for cards and containers. This creates a "refined paper" look—not as sharp as raw brutalism, but not as playful as rounded modernism.
- **Pill Shapes:** Search inputs and primary action buttons use full pill-rounding (999px) to provide a modern, friendly touchpoint within the classical layout.
- **Avatars:** Circular frames are used for author portraits to mimic traditional medallions or wax seals.

## Components

### Buttons
- **Primary:** Solid Lacquer Red (#8E2424) with white text. Pill-shaped.
- **Ghost/Outline:** 1px border of the text color. High-contrast on hover with a subtle background tint.
- **Action Chips:** Bamboo Green (#2C5E43) outlines for secondary filters or status indicators.

### Cards
- **Poem Preview:** Ivory background, 1px border. On hover, apply the 3px lift and change the title color to Lacquer Red.
- **Sidebar Widgets:** Minimalist, using spacing and light dividers instead of heavy containers.

### Input Fields
- **Search Bar:** Large, pill-shaped. Uses a 1px border that thickens slightly on focus. Placeholder text in Warm Gray. Includes a keyboard shortcut badge (e.g., ⌘K) in a subtle gray box.

### The Poem Reader
- **Split View:** Columns should be separated by a 40px gap with a subtle vertical divider. 
- **Interactive Characters:** For Hán/Nôm text, each character should have a hover state that triggers a small, ivory-colored tooltip containing the annotation.
- **Floating Toolbar:** A pill-shaped, glassmorphic bar that sits at the top center of the reading view, providing immediate access to display settings without distracting from the text.

### Navigation
- **Sticky Header:** Frosted glass effect. Navigation links in Inter, transitioning to Lacquer Red with a subtle underline on hover.