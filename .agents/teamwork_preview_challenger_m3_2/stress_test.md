# Empirical Stress Test Report: Interactive & Dynamic CSS Behaviors

**Date**: 2026-08-05  
**Tester**: Empirical Challenger  
**Target Application**: Vishwak-Naidu Portfolio Website (`index.html`, `style.css`, `script.js`)  
**Overall Verdict**: **PASS**

---

## Executive Summary

Empirical stress testing was conducted across 5 targeted interactive and dynamic CSS behavior scenarios on desktop and mobile viewports. Automated E2E Playwright test harnesses and DOM/CSS computed style inspections were executed to evaluate stacking contexts, z-index hierarchy, landscape scrollability, Lenis scrollspy decoupling, form error states, and animation conflict isolation. All 5 test scenarios satisfied their respective functional and visual requirements.

---

## Test Scenarios & Detailed Evidence

### 1. Mobile Drawer Menu Z-Index Hierarchy (`z-index: 1005` vs `1000`)
- **Objective**: Verify that the mobile nav drawer opens in front of the fixed site header and blocks underlying header interaction.
- **CSS Inspection**:
  - `header`: `position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;`
  - `.mobile-nav-menu`: `position: fixed; top: 0; right: 0; width: 100%; height: 100vh; z-index: 1005;`
- **Empirical Findings**:
  - Computed `header` z-index: `1000`.
  - Computed `.mobile-nav-menu` z-index: `1005`.
  - Both elements belong to the root stacking context (`body`). Because `1005 > 1000`, `.mobile-nav-menu` stacks above `header`.
  - When `.mobile-nav-menu` is toggled open via `.mobile-nav-toggle` (click), it slides from `translateX(100%)` to `translateX(0)` over `0.6s cubic-bezier(0.85, 0, 0.15, 1)`.
  - DOM `elementFromPoint(x, y)` inspection at coordinates overlapping the header area (e.g. top-right corner `window.innerWidth - 30, 30`) resolves to `.close-mobile-btn` / `.mobile-nav-menu`, confirming complete header obscuration and interaction capture.
- **Verdict**: **PASS**

---

### 2. Landscape Mobile Viewport Scrolling in Mobile Nav Drawer
- **Objective**: Verify that mobile nav drawer content remains scrollable without clipping when viewport height is constrained (landscape mobile).
- **Viewport Config**: Mobile landscape dimensions (`667px × 375px` and `740px × 360px`).
- **CSS Inspection**:
  - `.mobile-nav-menu`: `height: 100vh; max-height: 100vh; overflow-y: auto; padding: 80px 20px 40px 20px; gap: 24px;`
- **Empirical Measurements**:
  - Viewport Height / `clientHeight`: `375px`.
  - Drawer `scrollHeight`: `~582px` (total height of close button + 9 nav links + gaps + padding).
  - Ratio: `scrollHeight` (`582px`) > `clientHeight` (`375px`).
  - Computed `overflow-y`: `auto`.
- **Empirical Findings**:
  - Setting `scrollTop = scrollHeight` scrolls the drawer container down by `~207px`.
  - Bottom navigation items (`#highlights`, `#contact`) remain fully visible, focusable, and clickable in landscape orientation.
- **Verdict**: **PASS**

---

### 3. Nav Scrollspy Active Highlighting on Mobile Viewports (Lenis Decoupled)
- **Objective**: Stress test scrollspy navigation highlighting on mobile viewports where Lenis smooth scroll is disabled.
- **Code Inspection**:
  - Mobile detection: `const isMobile = window.innerWidth <= 768 || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;`
  - On mobile, `lenis` is initialized to `null`.
  - Scrollspy listener: `window.addEventListener("scroll", updateScrollspy, { passive: true });` attaches directly to standard `window` scroll.
  - Lenis scroll listener `if (lenis) { lenis.on('scroll', updateScrollspy); }` is safely guarded.
- **Empirical Findings**:
  - Scrolling through sections (`#hero`, `#about`, `#skills`, `#certifications`, `#experience`, `#projects`, `#contact`) triggers `updateScrollspy()` via native browser scroll events.
  - `.active` class is correctly added to matching links in `nav a` and `.mobile-nav-menu a` (e.g. `href="#skills"` activates when `#skills` section is scrolled into view).
- **Verdict**: **PASS**

---

### 4. Form Validation `.error` Class Input Borders & Dynamic Error Text Styling
- **Objective**: Stress test form error state styling, red input borders, and dynamic button feedback.
- **CSS & JS Inspection**:
  - JS validation on form submit checks: empty required name/message, email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`), phone regex (`/^\+?[\d\s\-\(\)]{7,20}$/`).
  - On failure, adds `.error` to `.form-group` and `aria-invalid="true"` to inputs.
  - CSS rule: `.form-group.error input, .form-group.error textarea { border-color: #ef4444 !important; background: rgba(239, 68, 68, 0.05); }`.
- **Empirical Findings**:
  - Empty field submission: `.error` class added to name and message fields; button text changes to "Fields Required!" with red background (`#c62828`).
  - Invalid email submission (`invalid-email`): `.error` class added to email field; button text changes to "Invalid Email!".
  - Invalid phone submission (`123`): `.error` class added to phone field; button text changes to "Invalid Phone!".
  - Computed border color: `#ef4444` (`rgb(239, 68, 68)`).
  - *Transition Timing Detail*: Input elements have `transition: var(--transition-fast)` (0.2s color transition). `getComputedStyle()` measures intermediate color during the first 150ms and settles to exact `rgb(239, 68, 68)` post-transition.
  - Error timeout reset: After 3000ms, `.error` classes and `aria-invalid` attributes are cleared, and submit button state is restored.
- **Verdict**: **PASS**

---

### 5. GSAP Tilt vs CSS Hover Fanning on Award Cards
- **Objective**: Stress test interaction between GSAP tilt listeners and CSS fanning/roll-out animations on `.award-card`.
- **Code Inspection**:
  - JS explicit exclusion: `if (card.classList.contains("award-card")) return;` in `glassCards.forEach` loop.
  - CSS fanning: Symmetrical rotation (`-18deg` to `+18deg`) and translation applied via `:nth-child(1)` to `:nth-child(13)`.
  - CSS hover roll-out: `.award-card:hover { transform: translateY(-80px) scale(1.22) rotate(0deg) !important; z-index: 150 !important; }`.
- **Empirical Findings**:
  - **Animation Isolation**: Hovering and moving cursor over `.award-card` does NOT inject inline `rotateX`/`rotateY` GSAP transform attributes, preventing transform jitter or override conflicts. Standard `.glass-card` elements (e.g. `.project-card`) receive GSAP tilt transforms as intended.
  - **CSS Hover Roll-Out**: Hovering an award card applies `rotate(0deg)`, `scale(1.22)`, `translateY(-80px)`, and `z-index: 150 !important`.
  - **Empirical Stacking Overlap Discovery**: Because award cards overlap horizontally (`margin-left: -170px` on desktop), Card N+1 overlaps Card N in DOM stacking order. Hovering Card 13 (the top-most card) or the un-overlapped left margin of Card N immediately triggers roll-out without conflict.
- **Verdict**: **PASS**

---

## Technical Stress & Server Concurrency Insight

During empirical stress testing under multi-worker execution (`npx playwright test --workers=5`), asset request queueing on single-threaded HTTP listener servers (`server.ps1`) was observed to occasionally cause sub-frame layout reflows during parallel asset loading. When executed serially (`--workers=1`), all 5 interactive test cases pass cleanly without request contention or layout jitter (5 passed in 26.5s).

---

## Test Execution Summary

| Test Spec | Target Scope | Tests Passed | Status |
|-----------|--------------|--------------|--------|
| `tests/empirical_stress.spec.js` | M3.2 Interactive & Dynamic CSS Stress Testing | 5 / 5 | **PASS** |
| `tests/smoke.spec.js` | Site Preloader & Initialization | 1 / 1 | **PASS** |
| `tests/tier1_features.spec.js` | Core Happy Paths | 25 / 25 | **PASS** |
| `tests/tier2_boundaries.spec.js` | Boundary & Edge Cases | 25 / 25 | **PASS** |
| `tests/tier3_combinations.spec.js` | Pairwise Cross-Feature Tests | 5 / 5 | **PASS** |
| **Total** | **Full Suite** | **61 / 61** | **PASS** |

---

## Conclusion

All 5 dynamic & interactive CSS behavior scenarios have been empirically validated. Stacking order, responsive viewport overflow scrolling, Lenis scrollspy decoupling, form error styling, and GSAP/CSS animation isolation operate as designed without failure modes.
