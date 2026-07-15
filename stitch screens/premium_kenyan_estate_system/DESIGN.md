---
name: Premium Kenyan Estate System
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#43474e'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#476083'
  primary: '#000613'
  on-primary: '#ffffff'
  primary-container: '#001f3f'
  on-primary-container: '#6f88ad'
  inverse-primary: '#afc8f0'
  secondary: '#006c4e'
  on-secondary: '#ffffff'
  secondary-container: '#97f5cc'
  on-secondary-container: '#007353'
  tertiary: '#050700'
  on-tertiary: '#ffffff'
  tertiary-container: '#1e2011'
  on-tertiary-container: '#878873'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#afc8f0'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2f486a'
  secondary-fixed: '#97f5cc'
  secondary-fixed-dim: '#7bd8b1'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#e4e4cc'
  tertiary-fixed-dim: '#c8c8b0'
  on-tertiary-fixed: '#1b1d0e'
  on-tertiary-fixed-variant: '#474836'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
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
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style
The design system is engineered for the high-end Kenyan real estate market, balancing the architectural stability of traditional prestige with the fluid, digital-first expectations of modern investors. The aesthetic is **Corporate Modern with a Minimalist Editorial edge**, emphasizing expansive white space and high-resolution property photography.

The emotional goal is to evoke "Quiet Confidence." By utilizing heavy photographic weight and a restrained UI, the properties remain the hero while the interface provides a silent, premium scaffolding. The style avoids excessive decoration, favoring precision and clarity to establish trust in significant financial transactions.

## Colors
The palette is rooted in a "Deep Navy" foundation to project institutional stability, essential for the Kenyan property market. "Emerald Green" is used strategically as a growth signal and luxury marker, primarily for success states, value indicators, and premium tags.

- **Primary (Deep Navy):** Used for navigation, headers, and high-importance interaction points.
- **Secondary (Emerald Green):** Used for "Available" statuses, CTAs related to investment, and accent flourishes.
- **Accent (Warm Beige):** Applied as a subtle background wash for section differentiation to soften the high-contrast professional tones.
- **Neutral (Slate/Grey):** A range of greys from `#1F2937` (Text) to `#F3F4F6` (Borders/Backgrounds) ensures a clean, breathable interface.

## Typography
This design system utilizes a tiered typographic approach. **Montserrat** provides a geometric, confident structure for headlines, reflecting modern architectural lines. **Inter** is used for all functional and body text to ensure maximum legibility at smaller sizes, particularly for technical property specifications and legal disclosures.

Large headlines (Display and Headline-LG) should utilize a slightly tighter letter-spacing to maintain a "locked-in" premium feel. Body text should maintain a generous line height (1.5x minimum) to facilitate long-form reading of property descriptions on mobile devices.

## Layout & Spacing
The layout follows a **Fluid Grid** model with high-density margins. 
- **Desktop:** 12-column grid with 24px gutters and 80px side margins.
- **Tablet:** 8-column grid with 20px gutters and 40px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

A consistent 8px spatial system (4px, 8px, 16px, 24px, 40px, 64px) governs all padding and margins. Vertical rhythm is prioritized, with large `xl` (64px) spacing used to separate major property sections, creating a "gallery" feel where each piece of content has room to breathe.

## Elevation & Depth
This design system uses **Ambient Shadows** to create a sense of physical layering without looking "heavy." Shadows are extremely diffused, using a Deep Navy tint at low opacity (3-5%) to avoid a "dirty" look on the Warm Beige backgrounds.

- **Level 1 (Cards):** 0px 4px 20px rgba(0, 31, 63, 0.05). Used for property listings.
- **Level 2 (Modals/Dropdowns):** 0px 10px 30px rgba(0, 31, 63, 0.08). Used for filter menus and contact forms.
- **Depth Metaphor:** Elements should appear to float slightly above a neutral base layer. Avoid heavy borders; use subtle 1px strokes in `#E5E7EB` instead.

## Shapes
The shape language is defined as **Rounded**, utilizing a base 8px radius for standard components. This softens the "corporate" nature of the Deep Navy color palette, making the brand feel more approachable and modern.

- **Standard (8px):** Input fields, small buttons, and nested elements.
- **Large (16px):** Property cards and image containers.
- **Extra Large (24px):** Section containers and featured property banners.
- **Full (Pill):** Used exclusively for status chips (e.g., "For Sale") and search bars.

## Components
- **Buttons:** 
  - *Primary:* Deep Navy background, white text. Bold, sans-serif, 8px radius. High-contrast for "Book Viewing" or "Inquire."
  - *Secondary:* Emerald Green background or outline. Used for secondary conversion points like "Save to Favorites."
- **Property Cards:** Feature a 16px radius. Images must have a subtle inner-overlay at the bottom to ensure white price text remains legible. 
- **Chips/Badges:** Pill-shaped. Use Emerald Green for "New Construction" and Deep Navy for "Premium Listing."
- **Input Fields:** 1px Slate-200 border, 8px radius. On focus, the border transitions to Deep Navy with a 2px soft outer glow.
- **Lists:** Clean, horizontal dividers (1px) with 16px of vertical padding. Use minimalist line icons (2px stroke weight) for amenities (bedrooms, bathrooms, sqft).
- **Dashboard Widgets:** Use the Level 1 Elevation and Warm Beige backgrounds to group related data points like "Market Trends" or "Portfolio Value."