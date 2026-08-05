# Comprehensive Read-Only Audit & CSS Strategy Handbook

**Project**: Portfolio Website (`index.html`, `style.css`, `script.js`)  
**Auditor**: Teamwork Explorer Subagent  
**Date**: August 5, 2026  
**Scope**: Contact Section, Footer Section, Script & Dynamic CSS, Touch Targets (>= 44px), Breakpoint Responsiveness (320px+), Z-Index Layering Matrix, Focus/Validation States.

---

## Executive Summary

A comprehensive, line-by-line read-only audit of `index.html`, `style.css`, and `script.js` was conducted to evaluate layout integrity, visual consistency, interactive dynamics, accessibility compliance, and responsive behavior across all breakpoint tiers (320px small mobile to 1440px+ large desktop).

### Key Findings Overview:
1. **Contact Section**:
   - Inputs use `font-size: 14px` which triggers forced viewport auto-zoom on iOS mobile devices.
   - Form controls rely on `outline: none` without WCAG-compliant high-contrast focus rings for keyboard navigation.
   - HTML form uses `novalidate` while JavaScript handles validation by mutating button text without field-level error styling or `aria-live` announcements.
   - Email address link in contact details box overflows container bounds on 320px viewports due to missing word wrapping.
   - Glass cards retain fixed `padding: 32px` on 320px mobile screens, consuming 20% of viewport width in padding alone.
2. **Footer Section**:
   - Copyright text (`#606060` on `#050505`) fails WCAG 2.1 AA contrast ratio requirements (3.74:1 vs required 4.5:1).
   - Desktop floating social sidebar is hidden (`display: none`) on viewports $\le$ 1024px, leaving the footer without direct social links or a "Back to Top" navigation control.
   - External launch badge lacks responsive width constraints inside inline anchor tags.
3. **Script & Dynamic CSS**:
   - **Critical Mobile Bug**: Active scrollspy navigation links rely entirely on `lenis.on('scroll')`, but `lenis` is explicitly disabled on mobile devices (`isMobile`), completely breaking nav link active highlights on mobile.
   - **Critical Z-Index Bug**: `.mobile-nav-menu` has `z-index: 999` while `<header>` has `z-index: 1000`. The mobile drawer slides in *behind* the fixed header, causing header elements to bleed through and overlapping close buttons.
   - **Touch Target Violations**: Mobile nav toggle button, close button, project links, skill badges, and floating socials fail the WCAG 44px $\times$ 44px touch target standard.
   - **Layout Shift & Animation Conflicts**: JS GSAP 3D card tilt handler applies inline transform styles on mousemove that conflict with CSS `:hover !important` rules and card fan transformations.

---

## 1. Contact Section Audit

### 1.1 Form Layout & Responsive Stacking
- **Observation**:
  - `style.css` lines 997–1001: `.contact-wrapper` uses `display: grid; grid-template-columns: 1.2fr 1fr; gap: 60px;`.
  - `style.css` lines 1172–1177 (`max-width: 900px`): `.contact-wrapper` switches to `grid-template-columns: 1fr; gap: 48px;`.
  - `style.css` lines 1268–1277 (`max-width: 600px`): `.form-group-row` switches to `grid-template-columns: 1fr; gap: 16px; margin-bottom: 16px;`.
  - `style.css` lines 82–90: `.glass-card` applies `padding: 32px;` globally.
- **Visual Bug Impact**:
  - On 320px screens, `padding: 32px` takes up 64px total horizontal margin within the form card, leaving only 256px usable width for text inputs and labels. This squeezes form controls into narrow columns.
- **Proposed CSS Strategy**:
  ```css
  @media (max-width: 480px) {
    .contact-form-box.glass-card {
      padding: 20px 16px;
    }
  }
  ```

### 1.2 Input Fields & Textareas Sizing (iOS Auto-Zoom Bug)
- **Observation**:
  - `style.css` lines 1028–1038: `.form-group input, .form-group textarea` specifies `font-size: 14px; padding: 14px 20px;`.
- **Visual Bug Impact**:
  - iOS Mobile Safari automatically zooms the page viewport when an `<input>` or `<textarea>` with `font-size` less than `16px` receives focus. This causes unexpected layout shifts and breaks horizontal page scaling on mobile.
- **Proposed CSS Strategy**:
  ```css
  @media (max-width: 768px) {
    .form-group input,
    .form-group textarea {
      font-size: 16px; /* Prevents iOS auto-zoom on focus */
    }
  }
  ```

### 1.3 Focus States & Keyboard Accessibility (`outline: none` Bug)
- **Observation**:
  - `style.css` lines 1039–1043: `.form-group input:focus, .form-group textarea:focus { border-color: var(--accent-color); outline: none; box-shadow: 0 0 15px rgba(224, 96, 49, 0.1); }`.
  - `.submit-btn` (lines 1045–1074) has no `:focus` or `:focus-visible` CSS rules.
- **Visual Bug Impact**:
  - Removing outlines with `outline: none` without a high-contrast focus ring renders focus states invisible to keyboard users navigating via `Tab` key, violating WCAG 2.1 Success Criterion 2.4.7 (Focus Visible).
- **Proposed CSS Strategy**:
  ```css
  .form-group input:focus-visible,
  .form-group textarea:focus-visible {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }
  .submit-btn:focus-visible {
    outline: 2px solid #fff;
    outline-offset: 4px;
  }
  ```

### 1.4 Form Validation Feedback & Error Handling Gaps
- **Observation**:
  - `index.html` line 619: `<form id="portfolio-contact-form" novalidate>` disables native browser validation.
  - `script.js` lines 631–685: Validation checks (empty fields, email regex, phone regex) mutate submit button text (`"Fields Required!"`, `"Invalid Email!"`, `"Invalid Phone!"`), set background to red (`#c62828`), and reset after 3 seconds.
  - `style.css` contains zero CSS classes for `.form-group.error`, `input.error`, or inline validation error text.
- **Visual Bug Impact**:
  - When form validation fails, no visual indication appears on the actual invalid field. The user must guess which field triggered the error. Screen readers are not notified because there are no `aria-invalid="true"` attributes or `aria-live` error containers.
- **Proposed Fix Strategy**:
  - Add CSS styles for `.form-group.error input`, `.form-group.error textarea`, and `.field-error-msg`.
  - Update `script.js` validation to apply `.error` class and set `aria-invalid="true"` on the failing input element.

### 1.5 Detail Items & Email Text Overflow on 320px
- **Observation**:
  - `index.html` line 666: `<div class="detail-value"><a href="mailto:viswakpullepu1@gmail.com">viswakpullepu1@gmail.com</a></div>`.
  - `style.css` lines 1087–1113: `.detail-item` uses `gap: 16px;`, `.detail-icon-box` is `48px`.
- **Visual Bug Impact**:
  - On 320px viewports: 320px width - 32px section padding - 48px icon box - 16px gap leaves ~224px. The string `viswakpullepu1@gmail.com` at default size requires ~235px, causing horizontal text clipping or overflow off the right edge of the card.
- **Proposed CSS Strategy**:
  ```css
  .detail-value {
    word-break: break-word;
    overflow-wrap: anywhere;
  }
  ```

### 1.6 Inline Hover Scripts Maintenance Defect
- **Observation**:
  - `index.html` lines 689–693: Resume download button contains hardcoded JS attributes: `onmouseover="this.style.background='var(--accent-color)'; this.style.color='#fff';" onmouseout="this.style.background='transparent'; this.style.color='var(--accent-color)'"`.
- **Visual Bug Impact**:
  - Inline hover scripts override CSS stylesheet rules and cause sticky hover states on mobile touch devices (where `onmouseout` does not trigger after a tap).
- **Proposed Fix Strategy**: Remove inline JS attributes from HTML and move hover behavior to CSS class `.download-resume-btn:hover`.

---

## 2. Footer Section Audit

### 2.1 Copyright Text Contrast Ratio Failure
- **Observation**:
  - `index.html` line 710: `<p class="footer-text">&copy; <span id="year"></span> Vishwak Pullepu. All rights reserved. Designed with passion.</p>`.
  - `style.css` lines 1185–1188: `.footer-text { font-size: 12px; color: var(--text-muted); }`.
  - `style.css` line 17: `--text-muted: #606060;`.
  - `style.css` line 5: `--bg-color: #050505;`.
- **Visual Bug Impact**:
  - Text color `#606060` against background `#050505` yields a contrast ratio of **3.74:1**.
  - WCAG 2.1 AA requires a minimum contrast ratio of **4.5:1** for small body text (< 18pt). `#606060` fails compliance and is illegible in low-brightness environments.
- **Proposed CSS Strategy**:
  ```css
  .footer-text {
    font-size: 13px;
    color: var(--text-secondary); /* #a0a0a0 gives 7.2:1 contrast ratio */
  }
  ```

### 2.2 Social Links Missing on Mobile / Tablet Views
- **Observation**:
  - `style.css` lines 352–375: `.floating-socials` is hidden at $\le$ 1024px (`@media (max-width: 1024px) { .floating-socials { display: none; } }`).
  - `index.html` lines 708–721: `<footer>` contains no social media links or icons.
- **Visual Bug Impact**:
  - On viewports below 1024px, if a user scrolls to the bottom of the page, there are no social media icons in the footer. The user must scroll back up to the Contact section to access GitHub, Instagram, or LinkedIn links.
- **Proposed Fix Strategy**: Add a centered `.footer-socials` row in `<footer>` visible only on mobile/tablet viewports ($\le$ 1024px).

### 2.3 Footer Launch Badge Alignment & Sizing at 320px
- **Observation**:
  - `index.html` lines 713–719: `<img src="https://websitelaunches.com/badge/vishwak.tech.svg" width="255" height="55">`.
- **Visual Bug Impact**:
  - The badge image has explicit HTML width `255px`. On 320px screens with 24px footer padding (320 - 48 = 272px available space), the badge barely fits and can cause minor layout misalignment if margins or borders scale.
- **Proposed CSS Strategy**:
  ```css
  footer img {
    max-width: 100%;
    height: auto;
    display: inline-block;
  }
  ```

---

## 3. Script & Dynamic CSS Audit

### 3.1 Active Nav Link Scrollspy Bug (Lenis Dependency)
- **Observation**:
  - `script.js` line 4–5: `const isMobile = window.innerWidth <= 768 || ...`.
  - `script.js` line 14: `if (!isMobile && typeof Lenis !== "undefined") { lenis = new Lenis(...); }`.
  - `script.js` lines 577–600:
    ```javascript
    if (lenis) {
      lenis.on('scroll', () => {
        // active link scrollspy logic
      });
    }
    ```
- **Visual Bug Impact**:
  - Because Lenis is initialized *only* when `!isMobile` is true, `lenis` remains `null` on all mobile devices.
  - As a result, the entire active nav link scrollspy callback inside `if (lenis)` NEVER executes on mobile screens ($\le$ 768px). Active navigation link highlights fail to update during mobile scrolling.
- **Proposed Fix Strategy**:
  - Decouple scrollspy listener from `lenis.on('scroll')` and attach to `window.addEventListener('scroll', ...)` or use `IntersectionObserver` across all devices.

### 3.2 Z-Index Layering Conflicts
- **Inventory of Z-Index Values**:
  - `window.onerror` debug badge: `z-index: 999999` (`index.html` line 3)
  - `#cert-modal`: `z-index: 999999` (`style.css` line 1413)
  - `#preloader`: `z-index: 10000` (`style.css` line 149)
  - `#custom-cursor`: `z-index: 9999` (`style.css` line 104)
  - `.award-card.rolling-out`: `z-index: 9999` (`style.css` line 1404)
  - `#custom-cursor-ring`: `z-index: 9998` (`style.css` line 116)
  - `<header>`: `z-index: 1000` (`style.css` line 216)
  - `.mobile-nav-menu`: `z-index: 999` (`style.css` line 312) $\leftarrow$ **BUG!**
  - `.floating-socials`: `z-index: 99` (`style.css` line 360)
  - `#success-overlay`: *Unset z-index* (`style.css`) $\leftarrow$ **BUG!**
- **Conflict Analysis**:
  1. **Mobile Menu Drawer Stacking Bug**: `.mobile-nav-menu` (`z-index: 999`) is lower than `<header>` (`z-index: 1000`). When opened, the drawer slides in *behind* the fixed header. Header items (logo, burger toggle) stay visible over the menu overlay and clash with menu controls.
  2. **Success Overlay Stacking Bug**: `#success-overlay` (`index.html` line 748, `script.js` line 709) has no `z-index` rule defined in `style.css`. It renders underneath fixed header/modals when form submission succeeds.
- **Proposed CSS Fix Strategy**:
  ```css
  .mobile-nav-menu {
    z-index: 1005; /* Higher than fixed header (1000) */
  }
  .success-overlay {
    z-index: 99999;
  }
  ```

### 3.3 Touch Target Size Violations ($\le$ 44px $\times$ 44px)
- **WCAG Guideline**: 2.5.5 Target Size / 2.5.8 Target Size (Minimum 44px $\times$ 44px for touch interfaces).
- **Violations Identified**:

| Element | Selector | File & Lines | Current Dimensions | Compliance | Fix Strategy |
|---|---|---|---|---|---|
| Mobile Nav Toggle | `.mobile-nav-toggle` | `style.css:294-301` | ~24px $\times$ 24px | **FAIL** | Add `padding: 10px; min-width: 44px; min-height: 44px;` |
| Mobile Close Button | `.close-mobile-btn` | `style.css:340-349` | ~32px $\times$ 32px | **FAIL** | Add `padding: 8px; min-width: 44px; min-height: 44px;` |
| Project Links | `.project-link` | `style.css:834-840` | ~18px $\times$ 18px | **FAIL** | Add `padding: 13px; display: inline-flex;` |
| Skill Badges | `.skill-badge` | `style.css:628-636` | ~26px height | **FAIL** | Increase padding to `padding: 10px 16px;` |
| Floating Social Links | `.floating-socials a` | `style.css:362-369` | ~20px $\times$ 20px | **FAIL** | Add `padding: 12px; display: flex; align-items: center;` |

### 3.4 Interactive Hover/Active States & GSAP/CSS Conflicts
- **Observation**:
  - `script.js` lines 250–306: JS attaches `mouseenter`, `mousemove`, `mouseleave` listeners on `.glass-card` (which includes `.award-card`), applying inline `rotateX`, `rotateY`, `y`, `scale` styles via GSAP.
  - `style.css` lines 1395–1399: `.award-card:hover { transform: translateY(-80px) scale(1.22) rotate(0deg) !important; }`.
- **Visual Bug Impact**:
  - CSS `:hover` transform uses `!important`, which fights with GSAP inline transform updates on mousemove. This creates cursor jitter, flickering card transforms, and layout stutter when hovering over certification cards.
- **Proposed Fix Strategy**: Exclude `.award-card` from generic `.glass-card` GSAP mousemove tilt listener, allowing CSS flex-fanning to handle card hover states smoothly.

---

## 4. Master Audit Issue Matrix & CSS Fix Plan

| # | Category | File | Lines | Problem Description | Visual Bug Impact | Proposed CSS / JS Fix Strategy |
|---|---|---|---|---|---|---|
| 1 | Contact | `style.css` | 1028–1038 | Input font size is `14px`. | Mobile Safari auto-zooms viewport on field focus. | Set `font-size: 16px;` on inputs for mobile viewports ($\le$ 768px). |
| 2 | Contact | `style.css` | 1039–1043 | Focus rules use `outline: none;`. | Invisible focus states for keyboard `Tab` navigation. | Replace with `outline: 2px solid var(--accent-color); outline-offset: 2px;`. |
| 3 | Contact | `style.css` | 82–90 | Fixed `padding: 32px` on `.glass-card`. | Squeezes form fields on 320px screens. | Override with `padding: 20px 16px;` on small mobile viewports. |
| 4 | Contact | `index.html` / `script.js` | 619 / 631–685 | Button text changes on error; no field-level error styles. | User cannot identify which field failed validation. | Add `.error` CSS class on input parent & render inline error message text. |
| 5 | Contact | `style.css` | 1087–1113 | Email detail text lacks overflow/word wrapping. | Text clips horizontally on 320px screens. | Add `word-break: break-word; overflow-wrap: anywhere;` to `.detail-value`. |
| 6 | Footer | `style.css` | 1185–1188 / 17 | `.footer-text` uses `#606060` on `#050505`. | Fails WCAG AA contrast standard (3.74:1 vs 4.5:1). | Change text color to `var(--text-secondary)` (`#a0a0a0`, 7.2:1 contrast). |
| 7 | Footer | `style.css` | 371–375 | `.floating-socials` hidden at $\le$ 1024px; footer has no socials. | No social links accessible at page bottom on mobile. | Add mobile-visible `.footer-socials` row inside `<footer>`. |
| 8 | Script | `script.js` | 14 & 577 | Nav scrollspy nested inside `if (lenis)`. | Nav active state highlights completely broken on mobile. | Move scrollspy handler out of Lenis check to standard window scroll listener. |
| 9 | Script | `style.css` | 312 & 216 | Mobile menu `z-index: 999` lower than header `z-index: 1000`. | Drawer menu opens behind fixed header bar. | Increase `.mobile-nav-menu` to `z-index: 1005`. |
| 10 | Script | `style.css` | 294, 340, 834 | Mobile buttons and links are smaller than 44px. | Difficult to tap on touch screens (WCAG violation). | Add min-width/min-height 44px and padding to touch elements. |
| 11 | Script | `script.js` / `style.css` | 250–306 / 1395 | GSAP tilt conflicts with `.award-card:hover !important`. | Card transforms flicker and stutter on hover. | Exclude `.award-card` from 3D tilt JS listener. |

---

## 5. Verification Method

To verify these issues and test proposed fixes independently:
1. **Viewport Auditing**: Use browser DevTools responsive mode at 320px, 375px, 480px, 768px, 1024px, and 1440px.
2. **Keyboard Navigation Audit**: Press `Tab` from Hero down to Footer to verify focus visibility.
3. **Accessibility / Contrast Audit**: Run Lighthouse / Axe accessibility audit to verify contrast on `.footer-text`.
4. **Form Error Testing**: Submit empty form or invalid email to verify validation feedback.
5. **Mobile Nav Drawer Verification**: Toggle hamburger menu on mobile screen to check drawer stacking over header.
