# Scope: E2E Testing Track

## Architecture
- **E2E Testing Infrastructure**: Designs and implements a test runner and cases to run opaque-box tests against the portfolio website.
- **Verification Channel**: Since the website is pure HTML/CSS/JS, the tests should run in a headless browser environment (e.g., using a node-based runner like Playwright, Puppeteer, or a simple custom JS script executing in Node/JSDOM/Playwright, or PowerShell test scripts leveraging Chrome/Edge WebDriver) that can check viewports, responsiveness, scroll performance, chronological ordering, and click behaviors.
  - Let's check if there is an existing Node setup. `node_modules` exists in the workspace. Let's see what testing packages are available or can be used. (Note: Worker will design the exact test infra).

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Test Infra Setup | Establish the testing framework/runner and basic assertion helpers. | None | DONE |
| 2 | Tier 1-3 Tests Implementation | Implement feature coverage (Tier 1), boundary & corner cases (Tier 2), and cross-feature combination tests (Tier 3). | M1 | IN_PROGRESS (Conv ID: 84307092-8b04-4ba2-a74f-024697fbc6d3) |
| 3 | Tier 4 Workload Tests | Implement real-world workload application scenario tests. | M2 | PLANNED |
| 4 | Test Readiness Declaration | Verify all tests are operational and publish `TEST_READY.md` to the workspace root. | M3 | PLANNED |

## Interface Contracts
- The E2E tests interact with the portfolio website exclusively via:
  - Responsive viewports (e.g., mobile at 320px, tablet, desktop).
  - DOM elements and classes: `.award-card`, `.awards-grid`, `#cert-modal`, etc.
  - Scroll and mouse events.
