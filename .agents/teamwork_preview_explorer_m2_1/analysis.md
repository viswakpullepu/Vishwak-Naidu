# Codebase Audit Report: Portfolio Website
**Target Workspace:** `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu`
**Date:** 2026-06-23

---

## Executive Summary
This report presents a detailed read-only audit of the portfolio website files (`index.html`, `style.css`, `script.js`, `assets.js`, and `main_chunk.js`). The audit revealed critical JavaScript errors that completely break the certificate modals on mobile, contact form validation bypasses that allow empty messages, multiple CSS syntax errors (such as undefined custom properties that disable box shadows), performance issues including a massive 14.4MB dead code file (`main_chunk.js`), a continuous rendering CPU/GPU leak in the Three.js particle loop, and a double-cursor visual glitch on desktop.

---

## 1. Syntax Flaws, Logic Bugs, and Dead Code

### 1.1. Critical ReferenceError: Undeclared Global Variable `lenis`
* **File:** `script.js` (Lines 13, 518, 756, 808)
* **Code Snippet:**
  ```javascript
  // Line 12-13
  if (!isMobile && typeof Lenis !== "undefined") {
    lenis = new Lenis({ ... });
  }
  ```
* **Explanation:** The variable `lenis` is assigned on line 13 without a declaring keyword (`var`, `let`, `const`), making it an implicit global property on `window` only if that block executes. On mobile (or if the Lenis CDN fails), `isMobile` is true, so the block is skipped. When the scripts subsequently evaluate `if (lenis)` on lines 518, 756, and 808, they throw `ReferenceError: lenis is not defined`.
* **Impact:** 
  1. **Certificate modals are completely broken on mobile:** Clicking any award card crashes the click event handler inside `script.js` before registering the modal fade-in `setTimeout`.
  2. **ScrollSpy is disabled:** The active navigation link tracking breaks on mobile because the scroll spy listener is only attached to Lenis's custom scroll event.
* **Proposed Fix:** Declare `lenis` explicitly at the top of the scope: `let lenis = null;`. Change all checks from `if (lenis)` to `if (typeof lenis !== 'undefined' && lenis)`.

### 1.2. Contact Form Validation Bypass (`novalidate` + Missing JS checks)
* **File:** `index.html` (Line 619) & `script.js` (Lines 553-607)
* **Explanation:** The `<form>` tag is configured with the `novalidate` attribute, which disables native HTML5 validation. The submit handler in `script.js` validates only the formats of `email` and `phone` using regex. It does not check if the required `name` or `message` fields are empty.
* **Impact:** Users can submit empty name and message fields, which will successfully transmit to Formspree and display a "Message Sent!" overlay.
* **Proposed Fix:** Add validation checks in the submit listener in `script.js` to ensure `name` and `message` strings are not empty/whitespace:
  ```javascript
  if (!formData.get("name").trim() || !formData.get("message").trim()) {
    // Show validation error
    return;
  }
  ```

### 1.3. NVIDIA Jetson Nano Certificate Card Placeholder Bug
* **File:** `index.html` (Line 274) & `script.js` (Lines 745-780)
* **Explanation:** The card has `data-pdf="#"`. Clicking the card triggers the modal click handler. Because `#` does not end in `.pdf`, `isPdf` is false, and the script sets the image source: `certModalImg.src = "#"`.
* **Impact:** The browser fails to load `#` as an image, displaying a broken image placeholder in the modal.
* **Proposed Fix:** Provide the correct path to the NVIDIA certificate asset in `data-pdf`.

### 1.4. Dead File Bloat: `main_chunk.js` (14.4MB)
* **File:** `main_chunk.js` (Entire file)
* **Explanation:** This massive 14.4MB compiled React webpack bundle is left in the repository root but is never imported, linked, or executed in `index.html` or any script.
* **Impact:** Unnecessary repository bloat, slower cloning/git operations, and poor codebase hygiene.
* **Proposed Fix:** Delete `main_chunk.js` from the repository root.

### 1.5. Dead Selectors in CSS and JS
* **File:** `style.css` (multiple lines) & `script.js` (line 236)
* **Explanation:** Selectors such as `.timeline-item-content`, `.gallery-item`, `.tech-item`, and `.art-slide` are defined in the CSS and queried in the JS (for custom cursor hovers) but do not exist in `index.html`.
* **Impact:** Unnecessary stylesheet bloat and script query overhead.
* **Proposed Fix:** Clean up unused CSS rules and remove selectors from the `hoverables` query list in `script.js`.

---

## 2. Performance, Asset Loads, and Resource Leaks

### 2.1. Continuous CPU/GPU Rendering Leak in Three.js Particle Loop
* **File:** `script.js` (Lines 419-511)
* **Explanation:** The WebGL particle system runs `requestAnimationFrame(animate)` continuously. The animation loop iterates `2000` times every single frame to interpolate vertices and run mathematical ripples (`Math.sin`, `Math.cos`) and cursor repel distance calculations (`Math.sqrt`, `Math.pow`).
* **Impact:** High CPU/GPU usage even when the user has scrolled past the Hero section and the canvas is completely invisible. This causes battery drain and thermal throttling, particularly on mobile.
* **Proposed Fix:** Implement an `IntersectionObserver` to call `cancelAnimationFrame` when `#hero` is out of the viewport, and restart the loop when it re-enters:
  ```javascript
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Start loop
      } else {
        // Stop loop
      }
    });
  });
  observer.observe(document.getElementById("hero"));
  ```

### 2.2. Overwhelming Network Overhead (9 External CDNs)
* **File:** `index.html` (Lines 12, 15, 18, 736-745)
* **Explanation:** The page loads assets and scripts from multiple external domains (`cdnjs.cloudflare.com`, `unpkg.com`, `cdn.jsdelivr.net`, etc.). 
* **Impact:** Significant page speed delays due to multiple DNS lookups, TCP handshakes, and SSL negotiations. If any CDN is blocked or offline, critical features of the portfolio (scroll animations, WebGL, 3D sphere) break.
* **Proposed Fix:** Download CDN assets and bundle/minify them locally or host them under a single CDN domain.

### 2.3. Infinite Loading Spinners on API rate limit / Network Error
* **File:** `script.js` (Lines 867, 964-1021)
* **Explanation:** 
  - If the GitHub repo fetch fails (e.g., API rate limit reached), the `.catch()` block (line 1016) does not hide or update the `#vercel-loading` element.
  - If the `GitHubCalendar` script fails (line 867), the loading state inside `.calendar` is never removed.
* **Impact:** Users are left with spinners that rotate indefinitely.
* **Proposed Fix:** Ensure all catch blocks hide the loading elements and display user-friendly error messages (e.g., `vercelLoading.innerHTML = "<p>Unable to load deployments.</p>"`).

### 2.4. TagCloud HTML escaping Workaround FOUC
* **File:** `script.js` (Lines 1120-1130)
* **Explanation:** The TagCloud library escapes HTML strings by default, displaying raw code like `<i class="...">React</i>` on load. The script bypasses this via a `100ms` timeout to re-inject innerHTML.
* **Impact:** A visible Flash of Unstyled Content (FOUC) where raw code text floats in the sphere on page load. If the page lags and TagCloud loads after 100ms, the replacement fails, leaving raw code strings permanently visible.
* **Proposed Fix:** Set the TagCloud wrapper's opacity to `0` initially, and fade it in using CSS/GSAP only after the innerHTML replacement completes.

---

## 3. Structural Layout, Styling Quirks, and Visual Glitches

### 3.1. Double Cursor Visual Glitch on Desktop
* **File:** `style.css` (Lines 100-144) & `script.js` (Lines 201-245)
* **Explanation:** The code renders a custom pointer dot and trailing ring, but fails to hide the native OS cursor.
* **Impact:** Two cursors are visible simultaneously on desktop screens, which looks unpolished and visually cluttered.
* **Proposed Fix:** Apply `cursor: none;` to `html, body` and interactive elements in `style.css` on desktop views:
  ```css
  @media (min-width: 769px) {
    html, body, a, button, input, textarea {
      cursor: none !important;
    }
  }
  ```

### 3.2. Undefined CSS Custom Property: `--accent-color-rgb`
* **File:** `style.css` (Lines 1364, 1371, 1846)
* **Explanation:** The property `box-shadow` uses `rgba(var(--accent-color-rgb), 0.25)` but `--accent-color-rgb` is never defined in `:root`.
* **Impact:** The browser treats the `box-shadow` rule as invalid and discards the entire declaration. Hovering over certifications and the contact submit button yields no shadow outline effect.
* **Proposed Fix:** Add `--accent-color-rgb: 224, 96, 49;` inside `:root` in `style.css`.

### 3.3. Undefined CSS Custom Property: `--font-main`
* **File:** `style.css` (Line 2181)
* **Explanation:** The GitHub calendar tooltip is styled with `font-family: var(--font-main);` which is not defined in `:root` (only `--font-body`, `--font-display`, and `--font-accent` are declared).
* **Impact:** The tooltip text falls back to a default browser serif/sans-serif font, creating typography inconsistencies.
* **Proposed Fix:** Change it to `font-family: var(--font-body);`.

### 3.4. Overlapping State Timers on Form Success (UI Overwrite)
* **File:** `script.js` (Lines 626-704 and 724-731)
* **Explanation:** The Formspree success timeline starts after 1.5s and has a GSAP duration of 3.5s (total 5.0 seconds). A separate, unconditional `setTimeout` fires at 3.0 seconds, resetting the button text to "Send Message" and clearing its style. When the GSAP timeline finishes at 5.0 seconds, its `onComplete` sets the button icon class to `fas fa-check`.
* **Impact:** At 3.0s, the button style resets mid-animation. At 5.0s, the icon snaps to a checkmark, leaving the button showing "Send Message" with a checkmark icon.
* **Proposed Fix:** Remove the unconditional 3.0s reset timeout. Trigger the button reset inside the GSAP timeline's `onComplete` callback, or synchronize the reset timer to fire only after the flight animation finishes (e.g., 5.5s).

### 3.5. Broken Responsive Carousel for Certifications
* **File:** `style.css` (Lines 1886-1890)
* **Explanation:** Under `@media (max-width: 1024px)`, the awards grid has flex properties (`flex-wrap: nowrap !important; justify-content: flex-start !important; overflow-x: auto !important;`). However, the container is set to `display: flex !important` under the desktop deck view (line 1314) and `display: grid` under the base view (line 807). On mobile screen sizes (max-width 480px), line 1261 overrides it to `grid-template-columns: 1fr`.
* **Impact:** Because of conflicting grid and flex declarations across breakpoints, the mobile layout fails to display as a clean horizontal scrolling carousel and instead falls back to vertical column blocks with broken padding and overflow properties.
* **Proposed Fix:** Consolidate the display properties for `.awards-grid` inside the mobile media queries and explicitly declare `display: flex !important` when horizontal scroll is desired.

### 3.6. Jarring Glass Card Transform Snap on mouseleave
* **File:** `script.js` (Line 267) & `style.css` (Line 93)
* **Explanation:** When the mouse leaves a `.glass-card`, the transform resets: `card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)"`. Since `transform` is not defined in the CSS transition property for `.glass-card` (to avoid mouse-tracking lag), the card snaps back instantly.
* **Impact:** The card snaps back abruptly upon mouse exit, looking unpolished.
* **Proposed Fix:** Use GSAP to animate the card back to zero rotation and translation:
  ```javascript
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  });
  ```

---

## 4. Accessibility (a11y) Flaws
1. **Missing Autocomplete Fields:** Input fields (`form-name`, `form-email`, `form-phone`) lack `autocomplete` attributes, which prevents mobile browsers from helping users autofill.
2. **Missing ARIA Roles on Mobile Toggle:** The hamburger button `.mobile-nav-toggle` has no `aria-expanded` or `aria-controls` attributes to indicate whether the mobile drawer navigation is open or closed to screen readers.
3. **Certificate Modals:** The certificate iframe/image modals do not use `role="dialog"`, `aria-modal="true"`, or trap focus when opened, which makes them inaccessible for keyboard and screen-reader users.
