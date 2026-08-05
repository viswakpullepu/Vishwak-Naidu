# Test Infrastructure Documentation (TEST_INFRA.md)

This document provides a comprehensive guide to the End-to-End (E2E) testing suite implemented for the Vishwak-Naidu Portfolio Website using Playwright. The testing suite validates site functionality across desktop and mobile devices.

---

## 1. Feature Inventory

The test suite covers the following 5 core features of the portfolio website:

### Feature 1: Preloader & Initialization
- **Description:** Monitors page load sequence, visual progress bar updates, and the transition of the preloader element to reveal main page content.
- **Key Elements:** `#preloader`, `.progress-bar-fill`, `main`, `#three-bg-canvas`.
- **Target Behaviors:** Preloader elements exists, progress increments, loaded class applies, main content reveals (hidden class removed), and hero canvas is attached.

### Feature 2: Responsive Navigation & Custom Cursors
- **Description:** Validates header navigation, responsive mobile menu drawer, and trailing custom cursor feedback.
- **Key Elements:** `header`, `nav`, `.mobile-nav-toggle`, `.mobile-nav-menu`, `.close-mobile-btn`, `#custom-cursor`, `#custom-cursor-ring`.
- **Target Behaviors:** Desktop nav links exist, custom cursors are present, mobile menu buttons are responsive depending on viewport width (visible on mobile, hidden on desktop).

### Feature 3: Scrollspy
- **Description:** Tracks scroll-driven navigation highlights as the user navigates or scrolls past sections.
- **Key Elements:** `header nav a`, `section#hero`, `section#about`, `section#contact`.
- **Target Behaviors:** Correct default active link, navigation hashes match target section IDs, clicking links performs hash navigation without page refresh, and scrollspy highlights active sections on scroll.

### Feature 4: Certificates Modal
- **Description:** Assures certificate and award detail interaction via an animated modal box displaying PDF embeds or images.
- **Key Elements:** `.award-card`, `#cert-modal`, `#cert-modal-iframe`, `#cert-modal-img`, `.cert-modal-close`, `.cert-modal-overlay`.
- **Target Behaviors:** Grid and cards layout, clicking PDF card triggers iframe modal, clicking image card triggers image modal, clicking close or overlay (or pressing Escape) dismisses the modal.

### Feature 5: Contact Form Validation
- **Description:** Protects the submission flow from invalid or empty input values, mocks HTTP POST payloads, and triggers visual completion states.
- **Key Elements:** `form#portfolio-contact-form`, `#form-name`, `#form-email`, `#form-phone`, `#form-message`, `#success-overlay`, `.submit-btn`.
- **Target Behaviors:** Input fields present, email and phone regex validation blocks submissions, successful mock submission shows success overlay and initiates paper plane animation.

---

## 2. Test Architecture

The tests are organized into 3 tiers to separate concerns, from happy paths to edge cases and combinations.

| Tier | Test Spec File | Scope | Test Cases |
|------|----------------|-------|------------|
| **Tier 1** | `tests/tier1_features.spec.js` | Happy path feature coverage (5 cases per feature) | 25 |
| **Tier 2** | `tests/tier2_boundaries.spec.js` | Boundary & edge cases (5 cases per feature) | 25 |
| **Tier 3** | `tests/tier3_combinations.spec.js` | Cross-feature pairwise combinations | 5 |
| **Total** | | | **55** |

---

## 3. Network Mocking & Isolation Strategy

To satisfy the **CODE_ONLY** network restriction and ensure the test suite is 100% network-independent:
- All HTTP `POST` requests to `https://formspree.io/f/xpqezneo` are intercepted via Playwright's `page.route` API.
- The route handler mocks a successful JSON response (`{ ok: true }`, status code `200`) without sending any actual traffic over the network.

Example mock implementation pattern:
```javascript
await page.route('https://formspree.io/f/xpqezneo', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ ok: true }),
  });
});
```

---

## 4. Coverage Thresholds

To pass verification, the test suite must satisfy the following thresholds:
- **E2E Feature Happy Path (Tier 1):** 100% (25/25 cases pass)
- **E2E Boundary Cases (Tier 2):** 100% (25/25 cases pass)
- **Cross-feature Combinations (Tier 3):** 100% (5/5 cases pass)
- **Total E2E test cases:** 55 cases passing on both `chromium` and `mobile-chrome` project configurations.

---

## 5. Execution Commands

Use the following Playwright CLI commands to execute the tests:

- **Run all E2E tests (Desktop & Mobile):**
  ```bash
  npx playwright test --project=chromium --project=mobile-chrome
  ```

- **Run a specific spec file (e.g. Tier 1):**
  ```bash
  npx playwright test tests/tier1_features.spec.js --project=chromium
  ```

- **Run in headed mode for visual debugging:**
  ```bash
  npx playwright test --project=chromium --headed
  ```
