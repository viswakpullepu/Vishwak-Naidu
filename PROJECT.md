# Project: Portfolio Website CSS & Layout Audit & Responsive Fixes

## Architecture
- **Web Stack**: Static HTML5 (`index.html`), CSS3 (`style.css`), JavaScript (`script.js`), FontAwesome / Icon sets, Media Queries.
- **Scope**: Portfolio sections (Navbar, Hero, About, Skills, Projects, Experience/Education, Contact, Footer, Mobile Drawer/Toggle).
- **Target Breakpoints**:
  - Small Mobile: 320px - 479px
  - Mobile / Large Mobile: 480px - 767px
  - Tablet: 768px - 1023px
  - Desktop / Laptop: 1024px - 1439px
  - Large Desktop: 1440px+

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | CSS & Layout Audit | Comprehensive analysis of index.html, style.css, script.js across all breakpoints (320px+) | None | DONE |
| 2 | Responsive Bug Fixes | Fix layout breaks, overflow, alignment, media queries, CSS bugs | M1 | DONE |
| 3 | Verification & Forensic Audit | Multi-reviewer, challenger, and forensic auditor verification | M2 | DONE |
| 4 | Issue Reporting | Synthesize & generate audit_and_fixes.md report artifact | M3 | DONE |

## Interface Contracts & Layout Rules
- **CSS Architecture**: Clean selector hierarchy, CSS variables for colors/spacing where applicable, mobile-first or consistent media query ordering.
- **Breakpoints Standard**: `@media screen and (max-width: ...px)` or `@media screen and (min-width: ...px)` consistent strategy.
- **Overflow Prevention**: `max-width: 100%`, `overflow-x: hidden` on container level where appropriate, flexible flexbox/grid basis.
- **Accessibility & UX**: Tap targets >= 44px on mobile, readable font sizes (>= 14px body on mobile, >= 16px inputs on mobile), proper contrast, interactive state feedback.

## Code Layout
- Root: `index.html`, `style.css`, `script.js`, `audit_and_fixes.md`
- Sub-assets: `assets/`, `images/`, `icons/`
