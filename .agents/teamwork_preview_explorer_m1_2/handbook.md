# Comprehensive CSS & Layout Audit Handbook
**Target Workspace:** `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu`  
**Files Audited:** `index.html`, `style.css`, `script.js`  
**Date:** August 5, 2026  
**Auditor:** Teamwork Preview Explorer (M1)

---

## Executive Overview & Target Scope

This handbook presents an in-depth, read-only CSS, HTML, and JavaScript layout audit of the portfolio website for **Vishwak Pullepu**. The audit focuses specifically on responsive design integrity, grid/flexbox mechanics, CSS rule correctness, visual bug impacts across standard breakpoints (**320px–479px**, **480px–767px**, **768px–1023px**, **1024px–1439px**, **1440px+**), and exact proposed CSS fixes.

---

## Section 1: Skills Section Comprehensive Audit

### 1.1 3D Sphere TagCloud Canvas Mobile Overflow (320px–767px)
* **File Names**: `style.css` & `script.js`
* **Line Numbers**:
  * `style.css`: Lines 62, 673–695, 1238
  * `script.js`: Lines 1202–1225
* **CSS Rules Involved**:
  ```css
  /* style.css Line 62 */
  section { padding: 100px 24px; }

  /* style.css Line 1238 */
  @media (max-width: 768px) {
    section { padding: 60px 16px; }
  }

  /* style.css Line 673 & 685 */
  .skills-container { display: flex; flex-direction: column; gap: 40px; width: 100%; }
  .sphere-wrapper { flex: 1; display: flex; justify-content: center; }

  /* script.js Line 1203 */
  const options = { radius: window.innerWidth < 768 ? 160 : 250, ... };
  ```
* **Visual Bug Impact at Breakpoints**:
  * **320px Mobile Screen (e.g. iPhone SE)**: Section horizontal padding is `16px` on each side (`32px` total). Available inner container width = `320px - 32px = 288px`.
  * The TagCloud JS script initializes with a radius of `160px`, producing a sphere canvas diameter of `320px`.
  * Because `320px > 288px`, the sphere canvas overflows the right edge of the viewport by **32px**, triggering unwanted horizontal body scroll and clipping skill logos on narrow devices.
* **Proposed CSS & JS Fix Strategy**:
  * Add explicit container overflow handling and responsive canvas scaling in CSS:
    ```css
    .sphere-wrapper {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #skill-sphere {
      max-width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #skill-sphere canvas, .tagcloud {
      max-width: 100% !important;
    }
    @media (max-width: 360px) {
      .sphere-wrapper {
        transform: scale(0.85);
        margin: -20px 0;
      }
    }
    ```
  * In `script.js` line 1203, adjust radius calculation for extra-small viewports:
    ```javascript
    radius: window.innerWidth < 360 ? 120 : (window.innerWidth < 768 ? 140 : 250)
    ```

---

### 1.2 Fixed Card Padding Causing Text Squeezing & Overflow at 320px
* **File Names**: `style.css` & `index.html`
* **Line Numbers**:
  * `style.css`: Lines 704–706, 718–722, 724–737
  * `index.html`: Lines 171–257
* **CSS Rules Involved**:
  ```css
  /* style.css Line 704 */
  .skill-category-card { padding: 30px; }

  /* style.css Line 718 */
  .skill-grid-items { display: flex; flex-wrap: wrap; gap: 12px; }

  /* style.css Line 724 */
  .skill-item-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-secondary);
  }
  ```
* **Visual Bug Impact at Breakpoints**:
  * **320px–360px Mobile**: Card padding remains unscaled at `30px` left + right (`60px` total).
  * With `16px` section padding + `30px` card padding, available width inside `.skill-category-card` is only `320px - 92px = 228px`.
  * Individual `.skill-item-box` chips have `padding: 8px 16px; gap: 10px;`. Long labels such as *"Stable Diffusion"* (line 183), *"Amazon Web Services"* (line 234), or *"DigitalOcean"* (line 253) measure over `180px` wide.
  * In a `228px` space, chips cannot wrap gracefully side-by-side, resulting in single-item column stacking with truncated text or broken chip boundaries.
* **Proposed CSS Fix Strategy**:
  * Introduce responsive card padding and flex chip scaling for viewports under 480px:
    ```css
    @media (max-width: 480px) {
      .skill-category-card {
        padding: 18px 14px;
      }
      .skill-grid-items {
        gap: 8px;
      }
      .skill-item-box {
        padding: 6px 10px;
        font-size: 12px;
        gap: 6px;
      }
    }
    ```

---

### 1.3 Icon Sizing & Visual Baseline Disparity Across Skill Cards
* **File Names**: `index.html` & `style.css`
* **Line Numbers**:
  * `index.html`: Lines 173–190 (inline `<img>` tags)
  * `style.css`: Lines 739–742 (`.skill-item-box i, .skill-item-box img`)
* **CSS Rules Involved**:
  ```html
  <!-- index.html Lines 173-190 -->
  <img src="..." style="width: 32px; height: 32px; border-radius: 6px;" />
  ```
  ```css
  /* style.css Line 739 */
  .skill-item-box i, .skill-item-box img {
    font-size: 20px;
    border-radius: 4px;
  }
  ```
* **Visual Bug Impact at Breakpoints**:
  * **All Breakpoints (320px - 1440px+)**: AI Model favicon images (`<img>`) are explicitly styled with inline width and height of `32px x 32px`. Devicon font icons (`<i>`) in adjacent cards rely on CSS `font-size: 20px`.
  * This creates an uneven chip height (`48px` height for AI tool chips vs `36px` height for Frameworks chips). When wrapped in flex rows, the chips align unevenly, creating jagged baselines and awkward vertical rhythms.
* **Proposed CSS Fix Strategy**:
  * Override inline image dimensions with a uniform CSS selector:
    ```css
    .skill-item-box img {
      width: 22px !important;
      height: 22px !important;
      object-fit: contain;
      border-radius: 4px;
    }
    .skill-item-box i {
      font-size: 22px;
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    ```

---

### 1.4 Progress Bars & Obsolete Skill Badge CSS Rules
* **File Names**: `style.css` & `index.html`
* **Line Numbers**: `style.css`: Lines 623–641
* **CSS Rules Involved**: `.skills-list`, `.skill-badge`
* **Visual Bug Impact at Breakpoints**:
  * `style.css` defines `.skills-list` and `.skill-badge` classes that are completely absent in `index.html` markup (which uses `.skill-grid-items` and `.skill-item-box`). Meanwhile, standard skill progress indicator bars are omitted from the HTML markup.
* **Proposed Strategy**:
  * Remove dead CSS declarations or harmonize `.skill-item-box` to incorporate optional skill proficiency tags.

---

## Section 2: Projects Section Comprehensive Audit

### 2.1 Grid Column Overflow & Broken Auto-Fit (`minmax(320px, 1fr)`) at 320px Mobile
* **File Name**: `style.css`
* **Line Numbers**: Lines 762–766, 1260–1265, 1290–1293
* **CSS Rules Involved**:
  ```css
  /* style.css Line 764 */
  .projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 32px;
  }

  /* style.css Line 1238 */
  section { padding: 60px 16px; }

  /* style.css Line 1260 */
  .project-card, .award-card, .community-card {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  /* style.css Line 1290 */
  @media (max-width: 480px) {
    .projects-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
  ```
* **Visual Bug Impact at Breakpoints**:
  * **320px–351px Mobile**: On a 320px viewport, section padding takes `16px + 16px = 32px`, leaving inner container width = `288px`.
  * The base rule `minmax(320px, 1fr)` specifies that no column can shrink below `320px`. Before the `@media (max-width: 480px)` query is evaluated, or on devices between 320px and 351px where the container is narrower than `320px`, the project cards are forced to `320px` width.
  * **Bug Result**: Each project card overflows the right viewport edge by `32px` (`320px > 288px`), creating a broken horizontal scrollbar on mobile browsers.
  * **768px–1023px (Tablet Portrait)**: Container width is `768px - 48px = 720px`. Two columns of `minmax(320px, 1fr)` with `32px` gap require `320px + 32px + 320px = 672px`. On a 700px viewport, available space (`652px`) is less than `672px`, forcing grid into single column mode. However, `.project-card` has `max-width: 500px`, leaving huge asymmetric empty side margins on tablets.
* **Proposed CSS Fix Strategy**:
  * Update grid columns to use `minmax(min(280px, 100%), 1fr)`:
    ```css
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
      gap: 32px;
    }
    @media (max-width: 768px) {
      .project-card {
        max-width: 100%;
      }
    }
    @media (max-width: 480px) {
      .projects-grid {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
    ```

---

### 2.2 Card Height & Vertical Alignment Inconsistencies (320px - 1440px+)
* **File Name**: `style.css`
* **Line Numbers**: Lines 768–773, 775–780, 809–814, 822–828
* **CSS Rules Involved**:
  ```css
  /* style.css Line 768 */
  .project-card {
    overflow: hidden;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  /* style.css Line 775 */
  .project-image-box {
    width: 100%;
    height: 200px;
    overflow: hidden;
    position: relative;
  }

  /* style.css Line 809 */
  .project-info {
    padding: 24px;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  /* style.css Line 822 */
  .project-desc {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
    margin-bottom: 20px;
    flex-grow: 1;
  }
  ```
* **Visual Bug Impact at Breakpoints**:
  * **1024px–1440px+ Desktop**: Project 1 description has 161 chars (3 lines). Project 2 has 167 chars (3 lines). Project 3 has 123 chars (2 lines).
  * In a multi-column row, grid items stretch to equal total height. Because `.project-desc` has `flex-grow: 1`, Project 3's description container expands vertically to absorb the missing height, resulting in irregular gap sizes above `.project-links`.
  * **320px–480px Mobile**: The hardcoded image height `200px` takes up over 60% of a 320px device height. Combined with card info padding and description, each card exceeds `460px` total height, causing excessive scrolling and image distortion.
* **Proposed CSS Fix Strategy**:
  * Replace fixed `height: 200px` with responsive aspect ratio and flex column distribution:
    ```css
    .project-card {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .project-image-box {
      width: 100%;
      aspect-ratio: 16 / 9;
      height: auto;
      overflow: hidden;
      position: relative;
    }
    .project-info {
      padding: 20px;
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .project-desc {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 20px;
      flex: 1 1 auto;
    }
    ```

---

### 2.3 Image Containers, Hover Overlays & Touch Target Accessibility Violations
* **File Names**: `style.css` & `index.html`
* **Line Numbers**:
  * `style.css`: Lines 791–807, 830–840
  * `index.html`: Lines 465–470, 484–489, 503–508
* **CSS Rules Involved**:
  ```css
  /* style.css Line 791 */
  .project-tags {
    position: absolute;
    top: 16px;
    right: 16px;
    display: flex;
    gap: 8px;
  }

  /* style.css Line 834 */
  .project-link {
    font-size: 18px;
    color: var(--text-secondary);
  }
  ```
* **Visual Bug Impact at Breakpoints**:
  * **320px–480px Mobile**:
    * Floating `.project-tags` badges are absolutely positioned at `top: 16px; right: 16px`. On narrow mobile cards (`~288px` wide), two badges ("Networking", "VLAN") consume over 50% of the image header width, covering screenshot details.
    * `.project-link` (GitHub icon link) has `font-size: 18px` with no padding or explicit touch target dimensions.
    * **Accessibility (a11y) Violation**: `PROJECT.md` standard requires tap targets to be `>= 44px` on mobile screens. An 18px target is extremely prone to mis-clicks on touch devices.
* **Proposed CSS Fix Strategy**:
  * Enforce minimum 44px touch targets on all interactive project links:
    ```css
    .project-links {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: auto;
    }
    .project-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
      padding: 10px;
      font-size: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border-color);
      transition: var(--transition-fast);
    }
    .project-link:hover {
      background: var(--accent-soft);
      border-color: var(--accent-color);
      color: #fff;
    }
    ```

---

## Section 3: Experience / Education Section & Timeline Audit

### 3.1 Omission of Experience/Education Markup in `index.html`
* **File Names**: `index.html` & `style.css`
* **Line Numbers**: `style.css`: Lines 606–622 (`.timeline-item`, `.timeline-title`, `.timeline-meta`, `.timeline-desc`)
* **Finding**:
  * `PROJECT.md` Architecture list specifies: `Scope: Portfolio sections (Navbar, Hero, About, Skills, Projects, Experience/Education, Contact, Footer, Mobile Drawer/Toggle)`.
  * In `index.html`, an Experience/Education timeline section is **completely missing**.
  * `style.css` contains minimal `.timeline-item` rules, but lacks essential timeline structural elements (spine line, node dots, left/right alternate column positioning, vertical mobile fallback).

---

### 3.2 Timeline Layout Flaws & Missing Visual Infrastructure
* **File Name**: `style.css`
* **Line Numbers**: Lines 606–622
* **Defect Analysis**:
  * The current timeline CSS only defines basic text typography for `.timeline-item`, `.timeline-title`, `.timeline-meta`, and `.timeline-desc`.
  * It lacks:
    1. A central vertical spine connector line (`.timeline-container::before`).
    2. Circular timeline node markers/dots (`.timeline-dot`).
    3. Alternating left-right card placement (`:nth-child(odd)` / `:nth-child(even)`).
    4. Mobile single-column alignment overrides at `768px` and `320px`.

---

### 3.3 Proposed Complete Responsive Timeline Architecture
* **Implementation Plan**:
  * Add the Experience/Education section markup in `index.html` and apply the following complete, responsive CSS architecture to `style.css`:

```css
/* --- EXPERIENCE & EDUCATION TIMELINE SECTION --- */
#experience {
  position: relative;
}

.timeline-container {
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 0;
}

/* Vertical Spine Line */
.timeline-container::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 2px;
  background: linear-gradient(180deg, var(--accent-color) 0%, rgba(224, 96, 49, 0.1) 100%);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  width: 50%;
  padding: 0 40px 40px 40px;
  box-sizing: border-box;
}

.timeline-item:nth-child(odd) {
  left: 0;
  text-align: right;
}

.timeline-item:nth-child(even) {
  left: 50%;
  text-align: left;
}

/* Timeline Node Marker Dot */
.timeline-dot {
  position: absolute;
  top: 0;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg-color);
  border: 2px solid var(--accent-color);
  box-shadow: 0 0 10px var(--accent-glow);
  z-index: 2;
}

.timeline-item:nth-child(odd) .timeline-dot {
  right: -8px;
}

.timeline-item:nth-child(even) .timeline-dot {
  left: -8px;
}

.timeline-content {
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  transition: var(--transition-smooth);
}

.timeline-content:hover {
  border-color: var(--border-color-hover);
  box-shadow: 0 10px 30px -10px rgba(224, 96, 49, 0.15);
}

.timeline-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 6px;
}

.timeline-meta {
  font-size: 13px;
  font-weight: 500;
  color: var(--accent-color);
  margin-bottom: 12px;
}

.timeline-desc {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* --- TIMELINE RESPONSIVE BREAKPOINTS --- */

/* Tablet & Mobile Fallback (< 768px) */
@media (max-width: 768px) {
  .timeline-container::before {
    left: 20px;
  }
  
  .timeline-item {
    width: 100% !important;
    left: 0 !important;
    padding-left: 50px !important;
    padding-right: 0 !important;
    text-align: left !important;
  }
  
  .timeline-dot {
    left: 12px !important;
    right: auto !important;
  }
}

/* Narrow Mobile Screen Adjustments (< 480px / 320px) */
@media (max-width: 480px) {
  .timeline-container::before {
    left: 12px;
  }
  
  .timeline-item {
    padding-left: 36px !important;
    padding-bottom: 24px !important;
  }
  
  .timeline-dot {
    left: 4px !important;
    width: 14px;
    height: 14px;
  }
  
  .timeline-content {
    padding: 16px;
  }
  
  .timeline-title {
    font-size: 16px;
  }
  
  .timeline-meta {
    font-size: 12px;
  }
  
  .timeline-desc {
    font-size: 13px;
  }
}
```

---

## Section 4: Cross-Sectional Responsive Grid, Flex & Breakpoint Issues

### 4.1 Header Logo & Mobile Drawer Toggle Squeezing at 320px
* **File Name**: `style.css` & `index.html`
* **Line Numbers**: `style.css`: Lines 210–238, 1228, 1308–1318; `index.html`: Line 62
* **Finding**:
  * At 320px width, header padding `16px 24px` leaves available width = `272px`.
  * Logo text `VN | Creative Developer` with `font-size: 18px` takes up ~210px. Combined with `.mobile-nav-toggle` button width (24px), total width is `234px`, leaving only `38px` safety buffer.
  * If browser zoom or font rendering varies slightly, the hamburger toggle button wraps onto a second header line.
* **Proposed CSS Fix Strategy**:
  ```css
  @media (max-width: 360px) {
    header {
      padding: 12px 16px;
    }
    .logo {
      font-size: 16px;
    }
  }
  ```

---

### 4.2 Floating Social Bar Overlap at 1024px–1200px
* **File Name**: `style.css`
* **Line Numbers**: Lines 352–375, 1220–1224
* **Finding**:
  * `.floating-socials` is positioned at `left: 40px; top: 50%;` (fixed).
  * `@media (max-width: 1024px)` sets `display: none`.
  * Between `1024px` and `1200px`, `section` has `max-width: 1200px; margin: 0 auto;`. On a 1100px screen, main section content begins at `(1100px - 1000px) / 2 = 50px` from left margin. The floating social bar at `left: 40px` visually overlaps section heading text.
* **Proposed CSS Fix Strategy**:
  ```css
  @media (max-width: 1280px) {
    .floating-socials {
      display: none;
    }
  }
  ```

---

### 4.3 Glass Card Fixed Padding & Form Input Cramping at 320px
* **File Name**: `style.css`
* **Line Numbers**: Lines 82–90 (`.glass-card`), 1010–1044 (`.form-group`)
* **Finding**:
  * Base `.glass-card` selector enforces `padding: 32px`.
  * At 320px mobile viewport, section padding is `16px` left+right (`32px`), glass card padding is `32px` left+right (`64px`). Total subtracted margin/padding = `96px`.
  * Available form input width inside `.contact-form-box` is only `320px - 96px = 224px`. Form inputs appear cramped and placeholder text gets clipped.
* **Proposed CSS Fix Strategy**:
  ```css
  @media (max-width: 480px) {
    .glass-card {
      padding: 20px 16px;
    }
  }
  ```

---

## Section 5: Consolidated Audit Matrix

| Issue ID | Section | Target Files | Affected Lines | Breakpoints Affected | Visual Impact Severity | Primary Root Cause | Proposed CSS Fix Summary |
|---|---|---|---|---|---|---|---|
| **SK-01** | Skills | `style.css`, `script.js` | CSS: 673-685, JS: 1203 | 320px – 767px | High (32px horizontal overflow) | Unconstrained canvas radius & missing wrapper max-width | Add `max-width: 100%; overflow: hidden` on wrapper; scale radius for <360px |
| **SK-02** | Skills | `style.css` | 704, 718, 724 | 320px – 479px | Medium (Chip squeezing & text clipping) | Fixed `30px` card padding on 320px screen | Reduce card padding to `18px 14px` and chip padding to `6px 10px` under 480px |
| **SK-03** | Skills | `index.html`, `style.css` | HTML: 173-190, CSS: 739 | All (320px - 1440px+) | Low (Visual height misalignment) | Inline `32px` images vs CSS `20px` font icons | Uniformly set `width: 22px !important; height: 22px !important` for all skill icons |
| **PR-01** | Projects | `style.css` | 764, 1260, 1290 | 320px – 351px, 768px | High (Horizontal grid overflow at 320px) | `minmax(320px, 1fr)` forces 320px min width in 288px container | Change grid template to `minmax(min(280px, 100%), 1fr)` |
| **PR-02** | Projects | `style.css` | 768, 775, 809, 822 | 320px – 1440px+ | Medium (Height imbalance & tall mobile images) | Fixed `200px` image box height & uneven text length | Use `aspect-ratio: 16/9` and flex auto vertical distribution |
| **PR-03** | Projects | `style.css` | 791, 834 | 320px – 479px | High (a11y Touch Target Violation) | `18px` project link icon without touch padding | Enforce `min-width: 44px; min-height: 44px` on interactive touch buttons |
| **EX-01** | Experience | `index.html`, `style.css` | HTML: missing, CSS: 606-622 | All (320px - 1440px+) | Critical (Section omitted from DOM) | Section missing in `index.html`; CSS lacks timeline structure | Add HTML section & complete responsive timeline CSS architecture |
| **EX-02** | Experience | `style.css` | 606–622 | 320px, 768px | High (No timeline dots/lines/mobile rules) | CSS lacks spine line, dots, and mobile single-column rules | Implement spine line (`::before`), `.timeline-dot`, and `@media (max-width: 768px)` rules |
| **GEN-01**| Global | `style.css` | 82, 352, 1220 | 320px, 1024px–1200px | Medium (Social bar overlap & form cramping) | Unscaled glass card padding & floating bar breakpoint gap | Hide floating socials below 1280px; reduce glass card padding to 20px on mobile |

---
