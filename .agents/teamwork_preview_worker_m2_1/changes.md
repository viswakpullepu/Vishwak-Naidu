# Changes Record — Milestone 2 Responsive Bug Fixes

## Date: August 5, 2026

### Modified Files:
1. `index.html`
2. `style.css`
3. `script.js`

---

### Detailed Modifications

#### 1. `index.html`
- **Navigation Links**: Added Experience navigation link (`<li><a href="#experience">Experience</a></li>`) to both desktop navigation (`<nav class="desktop-nav">`) and mobile drawer navigation (`.mobile-nav-menu`).
- **Experience & Education Section**: Inserted full Experience & Education timeline section (`<section id="experience" class="reveal-on-scroll">`) featuring 3 career/education items with `.timeline-dot` node markers and `.timeline-content` cards.
- **Resume Download Button**: Removed inline `onmouseover` and `onmouseout` JavaScript attributes from the resume download link (`.download-resume-btn`) in favor of clean CSS `:hover` states.
- **Footer Mobile Social Bar**: Added centered `.footer-socials` container with GitHub, Instagram, and LinkedIn icon links inside `<footer>`.

#### 2. `style.css`
- **Global Reset & Box-Sizing**: Extended universal reset to include `*::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`.
- **Root Overflow-X Prevention**: Added `html, body { width: 100%; max-width: 100%; overflow-x: hidden; }` to prevent horizontal page drift on mobile WebKit/Safari viewports.
- **Header & Mobile Drawer Z-Index**: Increased `.mobile-nav-menu` `z-index` from `999` to `1005` (layering above fixed `<header>` `z-index: 1000`). Added `max-height: 100vh; overflow-y: auto; padding: 80px 20px 40px 20px;` to support landscape mobile viewports.
- **Navigation Breakpoint**: Adjusted desktop-to-mobile navigation breakpoint from `768px` to `1024px` (`@media (max-width: 1024px)`) to prevent 8-item nav text collision with brand logo on tablet viewports.
- **Touch Target Compliance (WCAG 2.1 AA)**: Updated `.mobile-nav-toggle`, `.close-mobile-btn`, `.project-link`, `.floating-socials a`, and `.footer-socials a` to enforce `min-width: 44px; min-height: 44px;` and appropriate padding.
- **Hero & About Sections**:
  - Implemented missing CSS rules for `.hero-statement`, `.quick-facts-grid`, and `.fact-item`.
  - Added `pointer-events: auto` to hero text elements (`.hero-subtitle-top`, `.hero-title`, `.hero-subtitle`, `.hero-statement`) overriding parent container lock out.
  - Fixed selector mismatch by replacing dead `.about-photo` selector with `.about-image-container`.
  - Scoped fanning flex deck layout specifically to `#certifications .awards-grid` and set `#highlights .awards-grid { display: grid !important; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 32px; }`.
- **Skills Section**:
  - Added wrapper boundaries for 3D TagCloud canvas (`.sphere-wrapper { width: 100%; max-width: 100%; overflow: hidden; }`).
  - Standardized AI tool image heights and Devicon font icons to uniform `22px x 22px` dimensions (`.skill-item-box img`, `.skill-item-box i`).
  - Scaled category card padding (`.skill-category-card`) to `18px 14px` on viewports `<=480px`.
- **Projects Section**:
  - Updated grid column template from `minmax(320px, 1fr)` to `minmax(min(280px, 100%), 1fr)` to prevent 32px right overflow on 320px screens.
  - Made project image box height responsive (`aspect-ratio: 16/9; max-height: 200px; height: auto`).
  - Aligned card buttons using flex column height distribution (`.project-card { height: 100%; display: flex; flex-direction: column; }`, `.project-links { margin-top: auto; }`).
- **Experience / Timeline Architecture**:
  - Implemented complete responsive CSS timeline styling featuring central spine line (`.timeline-container::before`), circular node dots (`.timeline-dot`), alternating left/right layout on desktop, and single-column stacked layout under `768px` and `480px`.
- **Vercel Deployments Section**:
  - Added CSS styling for `.vercel-grid`, `.vercel-card`, `.vercel-card-title`, `.vercel-status`, `.vercel-status-dot`, `.vercel-card-desc`, and `.vercel-link-btn`.
- **Contact Section**:
  - Set input/textarea `font-size: 16px` on viewports `<=768px` to prevent iOS Safari auto-zoom.
  - Added high-contrast `:focus-visible` outlines (`2px solid var(--accent-color)`).
  - Implemented `.form-group.error` and `.field-error-msg` error state styling.
  - Added `word-break: break-word; overflow-wrap: anywhere;` to `.detail-value` to prevent email text clipping on 320px screens.
- **Footer Section**:
  - Fixed text color contrast ratio on `.footer-text` (`color: var(--text-secondary);` #a0a0a0, achieving 7.2:1 WCAG AA contrast).
  - Added `.footer-socials` CSS row (visible on `<=1024px` viewports).
  - Made product launch badge image responsive (`footer img { max-width: 100%; height: auto; }`).

#### 3. `script.js`
- **Decoupled Scrollspy**: Extracted active section scrollspy handler from Lenis callback into standalone `updateScrollspy()` function bound to native `window.addEventListener('scroll', updateScrollspy, { passive: true })`, ensuring active link highlighting works on mobile devices where Lenis is disabled.
- **GSAP Tilt Excluded from Award Cards**: Excluded `.award-card` elements from the generic `.glass-card` GSAP mousemove tilt listener (`if (card.classList.contains("award-card")) return;`) to eliminate transform stutter with CSS card flex fanning.
- **Form Error Feedback**: Updated contact form submission handler to toggle `.error` class and set `aria-invalid="true"` on invalid inputs when validation fails, automatically clearing error states after timeout or re-submission.
- **Responsive 3D TagCloud Sphere**: Updated TagCloud initialization options radius to dynamically evaluate screen width (`radius: window.innerWidth < 360 ? 120 : (window.innerWidth < 768 ? 140 : 250)`), enabling 3D skill sphere to fit inside 320px viewports without horizontal scrollbar blowout.
