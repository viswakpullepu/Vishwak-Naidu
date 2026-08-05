# Project: Portfolio Website Refactoring

## Architecture
- **Frontend Architecture**: Pure HTML5, CSS3, and vanilla JS website.
  - `index.html`: Holds the page structure, certificates grid, career highlights, contact form, etc.
  - `style.css`: Controls layout, responsive media queries, card styles, and animations.
  - `script.js`: Handles interactive components (GSAP animations, Lenis smooth scrolling, Three.js hero particles, contact form validation, modal overlays).
- **Core Dependencies/CDNs**: GSAP, Lenis, Three.js, TagCloud, FontAwesome.

## Code Layout
- `index.html`: Main HTML file.
- `style.css`: Stylesheet.
- `script.js`: Javascript file.
- `assets/`: Image and PDF assets.
- `.agents/orchestrator_refactor/`: Agent coordination directory.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | E2E Test Suite Creation | Design and implement an automated E2E test suite (Tiers 1-4). Output: `TEST_READY.md`. Delegated to E2E Testing Track Orchestrator. | None | IN_PROGRESS (Conv ID: 5c9b0477-31b5-4fe5-9fb2-0cd8121f6699) |
| 2 | Responsive Certificates Redesign | Redesign `.awards-grid` and `.award-card` layout and styles. Delegated to Implementation Track Orchestrator. | None | IN_PROGRESS (Conv ID: d4080c67-fa83-42b3-bf8d-892c1c641b67) |
| 3 | Global Performance & Responsiveness Pass | Audit/fix Three.js GPU leak, mobile lenis error, double cursor, undefined CSS variables. Delegated to Implementation Track Orchestrator. | None | IN_PROGRESS (Conv ID: d4080c67-fa83-42b3-bf8d-892c1c641b67) |
| 4 | Final E2E Test Pass (Tiers 1-4) | Validate the refactored frontend against the E2E test suite. Run sequentially. Delegated to Implementation Track Orchestrator. | M1, M2, M3 | PLANNED |
| 5 | Adversarial Coverage Hardening (Tier 5) | Challenger-initiated white-box testing. Delegated to Implementation Track Orchestrator. | M4 | PLANNED |

## Interface Contracts
Since this is a client-side monolith, the interfaces are defined by:
- **DOM structure and selectors**: CSS selectors like `.awards-grid`, `.award-card`, `#cert-modal`, `#portfolio-contact-form`, `#custom-cursor`.
- **Global JS Namespace**: Global variables such as `lenis`, and event handlers bound to the window/document.
- **Window Events**: Scrolling (scrollspy, scroll animations), Resize (responsive triggers).
