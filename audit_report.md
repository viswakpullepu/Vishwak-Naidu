# Codebase Audit Report: Vishwak-Naidu Portfolio Website
**Target Workspace:** `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu`  
**Date of Audit:** June 23, 2026  
**Auditor:** Specialized QA & System Integrity Agent  

---

## 1. Executive Summary
This report presents a comprehensive, read-only architectural and quality assurance audit of the portfolio website codebase (`index.html`, `style.css`, `script.js`, `assets.js`, and associated asset files). The objective is to identify functional defects, performance bottlenecks, visual inconsistencies, and accessibility gaps that impact the user experience, especially on mobile devices.

### Key Findings Summary:
1. **Critical Mobile Crash:** An undeclared global variable (`lenis`) causes a runtime `ReferenceError` on all mobile and touch-enabled devices. This error completely breaks the certification modals and active link scroll-tracking logic.
2. **Form Validation Bypass:** The contact form employs the `novalidate` attribute while JavaScript checks validation *only* for the email and phone fields, enabling empty name and message fields to bypass validation and submit successfully.
3. **Severe Resource Leak:** The Three.js WebGL particle animation runs in a continuous `requestAnimationFrame` loop without visibility checks, causing significant, constant CPU/GPU usage and battery drain even when the hero canvas is scrolled out of view.
4. **Dead Weight Bloat:** A 14.4MB React webpack bundle (`main_chunk.js`) and multiple large, unreferenced images reside in the workspace root and asset folders, creating unnecessary repository bloat.
5. **Styling and Layout Bugs:** Mismatched success form reset timers, undefined CSS variables (breaking shadows and typography), double-cursors on desktop, and broken responsive rules on mobile/tablet certification cards.
6. **Accessibility (a11y) Violations:** Missing ARIA labels, non-standard modals without keyboard focus trapping or Escape-key handling, and lack of browser autocomplete attributes on form fields.

---

## 2. Bugs & Logic Flaws

### 2.1. Critical ReferenceError on Mobile (`lenis` is not defined)
* **Location:** `script.js` (Lines 13, 518, 756, 808)
* **The Flow:**
  - On line 12–13, `lenis` is initialized conditional on `!isMobile` and the presence of `Lenis` in the window:
    ```javascript
    if (!isMobile && typeof Lenis !== "undefined") {
      lenis = new Lenis({ ... });
    }
    ```
  - Because there is no `let`, `const`, or `var` declaration for `lenis` in the global scope, `lenis` is assigned as an implicit property of `window` *only* if the condition evaluates to `true` (i.e., on desktop).
  - On mobile devices, `isMobile` is `true`. The initialization block is skipped, and `lenis` remains entirely undeclared.
  - When the browser subsequently encounters checks like `if (lenis)` (on lines 518, 756, and 808) on mobile, the JavaScript engine throws `ReferenceError: lenis is not defined` instead of evaluating to a falsy value.
* **Impact:** 
  - Clicking any certification/award card on mobile triggers an event listener that executes `if (lenis)`. The resulting `ReferenceError` crashes the click handler immediately. As a result, the subsequent `setTimeout` that opens the modal is never reached, leaving **certification modals completely non-functional on mobile devices**.
  - Section-link scroll tracking (ScrollSpy) breaks silently.

### 2.2. Contact Form Validation Bypass
* **Location:** `index.html` (Line 619) & `script.js` (Lines 553–607)
* **The Flow:**
  - The contact form is declared with native HTML5 validation disabled:
    ```html
    <form id="portfolio-contact-form" novalidate>
    ```
  - In `script.js`, the event listener for form submission checks the email and phone numbers against regular expressions to ensure they are valid.
  - However, the script contains **no checks** to verify if the `name` or `message` inputs contain values.
* **Impact:** Users can submit form messages with completely blank names and message fields. The form transmits empty data to Formspree and triggers the success animation as if a valid message was sent.

### 2.3. Placeholder Link Issues
* **Location:** `index.html` (Lines 274, 689)
* **The Flow:**
  - The NVIDIA Jetson Nano certification card defines its target file as a hash placeholder:
    ```html
    <div class="glass-card award-card" data-pdf="#">
    ```
    When clicked, the modal logic checks if the path ends in `.pdf`. Since it does not, it treats it as an image and sets the source of the modal image element to `#`.
  - The "Download Resume" button in the contact sidebar is mapped to a dummy link:
    ```html
    <a href="#" class="hero-btn" ...><span>Download Resume</span></a>
    ```
* **Impact:**
  - Clicking the NVIDIA certification displays a broken image placeholder inside the modal.
  - Clicking the resume download button does nothing except append `#` to the browser URL and jump the scroll position back to the top of the viewport.

### 2.4. Overlapping Success Timeline Reset Timers
* **Location:** `script.js` (Lines 626–704 and 724–731)
* **The Flow:**
  - When the contact form succeeds, a full-screen success overlay appears, followed by a GSAP animation of a flying paper plane after a `1500ms` delay.
  - The GSAP timeline consists of 5 chained movements totaling `3.5s` of animation duration. Combined with the initial delay, the total visual sequence takes **`5.0 seconds`**.
  - However, at the bottom of the submit listener, an unconditional `setTimeout` is scheduled to reset the button state to normal after exactly **`3.0 seconds`**:
    ```javascript
    setTimeout(() => {
      btnText.textContent = originalText;
      btn.style.background = "";
      btn.style.borderColor = "";
      icon.className = "fas fa-paper-plane";
      btn.disabled = false;
    }, 3000);
    ```
* **Impact:** At `3.0s` (midway through the plane flight), the button abruptly resets to its default styling, text ("Send Message"), and enables itself. When the GSAP timeline finishes at `5.0s`, its `onComplete` callback runs, restoring the original icon opacity and setting its class to `fas fa-check`. This leaves the button in a corrupted UI state showing **"Send Message" alongside a checkmark icon**.

### 2.5. Styling & Responsive Carousel Conflicts
* **Location:** `style.css` (Lines 1261, 1313–1323, 1886–1890, 2048–2070)
* **The Flow:**
  - On desktop, `.awards-grid` uses a flex fanning/deck layout (`display: flex !important` with relative child offsets).
  - Under `@media (max-width: 1024px)`, the carousel uses horizontal scrolling with `.award-card` set to `margin-left: -90px !important` to create a stack deck.
  - Under `@media (max-width: 600px)`, the card fanning is reset via `margin-left: 0 !important` and `transform: none !important`.
  - Under `@media (max-width: 480px)`, line 1261 overrides `.awards-grid` to `grid-template-columns: 1fr` but does not override the `display` attribute.
* **Impact:** 
  - On tablets and screens between `600px` and `1024px` (like portrait iPads), the cards overlap each other horizontally by `-90px` due to the margin leak, compressing text and hiding critical details.
  - The layout engine has conflicting `flex` and `grid` attributes defined in separate media queries, causing rendering glitches depending on the precise window resize order.

---

## 3. Performance & Lagging Issues

### 3.1. Continuous CPU/GPU Rendering Leak in Three.js Loop
* **Location:** `script.js` (Lines 419–511)
* **The Flow:**
  - The particle system animation loop calls `requestAnimationFrame(animate)` continuously.
  - In each frame, the code loops over `2000` particles, performing coordinate interpolation, mathematical ripples (`Math.sin`, `Math.cos`), and calculating distance to the cursor (`Math.sqrt`, `Math.pow`).
* **Impact:** This heavy rendering cycle runs constantly, even when the user scrolls down to sections like "About" or "Projects" and the hero canvas is completely invisible. This drains device battery, wastes GPU/CPU cycles, and causes frame-drops (lagging) on mobile/low-end systems.

### 3.2. Dead File Bloat
* **Location:** Workspace root & `assets/` directory
* **The Flow:**
  - A massive 14.4MB React Webpack bundle (`main_chunk.js`) sits in the workspace root. It is never imported, referenced, or executed by `index.html` or any script.
  - Inside the `assets/` directory, files named `award1.png` through `award6.png` are present but are completely unreferenced in the HTML or stylesheets (which load specific files like `prompt_eng_genai.png` or random PDFs).
* **Impact:** Unnecessary repository bloat, slower git clones, and messy codebase hygiene.

### 3.3. Overwhelming Network CDNs Overhead
* **Location:** `index.html` (Lines 12, 15, 18, 736–745)
* **The Flow:**
  - The site loads styling, icons, and libraries from **9 separate external CDNs** on startup (Cloudflare, unpkg, jsdelivr, unpkg, etc.).
* **Impact:** High latencies due to multiple DNS lookups, TCP handshakes, and SSL negotiations. If any CDN suffers an outage, key functions (smooth scrolling, 3D WebGL sphere, icons, or GitHub contribution charts) fail.

### 3.4. Infinite Spinners on Network Failures
* **Location:** `script.js` (Lines 867, 964–1021)
* **The Flow:**
  - When fetching repositories from GitHub, if the API rate limit is reached or a network error occurs, the `.catch()` block handles the error but fails to hide the loading indicator (`#vercel-loading`) or update the visual calendar spinner.
* **Impact:** Users are presented with spinning loading indicators that rotate indefinitely, indicating a frozen application state instead of a clean fallback error message.

---

## 4. Visual Glitches

### 4.1. Desktop Double-Cursor Issue
* **Location:** `style.css` (Lines 100–144) & `script.js` (Lines 201–245)
* **The Flow:**
  - Custom pointer dot (`#custom-cursor`) and trailing ring (`#custom-cursor-ring`) elements track mouse movements.
  - However, no rule is defined in the CSS to disable the default operating system pointer.
* **Impact:** On desktop screens, both the custom pointer circle and the default OS cursor arrow are visible at the same time, leading to a cluttered, unpolished look.

### 4.2. Undefined CSS Custom Properties
* **Location:** `style.css` (Lines 1364, 1371, 1846, 2181)
* **The Flow:**
  - The variables `--accent-color-rgb` and `--font-main` are referenced:
    - `box-shadow` styles use `rgba(var(--accent-color-rgb), 0.25)` and `rgba(var(--accent-color-rgb), 0.35)`.
    - `.gh-tooltip` sets `font-family: var(--font-main)`.
  - Checking the `:root` pseudo-class reveals that neither of these properties is declared.
* **Impact:**
  - The browser discards the shadow rules completely since they contain undefined variables. Hovering over certificates and form buttons yields **no glow/shadow effects**.
  - The GitHub calendar tooltip font falls back to the browser's default serif/sans-serif font, breaking typography consistency.

### 4.3. TagCloud FOUC (Flash of Unstyled Content)
* **Location:** `script.js` (Lines 1120–1130)
* **The Flow:**
  - The TagCloud library escapes HTML strings by default, rendering raw tags like `<i class="devicon-react-original">React</i>` on load.
  - To work around this, the script runs a `setTimeout` at `100ms` to read the escaped text content and write it back as innerHTML.
* **Impact:** On page load, raw HTML source code is briefly visible floating in the 3D sphere. Furthermore, if the browser experiences a lag spike and TagCloud takes longer than 100ms to initialize, the timeout fires too early, leaving raw code text permanently visible.

### 4.4. Glass Card Transform Snapping
* **Location:** `script.js` (Line 267) & `style.css` (Line 93)
* **The Flow:**
  - When the cursor leaves a `.glass-card`, the tilt transform is reset to zero inline:
    ```javascript
    card.style.transform = "rotateX(0deg) rotateY(0deg) translateY(0)";
    ```
  - Because `transform` is omitted from the card's CSS transitions list (to prevent lag during cursor tracking), this reset executes instantly.
* **Impact:** The card snaps back into place abruptly upon cursor exit, disrupting the smooth animation style of the site.

---

## 5. Accessibility (a11y) Flaws

### 5.1. Missing Autocomplete Fields
* **Location:** `index.html` (Lines 623, 627, 632)
* **Details:** The name, email, and phone input fields lack `autocomplete` attributes.
* **Impact:** Screen readers and browser auto-fill algorithms cannot assist users (particularly on mobile) in filling out the contact form.

### 5.2. Missing ARIA Roles on Mobile Navigation Toggle
* **Location:** `index.html` (Lines 75, 79)
* **Details:** 
  - The hamburger menu button `.mobile-nav-toggle` is a simple `<button>` containing a FontAwesome icon, with no description or state attributes.
  - The close button `.close-mobile-btn` has no descriptive text.
* **Impact:** Screen readers perceive the button as an unlabeled control and have no way of knowing whether the mobile menu navigation drawer is expanded or collapsed.

### 5.3. Modals Lacking Standard Accessibility Patterns
* **Location:** `index.html` (Lines 726–733) & `script.js` (Lines 745–820)
* **Details:**
  - The certificate preview container (`#cert-modal`) does not use the `role="dialog"` or `aria-modal="true"` attributes.
  - When opened, focus is not moved into the modal, nor is keyboard focus trapped (meaning a keyboard user pressing Tab will continue to interact with invisible elements behind the overlay).
  - There is no listener for the `Escape` key to close the modal.
* **Impact:** Screen reader and keyboard-only users cannot accessibly view or dismiss certification credentials.

---

## 6. Recommended Fix Actions

The following section outlines the precise, actionable code changes needed to address every issue identified in this audit.

### 6.1. Resolve the `lenis` ReferenceError on Mobile
**Action:** Explicitly declare `lenis` in the global scope in `script.js` (before `DOMContentLoaded` or at the very top). Refactor references to use safe checks.

* **Modify `script.js` (Line 1):**
  ```javascript
  let lenis = null; // Declare explicitly at top-level scope

  document.addEventListener('DOMContentLoaded', () => {
  ```
* **Modify `script.js` checks (e.g. Lines 518, 756, 808):**
  Change all occurrences of `if (lenis)` to `if (lenis !== null)` or `if (typeof lenis !== 'undefined' && lenis)`.

---

### 6.2. Fix the Contact Form Validation Bypass
**Action:** Add validation checks in the submit listener in `script.js` to ensure the required name and message fields are not empty or solely whitespace.

* **Modify `script.js` (insert around Line 567):**
  ```javascript
  const nameStr = formData.get("name") ? formData.get("name").trim() : "";
  const messageStr = formData.get("message") ? formData.get("message").trim() : "";

  if (!nameStr || !messageStr) {
    btnText.textContent = "Fields Required!";
    btn.style.background = "#c62828";
    btn.style.borderColor = "#c62828";
    icon.className = "fas fa-times-circle";
    
    setTimeout(() => {
      btnText.textContent = originalText;
      btn.style.background = "";
      btn.style.borderColor = "";
      icon.className = "fas fa-paper-plane";
      btn.disabled = false;
    }, 3000);
    
    return; // Block form submission
  }
  ```

---

### 6.3. Resolve Placeholder Link Issues
**Action:**
1. Update the NVIDIA Jetson Nano card's `data-pdf` to point to a valid image or document asset.
2. Replace the `href="#"` resume anchor in `index.html` with a valid relative file path (e.g. `assets/resume.pdf` or another document asset).

* **Modify `index.html` (Line 274):**
  ```html
  <div class="glass-card award-card" data-pdf="assets/1749357767653.pdf">
  ```
* **Modify `index.html` (Line 689):**
  ```html
  <a href="assets/1742488126154.pdf" target="_blank" class="hero-btn" ...>
  ```

---

### 6.4. Synchronize Success Timeline Reset Timers
**Action:** Remove the separate, hardcoded `3000ms` button reset timer and trigger the reset within the GSAP timeline's `onComplete` callback, or adjust the timeout delay to fire only after the plane has left the screen (e.g. `5500ms`).

* **Modify `script.js` (Lines 694–699):**
  ```javascript
  onComplete: () => {
    plane.remove(); // Cleanup clone
    icon.style.opacity = '1'; // Restore original icon
    icon.className = "fas fa-check"; // Set to checkmark
    
    // Trigger button reset after flight completes (500ms after flight ends)
    setTimeout(() => {
      btnText.textContent = originalText;
      btn.style.background = "";
      btn.style.borderColor = "";
      icon.className = "fas fa-paper-plane";
      btn.disabled = false;
    }, 500);
  }
  ```
* **Remove `script.js` lines 724–730 entirely.**

---

### 6.5. Fix Styling & Responsive Carousel Conflicts
**Action:** Ensure that under responsive widths, the cards reset the fanning properties (`margin-left` and `transform`) cleanly and do not leak fanning offsets.

* **Modify `style.css` (Line 1886):**
  ```css
  .awards-grid {
    display: flex !important;
    flex-wrap: nowrap !important;
    justify-content: flex-start !important;
    overflow-x: auto !important;
    padding: 60px 32px !important;
    min-height: 440px !important;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    gap: 0;
  }
  .award-card {
    flex: 0 0 230px !important;
    height: 310px !important;
    margin-left: 0 !important; /* Reset overlap fanning */
    scroll-snap-align: center;
    transform: none !important; /* Reset tilt transformations */
  }
  ```

---

### 6.6. Fix Three.js Continuous Rendering Loop (Resource Leak)
**Action:** Use an `IntersectionObserver` to pause and resume the WebGL canvas rendering animation based on viewport visibility.

* **Modify `script.js` (around Line 419):**
  ```javascript
  let animationFrameId = null;
  const heroSection = document.getElementById("hero");

  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    // ... rest of the rendering logic
    renderer.render(scene, camera);
  }

  // Set up intersection observer to toggle loop
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animationFrameId) {
          clock.getElapsedTime(); // catch up clock
          animate();
        }
      } else {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      }
    });
  }, { threshold: 0.1 });

  if (heroSection) {
    observer.observe(heroSection);
  }
  ```

---

### 6.7. Clean Up Dead Files
**Action:** Delete `main_chunk.js` from the repository root. Delete `assets/award1.png` through `assets/award6.png` if they are not referenced.

---

### 6.8. Consolidate CDN Overheads
**Action:** Download the CSS/JS libraries from CDNs and store them locally inside the `assets/` directory (e.g. `assets/vendor/three.min.js`, `assets/vendor/gsap.min.js`, etc.) and reference them locally in `index.html`.

---

### 6.9. Fix Infinite Spinner Loops
**Action:** In `script.js`, ensure all API catch blocks hide their corresponding spinner/loading animations and display a helpful error status message.

* **Modify `script.js` catch block (around Line 1016):**
  ```javascript
  } catch (error) {
    console.error("Fetch API Error:", error);
    const vercelLoading = document.getElementById("vercel-loading");
    if (vercelLoading) {
      vercelLoading.innerHTML = `<div class="error-loading-box">
        <i class="fas fa-exclamation-triangle" style="color:var(--accent-color);"></i>
        <p>Could not load live projects at this time.</p>
      </div>`;
    }
  }
  ```

---

### 6.10. Fix Desktop Double Cursor
**Action:** Apply `cursor: none !important` to elements on screens larger than `768px`.

* **Modify `style.css` cursor section (Line 100):**
  ```css
  @media (min-width: 769px) {
    html, body, a, button, input, textarea, select, iframe {
      cursor: none !important;
    }
  }
  ```

---

### 6.11. Declare Undefined CSS Custom Properties
**Action:** Add the missing variables inside the `:root` rule in `style.css`.

* **Modify `style.css` (Line 4):**
  ```css
  :root {
    /* ... existing variables */
    --accent-color-rgb: 224, 96, 49;
    --font-main: 'Inter', sans-serif;
  }
  ```

---

### 6.12. Prevent TagCloud FOUC
**Action:** Hide the container initially and fade it in using CSS transition only after the innerHTML strings are parsed.

* **Modify `style.css`:**
  ```css
  .tagcloud-wrapper {
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .tagcloud-wrapper.loaded {
    opacity: 1;
  }
  ```
* **Modify `script.js` TagCloud block:**
  ```javascript
  if (typeof TagCloud !== 'undefined' && document.querySelector(container)) {
    TagCloud(container, skills, options);
    
    setTimeout(() => {
      document.querySelectorAll('.tagcloud--item').forEach(item => {
        item.innerHTML = item.textContent;
      });
      // Show container
      const wrapper = document.querySelector('.tagcloud-wrapper');
      if (wrapper) wrapper.classList.add('loaded');
    }, 100);
  }
  ```

---

### 6.13. Smooth Glass Card Hover Return (Transform Snapping)
**Action:** Use GSAP to animate the glass cards back to their default position on mouseleave.

* **Modify `script.js` mouseleave listener (around Line 267):**
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

### 6.14. Fix Accessibility (a11y) Issues
**Action:**
1. Add `autocomplete` tags to input fields.
2. Add `aria-label`, `aria-expanded`, and `aria-controls` to interactive navigation toggles.
3. Apply `role="dialog"`, `aria-modal="true"`, and Esc key closing / focus trapping.

* **Modify inputs in `index.html`:**
  ```html
  <input type="text" id="form-name" name="name" required autocomplete="name" />
  <input type="email" id="form-email" name="email" required autocomplete="email" />
  <input type="tel" id="form-phone" name="phone" required placeholder="e.g. +1 234 567 8900" autocomplete="tel" />
  ```
* **Modify navigation toggles in `index.html`:**
  ```html
  <button class="mobile-nav-toggle" aria-label="Open Navigation Menu" aria-controls="mobile-nav-menu" aria-expanded="false"><i class="fas fa-bars"></i></button>
  ...
  <div id="mobile-nav-menu" class="mobile-nav-menu" role="navigation">
    <button class="close-mobile-btn" aria-label="Close Navigation Menu"><i class="fas fa-times"></i></button>
  ```
* **Modify certification modal in `index.html`:**
  ```html
  <div id="cert-modal" class="cert-modal" role="dialog" aria-modal="true" aria-labelledby="cert-modal-title">
    <div class="cert-modal-overlay"></div>
    <div class="cert-modal-content">
      <h2 id="cert-modal-title" class="sr-only">Certificate View</h2>
  ```
* **Add Escape key close listener in `script.js` modal block:**
  ```javascript
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal.classList.contains("active")) {
      closeModal();
    }
  });
  ```
