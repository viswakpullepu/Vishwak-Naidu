# Technical Analysis Report: Milestone 1 — Responsive Certificates Redesign

**Prepared by:** Teamwork Explorer (`teamwork_preview_explorer_m1_1`)  
**Workspace:** `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu`  
**Working Directory:** `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu\.agents\teamwork_preview_explorer_m1_1`  
**Date:** June 24, 2026  

---

## 1. Executive Summary & Core Findings

This report details the read-only investigation and technical analysis of the certifications and career highlights layouts (`index.html`, `style.css`, `script.js`) for **Milestone 1: Responsive Certificates Redesign**. 

### Key Findings:
1. **Career Highlights Section Regression (Broken Grid)**: The Career Highlights container (`#highlights .awards-grid`) is rendered as a horizontal scroll row instead of a 3-column grid on desktop. This is caused by a global selector `.awards-grid { display: flex !important; ... }` defined in `style.css` (line 1321), which overrides the default grid layout and inline styling of the highlights container.
2. **Chronological Order Mismatches**: The certifications in `index.html` (lines 272–449) are out of chronological order. Converting the Unix millisecond timestamps embedded in the PDF filenames reveals two major ordering errors:
   - *Common Internship Test* (`1742488126154.pdf` - March 20, 2025) is listed *after* *Google Ad Manager* (March 21) and *Google AdMob* (March 23).
   - *MongoDB Bootcamp* (`1749358055824.pdf` - June 8, 2025 at 04:47 UTC) is listed *after* *DSA with Java Bootcamp* (June 11).
3. **Cramped Spacing on Tablet**: Under `@media (max-width: 1024px)` (line 1901), `.awards-grid` has `gap: 0;` and `.award-card` has `margin-left: 0 !important;`. This forces the cards to touch each other directly, creating a visual layout cramp.
4. **Hover Animation Jank & Conflict**: The 3D mouse tilt script updates the card's transform inline, but the CSS hover styles use `!important` on the transform properties (e.g. `transform: translateY(-15px) scale(1.03) !important;`). This overrides the JS tracking, completely breaking the 3D tilt. Furthermore, the CSS transition on the `transform` property (`transition: transform 0.4s ...`) conflicts with real-time `mousemove` cursor tracking, causing significant frame lag.

---

## 2. Detailed Root Cause Analysis & Solutions

### 2.1 Career Highlights Layout Regression
* **Observation**: In `index.html` (line 578), Career Highlights is defined as:
  ```html
  <div class="awards-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px;">
  ```
  However, in `style.css` (line 1321), the following global override exists:
  ```css
  .awards-grid {
    display: flex !important;
    flex-direction: row;
    overflow-x: auto !important;
    ...
  }
  ```
* **Logic Chain**: Because `.awards-grid` uses `display: flex !important`, the browser ignores the inline grid styles. On desktop, this makes the highlights row scroll horizontally instead of formatting as a grid.
* **Proposed Solution**: Scope all certifications carousel styles in `style.css` under the `#certifications` section. Change `.awards-grid` and `.award-card` selectors in the certifications-carousel section (lines 1321–1380) and tablet media queries to `#certifications .awards-grid` and `#certifications .award-card`. This allows `#highlights .awards-grid` to default to `display: grid` on desktop as originally intended.

### 2.2 Chronological Order of Certifications
* **Observation**: The filenames in `assets/` for PDF certificates contain Unix timestamps (in milliseconds). Converting these to dates reveals:
  - `1742488126154.pdf` -> **2025-03-20 16:28:46 UTC** (Common Internship Test)
  - `1742541444638.pdf` -> **2025-03-21 07:17:24 UTC** (Google Ad Manager)
  - `1742710226328.pdf` -> **2025-03-23 06:10:26 UTC** (Google AdMob)
  - `1743837154867.pdf` -> **2025-04-05 07:12:34 UTC** (C++ Bootcamp)
  - `1743837652088.pdf` -> **2025-04-05 07:20:52 UTC** (HTML & CSS Bootcamp)
  - `1749357503589.pdf` -> **2025-06-08 04:38:23 UTC** (Social Media Marketing)
  - `1749357767653.pdf` -> **2025-06-08 04:42:47 UTC** (Excel Bootcamp)
  - `1749358055824.pdf` -> **2025-06-08 04:47:35 UTC** (MongoDB Bootcamp)
  - `1749612942272.pdf` -> **2025-06-11 03:35:42 UTC** (DSA with Java Bootcamp)
* **Logic Chain**: The HTML code currently places `1742488126154.pdf` (Mar 20) at index #8 (after Ad Manager/AdMob) and `1749358055824.pdf` (Jun 8) at index #14 (after DSA with Java on Jun 11).
* **Proposed Solution**: Reorder the certificate blocks in `index.html` (lines 272–449) into the following chronological groups:
  1. **Group A: Foundations & Non-timestamped Images**:
     - NVIDIA Jetson Nano
     - Introduction to Prompt Engineering for Generative AI (`prompt_eng_genai.png`)
     - Palo Alto Networks Cybersecurity Foundation (`paloalto_cybersec.png`)
     - Getting Started with Microsoft Excel (`excel_started.png`)
     - Google Ads for Beginners (`google_ads_beginner.png`)
  2. **Group B: Timestamped Certifications (Earliest to Latest)**:
     - Common Internship Test (`1742488126154.pdf` - March 20)
     - Google Ad Manager (`1742541444638.pdf` - March 21)
     - Google AdMob (`1742710226328.pdf` - March 23)
     - C++ Bootcamp (`1743837154867.pdf` - April 5)
     - HTML & CSS Bootcamp (`1743837652088.pdf` - April 5)
     - Social Media Marketing Bootcamp (`1749357503589.pdf` - June 8, 04:38)
     - Excel Bootcamp (`1749357767653.pdf` - June 8, 04:42)
     - MongoDB Bootcamp (`1749358055824.pdf` - June 8, 04:47)
     - DSA with Java Bootcamp (`1749612942272.pdf` - June 11)

### 2.3 Tablet Spacing Overlap
* **Observation**: In `@media (max-width: 1024px)` (line 1901), `.awards-grid` has `gap: 0;` and `.award-card` has `margin-left: 0 !important;`.
* **Logic Chain**: Zero gap causes cards to touch directly, ruining the layout flow.
* **Proposed Solution**: Change the gap under the `1024px` media query to `gap: 16px !important;` and scope it under `#certifications` so it does not regress the highlights section.

### 2.4 Hover Animation Performance
* **Observation**: `.award-card` (line 1355) has `transition: transform 0.4s ...`. On hover (line 1367), it overrides the transform with `transform: translateY(-15px) scale(1.03) !important;`.
* **Logic Chain**: The CSS `!important` hover transform overrides the JS-set coordinates. The CSS transition forces an interpolation over 0.4s on every mousemove coordinate update, creating major lagging.
* **Proposed Solution**: 
  - Remove the transition on `transform` from `.award-card` in `style.css` (line 1355). Keep only `box-shadow` and `border-color` transitions:
    `transition: box-shadow 0.4s ease, border-color 0.4s ease;`
  - Remove CSS hover transforms completely from `.award-card:hover` (line 1368 and line 1924).
  - Update `script.js` (line 262) to handle scale and vertical translation on mousemove:
    `card.style.transform = rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-15px) scale(1.03);`
  - Update `script.js` (line 270) to reset scale and translate smoothly on mouseleave using GSAP:
    ```javascript
    card.addEventListener("mouseleave", () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    });
    ```

---

## 3. Actionable Code Change Proposals

### 3.1 Proposed Changes in `index.html` (DOM Order)
Rearrange lines 272–449 so that the certificate cards appear in this exact chronological order:
1. NVIDIA Jetson Nano AI Card (`data-pdf="assets/1749357767653.pdf"`)
2. Prompt Engineering Card (`data-pdf="assets/prompt_eng_genai.png"`)
3. Palo Alto Networks Card (`data-pdf="assets/paloalto_cybersec.png"`)
4. Excel Started Card (`data-pdf="assets/excel_started.png"`)
5. Google Ads Beginner Card (`data-pdf="assets/google_ads_beginner.png"`)
6. Common Internship Test Card (`data-pdf="assets/1742488126154.pdf"`)
7. Google Ad Manager Card (`data-pdf="assets/1742541444638.pdf"`)
8. Google AdMob Card (`data-pdf="assets/1742710226328.pdf"`)
9. C++ Bootcamp Card (`data-pdf="assets/1743837154867.pdf"`)
10. HTML & CSS Bootcamp Card (`data-pdf="assets/1743837652088.pdf"`)
11. Social Media Marketing Card (`data-pdf="assets/1749357503589.pdf"`)
12. Excel Bootcamp Card (`data-pdf="assets/1749357767653.pdf"`)
13. MongoDB Bootcamp Card (`data-pdf="assets/1749358055824.pdf"`)
14. DSA with Java Bootcamp Card (`data-pdf="assets/1749612942272.pdf"`)

### 3.2 Proposed Changes in `style.css`
Replace lines 1321–1380 with scoped rules:
```css
#certifications .awards-grid {
  display: flex !important;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  min-height: 400px;
  margin-top: 40px;
  padding: 40px 20px;
  overflow-x: auto !important;
  overflow-y: visible !important;
  gap: 24px;
  -webkit-overflow-scrolling: touch;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}

#certifications .award-card {
  flex: 0 0 260px;
  height: 340px;
  margin-left: 0;
  transition: box-shadow 0.4s ease, border-color 0.4s ease;
  cursor: pointer;
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  scroll-snap-align: center;
}

#certifications .award-card:hover {
  box-shadow: 0 20px 40px rgba(224, 96, 49, 0.15);
  border-color: var(--accent-color);
  z-index: 10;
}
```

Under `@media (max-width: 1024px)`, replace lines 1901–1925 with:
```css
  #certifications .awards-grid {
    flex-wrap: nowrap !important;
    justify-content: flex-start !important;
    overflow-x: auto !important;
    padding: 60px 32px !important;
    min-height: 440px !important;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    gap: 16px !important; /* Overhauled to prevent card touching */
  }
  #certifications .award-card {
    flex: 0 0 230px !important;
    height: 310px !important;
    margin-left: 0 !important;
    scroll-snap-align: center;
  }
  #certifications .award-card:hover {
    z-index: 10;
  }
```

### 3.3 Proposed Changes in `script.js`
Modify the card tilt logic (around lines 250–278):
```javascript
const glassCards = document.querySelectorAll(".glass-card");
glassCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    
    // Position of cursor relative to card center (normalized between -1 and 1)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const tiltX = (y - 0.5) * -15; // Max 15 degree rotation
    const tiltY = (x - 0.5) * 15;
    
    // Add lift (translateY) and scale to JS transform to avoid fighting CSS transitions
    card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-15px) scale(1.03)`;
    
    // Update radial glare position using CSS custom variables
    card.style.setProperty("--glare-x", `${x * 100}%`);
    card.style.setProperty("--glare-y", `${y * 100}%`);
  });
  
  card.addEventListener("mouseleave", () => {
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  });
});
```

---

## 4. Verification Plan

1. **Career Highlights Grid Verification**:
   - Open the portfolio page.
   - Inspect the **Career Highlights** section on desktop. Verify that the layout displays as a 3-column grid, aligning perfectly with the page columns.
2. **Certifications Order Verification**:
   - Inspect the certificates container DOM. Verify that:
     - The first PDF certificate is `1742488126154.pdf` (Common Internship Test).
     - `1749358055824.pdf` (MongoDB) is located *before* `1749612942272.pdf` (DSA with Java).
3. **Responsive Spacing Verification**:
   - Resize viewport to tablet width (e.g. `900px`).
   - Confirm that the certificates carousel has a clean `16px` gap between adjacent cards (no direct touching or overlapping).
4. **Hover Animation Performance Verification**:
   - Hover over any card on desktop. Verify that:
     - The card tilts dynamically to follow the cursor (confirming the 3D mouse tilt works).
     - Cursor movement causes no animation lag or stutter (response under 100ms, steady 60fps frame rate).
     - Leaving the card triggers a smooth return animation.
