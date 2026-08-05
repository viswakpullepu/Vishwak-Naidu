# Changes Made - Milestone 1: Responsive Certificates Redesign

## 1. `index.html`
- Rearranged all certificate card blocks inside `#certifications .awards-grid` in chronological order (from oldest to newest):
  - Coursera: Palo Alto Networks Cybersecurity Foundation (`assets/paloalto_cybersec.png`)
  - Coursera: Getting Started with Microsoft Excel (`assets/excel_started.png`)
  - Coursera: Google Ads for Beginners (`assets/google_ads_beginner.png`)
  - Internship Studio: Common Internship Test (`assets/1742488126154.pdf`)
  - Google: Google Ad Manager (`assets/1742541444638.pdf`)
  - Google: Google AdMob (`assets/1742710226328.pdf`)
  - LetsUpgrade: C++ Bootcamp (`assets/1743837154867.pdf`)
  - LetsUpgrade: HTML & CSS Bootcamp (`assets/1743837652088.pdf`)
  - LinkedIn Learning: Introduction to Prompt Engineering for Generative AI (`assets/prompt_eng_genai.png`)
  - LetsUpgrade: Social Media Marketing Bootcamp (`assets/1749357503589.pdf`)
  - LetsUpgrade: Excel Bootcamp (`assets/1749357767653.pdf`)
  - LetsUpgrade: MongoDB Bootcamp (`assets/1749358055824.pdf`)
  - LetsUpgrade: DSA with Java Bootcamp (`assets/1749612942272.pdf`)
  - NVIDIA: Getting Started with AI on Jetson Nano (`assets/1749357767653.pdf`)

## 2. `style.css`
- Scoped custom horizontal carousel styles specifically under `#certifications .awards-grid` instead of `.awards-grid` globally.
- Scoped `.award-card` styles under `#certifications .award-card` and `#certifications .award-card.rolling-out`.
- Scoped scrollbars to `#certifications .awards-grid::-webkit-scrollbar` etc.
- Removed CSS hover transform properties from `#certifications .award-card:hover` to allow JS tilt animations to work.
- Modified tablet media queries (`max-width: 1024px`) to use gap `16px !important` for `#certifications .awards-grid` and margin-left `0` to prevent cards touching/overlapping, and scoped hover rules under `#certifications`.
- Relocated and scoped certifications swipe carousel mobile media queries (`max-width: 768px`) with gap `16px !important` and proper sizing.
- Removed the `.awards-grid` grid-template-columns override under `max-width: 480px` to prevent layout conflicts.

## 3. `script.js`
- Refactored the physical 3D glass tilt event listener for `.glass-card` elements to use GSAP for all animation states:
  - **mouseenter**: Animates scale to 1.03 and shadow to glow using GSAP.
  - **mousemove**: Calculates mouse offset and animates rotation (rotateX, rotateY) and lift (y: -15) together using GSAP with a 0.1s duration to ensure responsive 3D parallax tilt without snapping or lag.
  - **mouseleave**: Animates rotation, scale, shadow, and lift back to their neutral states smoothly using GSAP.
  - Skips tilt listeners on mobile/touch devices (checking `!isMobile`) to prevent touch conflicts.
