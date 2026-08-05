# Handoff Report — M3.1 Empirical Stress Testing

## 1. Observation
- **Test File Created**: `tests/m3_1_empirical_stress.spec.js`
- **Execution Command**: `npx playwright test tests/m3_1_empirical_stress.spec.js --project=chromium`
- **Empirical Findings by Requirement**:
  1. **Horizontal Scroll Protection**:
     - Viewports: `320px`, `360px`, `414px`, `768px`, `1024px`, `1280px`, `1440px`.
     - `scrollWidth === clientWidth` at all 7 viewports. No horizontal scrollbar detected.
  2. **Projects Grid Layout at 320px Width**:
     - `.projects-grid` width = `292px` (320px viewport - 2x14px section padding).
     - Card width = `292px`, card right = `306px` <= `320px`.
  3. **Skills 3D TagCloud Canvas Bounds at 320px Width**:
     - Dynamic radius = `120px` (diameter `240px`) via `script.js:1237`.
     - `.sphere-wrapper` has `overflow: hidden`, `max-width: 100%`, `transform: scale(0.85)` at `<360px`.
     - Bounding box: left = `35.9px`, right = `284.1px` inside `320px` viewport.
  4. **Experience Timeline Line & Dot Positioning**:
     - Mobile (320px–414px): line center = `26px`, dot center = `25px` (delta = `1px`).
     - Tablet (768px): line center = `36px`, dot center = `36px` (delta = `0px`).
     - Desktop (1024px–1440px): line center = 50% container center (512px, 640px, 720px), dot center = 50% container center (delta = `0px`).
  5. **Glass Card Padding & Email Text Wrapping**:
     - Base `.glass-card` padding at 360px: `20px 16px 20px 16px` (PASS).
     - Email text computed CSS on `a[href^="mailto:viswakpullepu1@gmail.com"]` and `.detail-value`: `wordBreak: normal`, `overflowWrap: normal` (FAIL).

## 2. Logic Chain
1. We designed and executed an empirical Playwright test suite (`tests/m3_1_empirical_stress.spec.js`) covering all 5 layout and container boundary requirements across 7 viewports (320px to 1440px).
2. Requirements 1, 2, 3, 4, and 5a passed all assertions cleanly with exact geometric measurements.
3. Requirement 5b failed because `style.css` does not include `word-break: break-word` or `overflow-wrap: break-word` rules for `.detail-value` or `a[href^="mailto:"]`.
4. As an EMPIRICAL CHALLENGER, findings must be reported based on exact test evidence without modifying source code directly.

## 3. Caveats
- WebKit browser binary was not installed in the local Playwright environment, so tests were run using Chromium (Desktop Chrome engine), which matches standard modern browser layout engine calculations.
- Long email addresses will overflow if container width is constrained below text length, unless `word-break: break-word` is added to CSS.

## 4. Conclusion
Overall Verdict: **FAIL**. Requirements 1 through 5a passed all empirical stress tests, but Requirement 5b failed due to missing `word-break: break-word;` styling on email text elements.

## 5. Verification Method
1. Run Playwright test spec:
   ```bash
   npx playwright test tests/m3_1_empirical_stress.spec.js --project=chromium
   ```
2. Inspect test output or run individual test for email wrapping:
   ```bash
   npx playwright test tests/m3_1_empirical_stress.spec.js -g "5b. Email text wrapping" --project=chromium
   ```
3. Inspect `style.css` line 1319 to verify presence of `word-break: break-word`.
