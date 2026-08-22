---
name: Reliant Enterprise
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0058be'
  on-secondary: '#ffffff'
  secondary-container: '#2170e4'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#00201d'
  on-tertiary-container: '#0c9488'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#d8e2ff'
  secondary-fixed-dim: '#adc6ff'
  on-secondary-fixed: '#001a42'
  on-secondary-fixed-variant: '#004395'
  tertiary-fixed: '#89f5e7'
  tertiary-fixed-dim: '#6bd8cb'
  on-tertiary-fixed: '#00201d'
  on-tertiary-fixed-variant: '#005049'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

This design system is built for high-stakes B2B environments where clarity, efficiency, and reliability are paramount. The aesthetic follows a **Corporate Modern** direction—blending the precision of a systematic utility with a refined, contemporary finish. 

The visual language emphasizes a "data-first" philosophy. It utilizes generous white space to reduce cognitive load in complex workflows and employs a structured hierarchy to guide users through dense information. The interface should feel architectural and stable, evoking an emotional response of professional confidence and effortless scalability.

## Colors

The palette is anchored by **Deep Navy** (Primary) to establish authority and trust. **Professional Blue** (Secondary) is reserved for primary actions and interactive states, ensuring high visibility without visual fatigue. **Vibrant Teal** (Tertiary) serves as a strategic accent for success states, data highlights, or new feature callouts.

- **Backgrounds:** Use a pure white (#FFFFFF) for the primary content area to maximize contrast. Use a subtle off-white (#F8FAFC) for sidebars and background grounding.
- **Typography:** Deep Slate (#1E293B) for headings; Slate (#475569) for body text to maintain readability while softening the visual punch.
- **Borders:** Low-contrast Slate (#E2E8F0) to define structure without cluttering the interface.

## Typography

The design system utilizes **Inter** across all levels for its exceptional legibility and neutral, systematic tone. 

- **Hierarchy:** Use `display-lg` sparingly for dashboard overviews. `headline-sm` and `label-md` are the workhorses for data tables and form headers.
- **Data Tables:** Use `body-sm` for tabular data to maximize information density while maintaining vertical rhythm.
- **Weight:** Stick to 400 (Regular) for long-form reading and 600 (Semi-bold) for interactive elements and headings to create a clear "scan-path" for the user.

## Layout & Spacing

This design system employs a **12-column fluid grid** for desktop and a **4-column grid** for mobile. The layout philosophy is centered on "contained-fluidity"—content is housed within logical containers that expand to a max-width of 1440px to prevent excessive line lengths.

- **Spacing Rhythm:** An 8px base unit drives all spatial decisions. 
- **Vertical Spacing:** Use `lg` (24px) between distinct sections and `md` (16px) between related elements within a card.
- **Desktop:** Sidebars are fixed at 280px, with the main content area utilizing fluid percentages.
- **Mobile:** Margins shrink to 16px, and all multi-column layouts stack vertically.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. This approach creates a sense of "physical sheets" of information without the heaviness of traditional skeuomorphism.

- **Level 0 (Base):** Background (#F8FAFC).
- **Level 1 (Surface):** Cards and main containers (#FFFFFF). These use a 1px border (#E2E8F0) and a very soft, diffused shadow: `0 1px 3px rgba(0,0,0,0.05)`.
- **Level 2 (Interaction):** Hovered states or active dropdowns. These increase shadow depth: `0 10px 15px -3px rgba(0,0,0,0.1)`.
- **Level 3 (Overlay):** Modals and dialogs. Use a backdrop blur (8px) on the layer beneath to maintain context while focusing attention.

## Shapes

The shape language is consistently **Rounded** (8px) to balance professional rigor with approachability. 

- **Small Components:** Checkboxes and small tags use `rounded-sm` (4px).
- **Standard Components:** Buttons, input fields, and standard cards use the base `rounded` (8px).
- **Large Containers:** Modals and feature banners use `rounded-lg` (16px) to signify a higher level in the visual hierarchy.
- **Exceptions:** Status indicators (pills) use a full radius for a distinct visual departure from functional buttons.

## Components

### Buttons
- **Primary:** Solid Deep Navy or Blue background with white text. Hover state shifts brightness by 10%.
- **Secondary:** Transparent background with a 1px border (#E2E8F0).
- **Tertiary:** Text-only for low-priority actions like "Cancel."

### Input Fields
- **Default:** 1px border (#E2E8F0) with `body-sm` text. 
- **Focus:** 2px border in Professional Blue with a subtle 2px glow (outline-offset).
- **Validation:** Error states use a soft red border (#EF4444) and supporting sub-text.

### Data Tables
- **Header:** Light gray background (#F8FAFC), `label-sm` text weight, and a subtle bottom border.
- **Rows:** Alternating "zebra" stripes are discouraged; use thin 1px borders between rows to maintain a clean aesthetic.

### Cards
- **Structure:** Always include a 16px or 24px internal padding. 
- **Headers:** Separated by a thin horizontal rule if the card contains multiple content types (e.g., a chart followed by a list).

### Chips & Badges
- **Status Badges:** Use low-saturation backgrounds with high-saturation text (e.g., Light Teal background with Deep Teal text) for "Success" or "Active" states.