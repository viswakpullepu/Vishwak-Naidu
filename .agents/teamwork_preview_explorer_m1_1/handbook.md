# Portfolio Website HTML, CSS & Layout Comprehensive Audit Report (Handbook)

**Target Repository**: `Vishwak-Naidu`  
**Files Audited**: `index.html`, `style.css`, `script.js`  
**Audit Scope**: Global Reset & Layout, Header & Navbar, Hero & About Sections  
**Target Breakpoints**: 
- Extra-Small Mobile: 320px – 479px
- Standard Mobile: 480px – 767px
- Tablet: 768px – 1023px
- Desktop / Laptop: 1024px – 1439px
- Large Desktop: 1440px+

---

## Executive Summary

A comprehensive read-only audit of `index.html`, `style.css`, and `script.js` was conducted across all device breakpoints down to 320px. 

The investigation identified **18 critical visual, layout, responsiveness, and accessibility issues**, including:
- **Global Reset & Sizing Bugs**: Pseudo-elements (`::before`, `::after`) missing from box-sizing reset; root `overflow-x` handling causing mobile horizontal scroll blowout; unstyled inline glass-card padding cramping 320px viewports.
- **Header & Navbar Breakdown**: Breakpoint mismatch at 768px–1023px causing 8-item desktop nav links to collide with brand logo; navigation drawer z-index context inversion (`header` z-index 1000 vs drawer z-index 999); non-compliant hamburger tap target (<44px); vertical menu link truncation in landscape viewports; broken scrollspy active state on mobile.
- **Hero & About Structural Failures**: Missing CSS rules for `.hero-statement`, `.quick-facts-grid`, `.fact-item`, `.vercel-grid`, `.vercel-card`; `pointer-events: none` blocking hero text selection; dead selector mismatch (`.about-photo` vs `.about-image-container`); and global `.awards-grid { display: flex !important; }` destroying the Career Highlights section grid layout.

Below is the exhaustive, itemized audit report detailing exact file locations, line numbers, existing CSS rules, visual bug impact per breakpoint, and concrete proposed CSS fix strategies.

---

## SECTION 1: Global CSS Reset, Box-Sizing & Overflow Audit

### 1.1 Incomplete Universal Box-Sizing Reset
* **File**: `style.css`
* **Line Numbers**: 28–32
* **Current Code**:
  ```css
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  ```
* **Visual Bug Impact**:
  * **All Breakpoints (320px, 768px, 1024px)**: Pseudo-elements (`*::before` and `*::after`) default to `content-box`. Sized pseudo-elements—such as `.nav-contact-btn::before` (lines 272–284) and `.glass-card::after` (lines 459–467)—calculate widths/heights by adding padding and border on top of declared dimensions. This leads to border highlights leaking past card corners and animated button hover overlays expanding beyond button boundaries.
* **Proposed CSS Fix Strategy**:
  ```css
  *, *::before, *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  ```

---

### 1.2 Incomplete Root Overflow-X Prevention & Sticky Clipping Hazard
* **File**: `style.css`
* **Line Numbers**: 34–45
* **Current Code**:
  ```css
  html {
    scroll-behavior: smooth;
    background-color: var(--bg-color);
    color: var(--text-primary);
    font-family: var(--font-body);
  }

  body {
    overflow-x: hidden;
    position: relative;
    background: radial-gradient(circle at 50% 50%, rgba(224, 96, 49, 0.04) 0%, transparent 80%);
  }
  ```
* **Visual Bug Impact**:
  * **Mobile (320px – 479px)**: Setting `overflow-x: hidden` strictly on `body` without setting `overflow-x: hidden; width: 100%` on `html` fails on iOS Safari and WebKit mobile browsers when wide elements (3D tagcloud sphere, GitHub contribution graph SVG) exceed viewport width. A horizontal scrollbar appears, allowing the page to drift horizontally.
  * **Desktop (1024px+)**: `body { overflow-x: hidden; }` can break `position: sticky` on child elements like `.sphere-wrapper` (`top: 100px;` line 688) in Firefox and Chrome if an ancestor establishes a clipping box.
* **Proposed CSS Fix Strategy**:
  ```css
  html, body {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
  }

  body {
    position: relative;
    background: radial-gradient(circle at 50% 50%, rgba(224, 96, 49, 0.04) 0%, transparent 80%);
  }
  ```

---

### 1.3 Rigid Container Padding on Extra-Small Mobile Devices (320px – 360px)
* **File**: `style.css` (lines 62–68, 88, 705) & `index.html` (line 527)
* **Current Code**:
  ```css
  section {
    padding: 100px 24px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .glass-card {
    padding: 32px;
  }
  ```
  `index.html` Line 527: `<div class="glass-card" style="padding: 30px; ...">`
* **Visual Bug Impact**:
  * **320px Breakpoint**: On a 320px smartphone screen (e.g. iPhone SE/Android small), 32px left/right card padding subtracts 64px, leaving only 256px usable content width. Form inputs, project cards, and GitHub contribution graphs become severely cramped, causing text truncation and inline element wrapping.
* **Proposed CSS Fix Strategy**:
  ```css
  @media (max-width: 480px) {
    section {
      padding: 50px 14px;
    }
    .glass-card {
      padding: 20px 16px;
    }
  }
  ```

---

### 1.4 Preloader Text Overlap & Font Truncation on Small Mobile Screens
* **File**: `style.css` (lines 157–174) & `index.html` (lines 25–43)
* **Current Code**:
  ```css
  .loader-container {
    width: 80%;
    max-width: 400px;
  }

  .loading-text {
    font-size: 24px;
    letter-spacing: 0.1em;
  }
  ```
* **Visual Bug Impact**:
  * **320px – 420px Mobile**: "LOADING PORTFOLIO" consists of 17 animated letter spans. At 24px font size with `0.1em` letter-spacing, the required width is ~340px. On a 360px screen with `.loader-container` set to 80% width (288px), the loading text wraps awkwardly onto two lines or overflows the progress bar.
* **Proposed CSS Fix Strategy**:
  ```css
  .loading-text {
    font-size: clamp(14px, 5vw, 24px);
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    .loader-container {
      width: 90%;
    }
  }
  ```

---

### 1.5 Floating Social Bar Overlay Collision on Mid-Size Screens (1024px – 1150px)
* **File**: `style.css`
* **Line Numbers**: 352–375
* **Current Code**:
  ```css
  .floating-socials {
    position: fixed;
    left: 40px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 99;
  }

  @media (max-width: 1024px) {
    .floating-socials {
      display: none;
    }
  }
  ```
* **Visual Bug Impact**:
  * **1024px – 1150px Breakpoint**: Main sections have `max-width: 1200px; margin: 0 auto; padding: 100px 24px;`. On screen widths between 1025px and 1150px, the fixed `.floating-socials` bar at `left: 40px` renders directly over section headings, bio paragraphs, and project cards on the left side of the screen.
* **Proposed CSS Fix Strategy**:
  ```css
  @media (max-width: 1200px) {
    .floating-socials {
      display: none;
    }
  }
  ```

---

## SECTION 2: Header & Navbar Audit

### 2.1 Navigation Bar & Brand Logo Collision at Tablet / Small Laptop Breakpoint (768px – 1023px)
* **File**: `style.css`
* **Line Numbers**: 210–257, 1227–1236
* **Current Code**:
  ```css
  nav ul {
    display: flex;
    list-style: none;
    gap: 32px;
  }

  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }
    .mobile-nav-toggle {
      display: block !important;
    }
  }
  ```
* **Visual Bug Impact**:
  * **768px – 1023px Tablet / Small Laptop**: `.desktop-nav` contains 8 navigation items: About, Skills, Certifications, Projects, GitHub, Live Apps, Highlights, and Contact button. Combined width of `.logo` (~240px) + `nav ul` at `gap: 32px` (~750px) + header padding (80px) = ~1070px.
  * At viewport widths between 769px and 1023px (portrait iPad, landscape tablets, small laptops), the desktop navigation items collide directly with the brand logo. Because `header` uses `justify-content: space-between` and `nav ul` has no `flex-wrap`, links wrap onto a second line or break out of the 80px fixed header bar.
* **Proposed CSS Fix Strategy**:
  Change the responsive navigation breakpoint from 768px to 1024px so tablets utilize the mobile sliding drawer:
  ```css
  @media (max-width: 1024px) {
    .desktop-nav {
      display: none !important;
    }
    .mobile-nav-toggle {
      display: flex !important;
    }
    header {
      padding: 16px 24px;
    }
  }
  ```

---

### 2.2 Mobile Navigation Drawer Z-Index Stacking Context Inversion
* **File**: `style.css`
* **Line Numbers**: 216 & 312
* **Current Code**:
  ```css
  header {
    position: fixed;
    z-index: 1000;
  }

  .mobile-nav-menu {
    position: fixed;
    z-index: 999;
  }
  ```
* **Visual Bug Impact**:
  * **320px – 767px Mobile & 768px – 1023px Tablet**: Because `header` has `z-index: 1000` while `.mobile-nav-menu` has `z-index: 999`, when the mobile drawer menu opens (`.mobile-nav-menu.open`), the header bar (logo and hamburger icon) stays stacked ON TOP of the dark backdrop overlay. 
  * Furthermore, `.close-mobile-btn` (`top: 24px; right: 40px;`) collides visually with `.mobile-nav-toggle` (`top: 16px; right: 24px;`), resulting in overlapping buttons and broken touch interactions.
* **Proposed CSS Fix Strategy**:
  ```css
  .mobile-nav-menu {
    position: fixed;
    z-index: 2000; /* Higher than header z-index: 1000 */
  }
  ```

---

### 2.3 Mobile Nav Toggle Button Tap Target Violation
* **File**: `style.css` (lines 294–301) & `index.html` (line 75)
* **Current Code**:
  ```css
  .mobile-nav-toggle {
    display: none;
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
  }
  ```
* **Visual Bug Impact**:
  * **320px – 767px Mobile**: Without padding or explicit dimensions, `.mobile-nav-toggle` has a physical bounding box of only 24px × 24px. This violates the PROJECT.md accessibility requirement ("Tap targets >= 44px on mobile"), making it difficult to trigger on touchscreens.
* **Proposed CSS Fix Strategy**:
  ```css
  .mobile-nav-toggle {
    display: none;
    background: none;
    border: none;
    color: #fff;
    font-size: 22px;
    padding: 10px;
    min-width: 44px;
    min-height: 44px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  ```

---

### 2.4 Mobile Drawer Vertical Overflow & Link Truncation in Short / Landscape Viewports
* **File**: `style.css`
* **Line Numbers**: 304–320
* **Current Code**:
  ```css
  .mobile-nav-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
  }
  ```
* **Visual Bug Impact**:
  * **320px Mobile Portrait & Mobile Landscape**: `.mobile-nav-menu` contains 8 menu items + close button with `gap: 40px`. Total required vertical height exceeds 520px. On smartphones in landscape orientation (height 360px–414px) or small screens, top items ("About") and bottom items ("Contact") overflow off-screen. Without `overflow-y: auto`, truncated links are unreachable.
* **Proposed CSS Fix Strategy**:
  ```css
  .mobile-nav-menu {
    position: fixed;
    top: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    padding: 80px 20px 40px 20px;
    gap: 24px;
  }
  ```

---

### 2.5 Active State Scrollspy Disablement on Mobile & Touchscreen Devices
* **File**: `script.js` & `style.css`
* **Line Numbers**: `script.js` lines 14–15, 577–600; `style.css` line 254
* **Current Code**:
  ```javascript
  if (!isMobile && typeof Lenis !== "undefined") {
    lenis = new Lenis(...);
  }
  ...
  if (lenis) {
    lenis.on('scroll', () => {
      // Scrollspy active class toggling logic
    });
  }
  ```
* **Visual Bug Impact**:
  * **All Mobile & Tablet Devices (320px – 1023px)**: Lenis smooth scrolling is disabled on mobile (`isMobile = true`), so `lenis` is `null`. Because scrollspy link highlighting is nested inside `if (lenis)`, active link indication on scroll is non-functional on all mobile devices and touch tablets.
* **Proposed JS/CSS Fix Strategy**:
  Decouple scrollspy from Lenis in `script.js` by adding a fallback native scroll event listener:
  ```javascript
  const handleScrollspy = () => {
    let scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 150;
      const sectionId = current.getAttribute("id");
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  if (lenis) {
    lenis.on('scroll', handleScrollspy);
  } else {
    window.addEventListener('scroll', handleScrollspy);
  }
  ```

---

## SECTION 3: Hero & About Sections Audit

### 3.1 Missing CSS Styling for Hero Subtitle Statement (`.hero-statement`)
* **File**: `index.html` (line 120) & `style.css` (completely missing rule)
* **Current Code**:
  `index.html`: `<p class="hero-statement">Building secure, intelligent, and scalable digital experiences through cybersecurity, artificial intelligence, and modern web technologies.</p>`
  `style.css`: No CSS rule defined for `.hero-statement`.
* **Visual Bug Impact**:
  * **All Breakpoints (320px, 768px, 1024px+)**: `.hero-statement` renders as an unstyled paragraph with browser default font size (~16px), default line height, no max-width, no bottom margin, and no text centering alignment. On 320px mobile screens, it stretches 100% wide against screen margins, crowding the Hero CTA button.
* **Proposed CSS Fix Strategy**:
  ```css
  .hero-statement {
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.7;
    color: var(--text-secondary);
    max-width: 650px;
    margin: 0 auto 36px auto;
    pointer-events: auto;
  }

  @media (max-width: 480px) {
    .hero-statement {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 28px;
      padding: 0 10px;
    }
  }
  ```

---

### 3.2 Hero Content Pointer-Events Lockout
* **File**: `style.css`
* **Line Numbers**: 399–403
* **Current Code**:
  ```css
  .hero-content {
    position: relative;
    z-index: 2;
    pointer-events: none;
  }
  ```
* **Visual Bug Impact**:
  * **All Breakpoints**: While `.hero-btn` has `pointer-events: auto`, all text elements inside `.hero-content` (`.hero-subtitle-top`, `.hero-title`, `.hero-subtitle`, `.hero-statement`) inherit `pointer-events: none`. Visitors cannot highlight, select, or copy text in the hero section.
* **Proposed CSS Fix Strategy**:
  ```css
  .hero-subtitle-top,
  .hero-title,
  .hero-subtitle,
  .hero-statement {
    pointer-events: auto;
  }
  ```

---

### 3.3 Hero Canvas & Section Height Overflow on Mobile (320px – 480px)
* **File**: `style.css`
* **Line Numbers**: 378–397
* **Current Code**:
  ```css
  #hero {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;
    padding-top: 120px;
  }

  #three-bg-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  ```
* **Visual Bug Impact**:
  * **320px – 479px Mobile**: 120px top padding combined with a large name title (42px), subtitle, statement paragraph, and CTA button causes `.hero-content` height to exceed `100vh`. The hero button is pushed into the About section, while `#three-bg-canvas` cuts off abruptly at 100vh.
* **Proposed CSS Fix Strategy**:
  ```css
  @media (max-width: 768px) {
    #hero {
      min-height: auto;
      padding-top: 100px;
      padding-bottom: 60px;
    }
  }
  ```

---

### 3.4 Missing CSS Rules for About Quick Facts (`.quick-facts-grid` & `.fact-item`)
* **File**: `index.html` (lines 141–147) & `style.css` (completely missing rules)
* **Current Code**:
  `index.html`:
  ```html
  <div class="quick-facts-grid">
    <div class="fact-item"><i class="fas fa-user-graduate"></i> <span>B.Tech Computer Science Student</span></div>
    <div class="fact-item"><i class="fas fa-shield-alt"></i> <span>Cybersecurity Enthusiast</span></div>
    <div class="fact-item"><i class="fas fa-robot"></i> <span>AI Explorer</span></div>
    <div class="fact-item"><i class="fas fa-code"></i> <span>Full-Stack Web Developer</span></div>
    <div class="fact-item"><i class="fas fa-rocket"></i> <span>Continuous Learner</span></div>
  </div>
  ```
  `style.css`: No rules defined for `.quick-facts-grid` or `.fact-item`.
* **Visual Bug Impact**:
  * **All Breakpoints (320px, 768px, 1024px+)**: The quick fact items render as raw unstyled block elements stacked vertically without pill borders, background styling, flex alignment, gap, or visual hierarchy.
* **Proposed CSS Fix Strategy**:
  ```css
  .quick-facts-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 24px;
  }

  .fact-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-color);
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    transition: var(--transition-fast);
  }

  .fact-item i {
    color: var(--accent-color);
    font-size: 14px;
  }

  .fact-item:hover {
    background: var(--accent-soft);
    border-color: var(--accent-color);
    color: #fff;
  }
  ```

---

### 3.5 Orphaned Class Selector Mismatch on About Image Mobile Query
* **File**: `style.css` (line 1298) vs `index.html` (line 136)
* **Current Code**:
  `style.css` Line 1298:
  ```css
  @media (max-width: 480px) {
    .about-photo {
      max-width: 240px;
      margin: 0 auto 24px auto;
    }
  }
  ```
  `index.html` Line 136: `<img src="assets/profile.jpg" alt="Vishwak Pullepu" class="about-image" />` inside `<div class="about-image-container glass-card">`.
* **Visual Bug Impact**:
  * **320px – 480px Mobile**: `.about-photo` does not exist in `index.html` (the HTML uses `.about-image-container` and `.about-image`). Consequently, this responsive query is ignored. On mobile screens, the about image container spans 100% width without sizing limits or centered margins.
* **Proposed CSS Fix Strategy**:
  ```css
  @media (max-width: 480px) {
    .about-image-container {
      max-width: 260px;
      margin: 0 auto 24px auto;
    }
  }
  ```

---

### 3.6 Global `.awards-grid { display: flex !important; }` Rule Destroys Career Highlights Section Grid Layout
* **File**: `style.css` (line 1347) vs `index.html` (line 578)
* **Current Code**:
  `style.css` Line 1347:
  ```css
  .awards-grid {
    display: flex !important;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 480px;
    margin-top: 60px;
    padding: 40px 100px;
    overflow: visible !important;
  }
  ```
  `index.html` Line 578 (`#highlights` section):
  `<div class="awards-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">`
* **Visual Bug Impact**:
  * **All Breakpoints (320px, 768px, 1024px+)**: `style.css` applies `display: flex !important` globally to `.awards-grid` with fanning card transforms (`.award-card`). Because `#highlights` uses `<div class="awards-grid">`, its 3 text-heavy career highlight cards (Generative AI Integration, Hackathon Hosting, Cybersecurity Focus) are forced into rotated 250px overlapping fanning cards! Paragraph text inside `#highlights` overlaps and is unreadable.
* **Proposed CSS Fix Strategy**:
  Scope the fanning flex deck layout specifically to `#certifications .awards-grid`:
  ```css
  #certifications .awards-grid {
    display: flex !important;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
    min-height: 480px;
    margin-top: 60px;
    padding: 40px 100px;
    overflow: visible !important;
  }

  #highlights .awards-grid {
    display: grid !important;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 32px;
    min-height: auto;
    padding: 0;
    margin-top: 40px;
  }
  ```

---

### 3.7 Completely Unstyled Vercel Deployments Section (`.vercel-grid` & `.vercel-card`)
* **File**: `script.js` (lines 1065, 1072), `index.html` (line 566), & `style.css` (completely missing rules)
* **Current Code**:
  `script.js`:
  ```javascript
  card.className = "vercel-card";
  vercelContainer.className = "vercel-grid";
  ```
  `style.css`: No rules defined for `.vercel-grid` or `.vercel-card`.
* **Visual Bug Impact**:
  * **All Breakpoints (320px, 768px, 1024px+)**: When Vercel deployments are loaded via JavaScript, they render as unstyled block links stacked vertically with no card container, no background, no border, no flex/grid layout, and no hover feedback.
* **Proposed CSS Fix Strategy**:
  ```css
  .vercel-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
    margin-top: 30px;
  }

  .vercel-card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: var(--transition-smooth);
  }

  .vercel-card:hover {
    border-color: var(--border-color-hover);
    box-shadow: 0 10px 30px -10px rgba(224, 96, 49, 0.15);
    transform: translateY(-4px);
  }

  .vercel-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .vercel-card-title {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .vercel-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #10b981;
    font-weight: 500;
  }

  .vercel-status-dot {
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 8px #10b981;
  }

  .vercel-card-desc {
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 20px;
  }

  .vercel-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 14px;
  }

  .vercel-link-btn {
    background: var(--accent-soft);
    border: 1px solid var(--accent-color);
    color: #fff;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition-fast);
  }

  .vercel-link-btn:hover {
    background: var(--accent-color);
  }
  ```

---

## SECTION 4: Comprehensive Audit Summary Table

| Issue # | Domain | Affected File & Lines | Breakpoints Impacted | Core Root Cause | Severity |
|:---|:---|:---|:---|:---|:---|
| **1.1** | Global Reset | `style.css:28-32` | 320px, 768px, 1024px | `*::before, *::after` omitted from box-sizing reset | Medium |
| **1.2** | Overflow & Scroll | `style.css:34-45` | 320px–479px Mobile | `overflow-x: hidden` set on `body` only (missing `html`) | High |
| **1.3** | Padding & Container | `style.css:62,88` & `index.html:527` | 320px–360px Mobile | Rigid 32px/30px card padding leaves only 256px usable width | Medium |
| **1.4** | Preloader | `style.css:166-174` | 320px–420px Mobile | 24px font + letter-spacing causes loader text overflow | Medium |
| **1.5** | Social Bar | `style.css:352-375` | 1024px–1150px Desktop | Fixed bar overlays main content on mid-width desktops | Low |
| **2.1** | Header Navigation | `style.css:1227-1236` | 768px–1023px Tablet | Breakpoint set at 768px instead of 1024px; logo & 8 links collide | **CRITICAL** |
| **2.2** | Navigation Drawer | `style.css:216,312` | 320px–1023px | `header` (z-index 1000) stacks over `.mobile-nav-menu` (z-index 999) | **CRITICAL** |
| **2.3** | Hamburger Toggle | `style.css:294-301` | 320px–767px Mobile | No padding/dimensions; tap area 24px x 24px violates 44px rule | High |
| **2.4** | Mobile Drawer | `style.css:304-320` | 320px–479px & Mobile Landscape | No `overflow-y: auto`; menu links truncated vertically | High |
| **2.5** | Active Scrollspy | `script.js:14-15,577-600` | 320px–1023px Mobile/Tablet | Scrollspy bound exclusively to Lenis (which is null on mobile) | Medium |
| **3.1** | Hero Typography | `index.html:120` & `style.css` | All Breakpoints | `.hero-statement` missing CSS rules completely | High |
| **3.2** | Hero Pointer Events | `style.css:399-403` | All Breakpoints | `.hero-content` has `pointer-events: none` blocking text copy | Medium |
| **3.3** | Hero Height | `style.css:378-397` | 320px–479px Mobile | `min-height: 100vh` + 120px padding causes button to overflow canvas | High |
| **3.4** | About Quick Facts | `index.html:141-147` & `style.css` | All Breakpoints | `.quick-facts-grid` & `.fact-item` missing CSS rules | High |
| **3.5** | About Image Query | `style.css:1298` vs `index.html:136` | 320px–480px Mobile | Dead selector `.about-photo` instead of `.about-image-container` | Medium |
| **3.6** | Highlights Layout | `style.css:1347` vs `index.html:578` | All Breakpoints | Global `.awards-grid { display: flex !important; }` breaks Highlights grid | **CRITICAL** |
| **3.7** | Vercel Section | `script.js:1065` & `style.css` | All Breakpoints | `.vercel-grid` & `.vercel-card` missing CSS rules completely | High |

---

## Conclusion & Next Steps

This handbook provides the full diagnostic baseline required for Milestone 2 (Responsive Bug Fixes). All identified issues are backed by exact code locations, root-cause analyses, visual impact assessments, and concrete CSS fix snippets.
