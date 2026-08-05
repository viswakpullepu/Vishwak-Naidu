# Empirical Stress Test Report: Responsive Layout & Container Boundaries

**Date**: 2026-08-05  
**Auditor**: EMPIRICAL CHALLENGER (`teamwork_preview_challenger_m3_1`)  
**Target Milestone**: M3 Responsive Layout & Container Boundaries  
**Overall Verdict**: **FAIL** (4 of 5 requirements PASS; 1 requirement FAILS due to missing `word-break: break-word` CSS rule on email text elements).

---

## Executive Summary

An empirical stress test was conducted on the portfolio website across 7 target viewports (`320px`, `360px`, `414px`, `768px`, `1024px`, `1280px`, `1440px`) using Playwright headless browser test harnesses. Automated measurement scripts evaluated layout bounds, scroll overflow, computed CSS properties, and geometric element alignment.

| # | Stress Test Dimension | Target Condition | Empirical Result | Status |
|---|-----------------------|------------------|------------------|--------|
| **1** | Horizontal Scroll Protection | No horizontal overflow/scrollbar across 320px–1440px | `scrollWidth === clientWidth` at all 7 viewports (320px to 1440px) | **PASS** |
| **2** | Projects Grid Layout | `minmax(min(280px, 100%), 1fr)` at 320px width | Container: 292px, Cards: 292px, 0px overflow | **PASS** |
| **3** | Skills 3D TagCloud Bounds | Canvas contained within 320px viewport without 32px overflow | Sphere diameter: 240px, Wrapper: `overflow: hidden`, 0px overflow | **PASS** |
| **4** | Experience Timeline Alignment | Vertical line & dot center alignment across mobile & desktop | Delta: 0px–1px (within 3px tolerance) across 320px–1440px | **PASS** |
| **5a**| Glass Card Mobile Padding | Scaled to `20px 16px` on small screens (< 480px) | Computed padding: `20px 16px 20px 16px` | **PASS** |
| **5b**| Email Text Wrapping | `word-break: break-word` on email elements | Computed `wordBreak: normal`, `overflowWrap: normal` | **FAIL** |

---

## Detailed Empirical Evidence & Findings

### Requirement 1: Horizontal Scroll Overflow Protection
- **Test Methodology**: Playwright automated viewport resizing at `320px`, `360px`, `414px`, `768px`, `1024px`, `1280px`, `1440px` and DOM boundary inspection.
- **Empirical Results**:
  - `320px`: `docWidth = 320px`, `scrollWidth = 320px`, `hasHorizontalScrollbar = false`.
  - `360px`: `docWidth = 360px`, `scrollWidth = 360px`, `hasHorizontalScrollbar = false`.
  - `414px`: `docWidth = 414px`, `scrollWidth = 414px`, `hasHorizontalScrollbar = false`.
  - `768px`: `docWidth = 768px`, `scrollWidth = 768px`, `hasHorizontalScrollbar = false`.
  - `1024px`: `docWidth = 1024px`, `scrollWidth = 1024px`, `hasHorizontalScrollbar = false`.
  - `1280px`: `docWidth = 1280px`, `scrollWidth = 1280px`, `hasHorizontalScrollbar = false`.
  - `1440px`: `docWidth = 1440px`, `scrollWidth = 1440px`, `hasHorizontalScrollbar = false`.
- **Verdict**: **PASS**. Overflow protection (`html, body { width: 100%; max-width: 100%; overflow-x: hidden; }`) effectively prevents horizontal drift across all standard breakpoints.

### Requirement 2: Stress Test Projects Grid Layout at 320px Width
- **Test Methodology**: Set viewport to 320px width and measure computed `.projects-grid` and `.project-card` bounding rectangles.
- **Empirical Results**:
  - Grid container width: `292px` (320px viewport minus 2x14px section padding).
  - Computed `grid-template-columns`: `292px` (single column rule `@media (max-width: 480px) { .projects-grid { grid-template-columns: 1fr; } }`).
  - Project card width: `292px`, card right edge: `306px` (well inside 320px screen width).
- **Verdict**: **PASS**. Grid cards collapse cleanly to 1fr without overflowing the container or screen.

### Requirement 3: Stress Test Skills 3D TagCloud Canvas Bounds at 320px Screen Width
- **Test Methodology**: Set viewport to 320px width, measure `.sphere-wrapper`, `#skill-sphere`, and `.tagcloud` bounding boxes.
- **Empirical Results**:
  - Dynamic JavaScript radius calculation in `script.js` line 1237 (`window.innerWidth < 360 ? 120 : ...`) sets sphere radius to `120px` (diameter `240px`).
  - CSS rule `@media (max-width: 360px)` applies `transform: scale(0.85)` to `.sphere-wrapper`.
  - `.sphere-wrapper` computed properties: `overflow: hidden`, `width: 100%`, `max-width: 100%`.
  - Bounding box: canvas left = `35.9px`, canvas right = `284.1px` inside 320px viewport.
- **Verdict**: **PASS**. The historical 32px canvas overflow issue is completely resolved on 320px screens.

### Requirement 4: Stress Test Experience Timeline Line & Dot Positioning
- **Test Methodology**: Measure absolute geometric center X coordinate of the vertical line (`.timeline-container::before`) versus the center X coordinate of all `.timeline-dot` elements across 320px, 360px, 414px, 768px, 1024px, 1280px, 1440px viewports.
- **Empirical Results**:
  - `320px`: Line X = `26px`, Dot X = `25px`, Delta = `1px` (within 3px tolerance).
  - `360px`: Line X = `26px`, Dot X = `25px`, Delta = `1px` (within 3px tolerance).
  - `414px`: Line X = `26px`, Dot X = `25px`, Delta = `1px` (within 3px tolerance).
  - `768px`: Line X = `36px`, Dot X = `36px`, Delta = `0px`.
  - `1024px`: Line X = `512px`, Dot X = `512px`, Delta = `0px`.
  - `1280px`: Line X = `640px`, Dot X = `640px`, Delta = `0px`.
  - `1440px`: Line X = `720px`, Dot X = `720px`, Delta = `0px`.
- **Verdict**: **PASS**. Vertical line and timeline dots maintain strict visual alignment across mobile, tablet, and desktop layouts.

### Requirement 5: Glass Card Padding Scaling & Email Text Wrapping
- **5a: Glass Card Padding Scaling**:
  - **Empirical Results**: Base `.glass-card` computed styles at 360px viewport: `padding-top: 20px`, `padding-right: 16px`, `padding-bottom: 20px`, `padding-left: 16px`.
  - **Verdict**: **PASS**.
- **5b: Email Text Wrapping**:
  - **Empirical Results**: Evaluated computed CSS properties on `a[href^="mailto:viswakpullepu1@gmail.com"]` and parent `.detail-value` in `style.css`:
    - `word-break`: `normal`
    - `overflow-wrap`: `normal`
  - **Defect Impact**: Neither `word-break: break-word` nor `overflow-wrap: break-word` is defined in `style.css` for `.detail-value` or email links. While `viswakpullepu1@gmail.com` currently fits within 320px, longer email addresses (or narrow mobile card containers) will break out of their container without wrapping.
  - **Verdict**: **FAIL**.

---

## Actionable Recommendations for Remediation

To bring Requirement 5b into full compliance:
1. Update `style.css` at line 1319 (`.detail-value`) or add an explicit email rule:
   ```css
   .detail-value a[href^="mailto:"],
   .detail-value {
     word-break: break-word;
     overflow-wrap: break-word;
   }
   ```
2. Re-run Playwright spec `tests/m3_1_empirical_stress.spec.js` to verify test 5b passes.
