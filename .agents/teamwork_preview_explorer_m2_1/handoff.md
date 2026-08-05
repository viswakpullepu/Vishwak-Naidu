# Handoff Report

## 1. Observation
I directly observed the following in the portfolio website workspace:

1. **Undeclared global `lenis`**:
   - In `script.js` (lines 12-13): 
     ```javascript
     if (!isMobile && typeof Lenis !== "undefined") {
       lenis = new Lenis({
     ```
   - In `script.js` (lines 518-519):
     ```javascript
     if (lenis) {
       lenis.on('scroll', () => {
     ```
   - In `script.js` (lines 756-758):
     ```javascript
     if (lenis) {
       try { lenis.stop(); } catch(e) {}
     ```
   - In `script.js` (lines 808-810):
     ```javascript
     if (lenis) {
       try { lenis.start(); } catch(e) {}
     ```
   No declaration statement (`var`, `let`, or `const`) was found for `lenis` anywhere in the file.

2. **Form `novalidate` bypass**:
   - In `index.html` (line 619): `<form id="portfolio-contact-form" novalidate>`
   - In `script.js` (lines 553-642): The submission handler checks only `emailStr` and `phoneStr` with regex. Name (`form-name`) and message (`form-message`) are never checked for empty strings.

3. **Three.js Animation loop**:
   - In `script.js` (lines 419-507): The function `animate()` runs continuously via `requestAnimationFrame(animate)`, performing loops of 2000 iterations every frame with trigonometric operations. There is no `IntersectionObserver` or visibility check to pause rendering.

4. **Undefined CSS custom properties**:
   - In `style.css` (lines 1364, 1371, 1846): `box-shadow` rules contain `rgba(var(--accent-color-rgb), 0.25)`.
   - In `style.css` (line 2181): `font-family: var(--font-main);`
   - Review of `:root` in `style.css` (lines 4-25) confirmed neither `--accent-color-rgb` nor `--font-main` are declared.

5. **Form Submission timer overlaps**:
   - In `script.js` (lines 626-704): Timeline starts at 1.5s delay with 3.5s flight animation (total 5.0s).
   - In `script.js` (lines 724-730): An unconditional reset timer is set to 3.0s:
     ```javascript
     setTimeout(() => {
       btnText.textContent = originalText;
       btn.style.background = "";
       btn.style.borderColor = "";
       icon.className = "fas fa-paper-plane";
       btn.disabled = false;
     }, 3000);
     ```

6. **Unreferenced/Dead Code File**:
   - File path: `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu\main_chunk.js` (14,471,038 bytes).
   - A search of the entire codebase for `"main_chunk"` returned no imports or tags loading this file.

7. **Double Cursor**:
   - Custom trailing cursor elements are set up in `script.js` (lines 201-245) and styled in `style.css` (lines 100-144). No `cursor: none;` rule is declared in `style.css` on `body` or `html`.

8. **Broken Placeholders**:
   - In `index.html` (line 274): `<div class="glass-card award-card" data-pdf="#">`
   - In `index.html` (line 689): `<a href="#" class="hero-btn" ...><span>Download Resume</span></a>`

9. **TagCloud FOUC**:
   - In `script.js` (lines 1120-1130): TagCloud escapes HTML, and a `100ms` `setTimeout` parses it back.

10. **Spinner Loops**:
    - In `script.js` (lines 1016-1021): The catch block only updates `loadingIndicator` (for GitHub), but ignores `vercelLoading` and the spinner inside `.calendar`.

---

## 2. Logic Chain
1. **Critical ReferenceError**: Because `lenis` is never declared, it will only exist as a property of `window` if line 13 executes. On mobile devices, line 13 is skipped (`isMobile` is true). When lines 518, 756, and 808 attempt to evaluate `if (lenis)` on mobile, the JavaScript engine throws `ReferenceError: lenis is not defined`.
   - On lines 756/808, the click event handler is async and has no local try-catch around `if (lenis)`. This ReferenceError immediately terminates the handler, preventing `setTimeout` (line 761) from running. Therefore, the certificate modals are completely non-functional on mobile devices.
   - On line 518, the ScrollSpy logic throws a ReferenceError which is caught, but breaks section-link highlighting on mobile.

2. **Form Bypass**: Because `<form>` has `novalidate` and `script.js` does not validate if `name` or `message` is empty, empty form submissions successfully execute.

3. **Performance Issues**: Because Three.js performs 2000 calculations per frame inside `animate()` without an `IntersectionObserver` to cancel `requestAnimationFrame`, rendering runs continuously in the background, wasting GPU/CPU.

4. **CSS Failures**: Because `--accent-color-rgb` and `--font-main` are undefined in `:root`, browsers discard the box-shadow styling on certifications/contact button, and tooltips fall back to default serif/sans-serif fonts.

5. **Timer Overlaps**: Because the unconditional button reset fires at 3.0s, it overrides the visual text/icons in the middle of the 5.0s success animation, resulting in a mismatched text ("Send Message") and icon (checkmark) state.

6. **Dead Code**: Since `main_chunk.js` is a 14.4MB webpack bundle that is never loaded or referenced, it is dead weight in the repository.

---

## 3. Caveats
- No external network requests were made to test the live API endpoints (e.g. GitHub and Formspree endpoints) due to the CODE_ONLY network restriction.
- Visual inspection of styling was done purely via source code analysis.
- It is assumed that the files in the workspace root represent the production-ready build.

---

## 4. Conclusion
The portfolio website contains major functional bugs, performance bottlenecks, and visual/styling quirks:
1. The certificate modals are completely broken on mobile and touch devices due to an unhandled `ReferenceError: lenis is not defined`.
2. The contact form suffers from validation bypasses (allowing blank messages) and timer overlaps (causing broken button states).
3. The Three.js canvas runs continuously, leaking GPU/CPU resources on all pages.
4. Custom CSS properties are undefined, breaking box-shadow animations.
5. `main_chunk.js` is a massive 14.4MB dead file that should be removed.

---

## 5. Verification Method
1. **Static Analysis of `lenis`**: Inspect `script.js` lines 12-14 and 755-760. Confirm `lenis` is never declared.
2. **Form Validation Bypass**: Inspect `index.html` line 619 (`novalidate`) and search `script.js` for references to `name` or `message` validation.
3. **Three.js Performance**: Verify `script.js` lines 419-507 lacks scroll intersection checks for canvas animation.
4. **Undefined CSS variables**: Inspect `:root` in `style.css` and verify `--accent-color-rgb` and `--font-main` are missing.
5. **Horizontal Scroll Quirks**: View `style.css` line 1886. Confirm `.awards-grid` lacks `display: flex !important`.
