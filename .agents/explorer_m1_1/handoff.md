# Handoff Report — Milestone 1 (Vercel Link Discovery & Verification)

**Agent:** Explorer 1 (`explorer_m1_1`)  
**Target Folder:** `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu\.agents\explorer_m1_1`  
**Date:** 2026-08-05  

---

## 1. Observation

- **Source Code Locations & Code Snippets:**
  - `index.html:71` & `index.html:88`: `<a href="#vercel">Live Apps</a>` navigation links.
  - `index.html:593–611`: `<section id="vercel">` containing container `<div id="vercel-deployments" class="vercel-grid" style="display: none;"></div>`.
  - `script.js:1111`: Filter logic `const vercelRepos = repos.filter(repo => repo.homepage && repo.homepage.includes("vercel.app"));`.
  - `script.js:1041–1062`: `repoDataMap` containing 20 registered GitHub repositories (`activity-generator`, `anon-chat`, `Canarytoken`, `cvresportsoff`, `demo-restaurant-backend`, `demo-restaurant-frontend`, `interior-design`, `kotha-s-atelier`, `LORVEN`, `ngl---clone`, `password-strength-checker`, `ppt-reviewer-agent`, `professional-resume`, `resume-builder-app`, `resume-maker`, `REVISO`, `Vishwak-Naidu`, `viswak-portfolio`, `viswakpullepu`, `vn-music-assistant`).
- **Static File Scan Result:** Zero hardcoded `*.vercel.app` strings exist in any HTML, JS, CSS, JSON, or MD files in the project. All deployment links are dynamically created at client runtime from GitHub API responses.
- **Environment & Tool Commands:** 
  - `grep_search` for `vercel.app` in `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu` returned matches only in `.agents/` and `script.js` line 1111.
  - Operating mode is `CODE_ONLY` network mode; outbound HTTP calls were not permitted by environment rules.

---

## 2. Logic Chain

1. **Discovery Mechanism:** The website relies on runtime integration with GitHub's REST API (`https://api.github.com/users/viswakpullepu/repos?sort=updated&per_page=20`).
2. **Dynamic Filtering:** `script.js` checks each fetched repository's `homepage` property. If `homepage` includes `"vercel.app"`, it constructs a card with `card.href = repo.homepage` and appends it to `#vercel-deployments`.
3. **Repository URL Mapping:** Based on the 20 repository keys present in `script.js` (`repoDataMap`), the inferred Vercel URLs follow the pattern `https://<repo-name-slug>.vercel.app`.
4. **Resilience Risk:** If GitHub API returns 0 repositories with a `homepage` set or encounters rate limits, the Vercel section renders `<p>No active Vercel deployments found.</p>` or `<p>Could not load live projects at this time.</p>`.

---

## 3. Caveats

1. **Network Restrictions (CODE_ONLY):** Live HTTP GET/HEAD requests to test status codes (200 OK vs 404 Not Found) for external domain names (`*.vercel.app`) could not be executed within this agent's `CODE_ONLY` restricted network environment.
2. **GitHub API State Dependence:** Actual rendered links depend on the live `homepage` field set on GitHub.com for user `viswakpullepu` at the moment of page load.

---

## 4. Conclusion

- **Link Architecture:** The project uses dynamic discovery via GitHub API `homepage` metadata rather than static HTML link tags.
- **Discovered Inventory:** 20 repositories are registered in the frontend mapping; corresponding inferred Vercel URLs have been documented in `analysis.md`.
- **Recommendation for M2 (Broken Link Resolution):** M2 implementers should consider providing a static fallback array of verified Vercel URLs or Vercel CLI integration to ensure cards render even when GitHub API rate limiting occurs or `homepage` metadata is missing.

---

## 5. Verification Method

1. **Inspect Files & Lines:**
   - Run `view_file` on `index.html` lines 593–611 to verify `#vercel` container.
   - Run `view_file` on `script.js` lines 1041–1062 and lines 1105–1150 to verify `repoDataMap` and Vercel filtering logic.
2. **Search Invalidation Check:**
   - Execute `grep_search` for `vercel.app` across non-`.agents` files to verify zero static deployment URLs are hardcoded in source code.
3. **Report Verification:**
   - Inspect `c:\Users\gampa pranith\OneDrive\Desktop\Vishwak-Naidu\.agents\explorer_m1_1\analysis.md` for complete 20-repo URL inventory.
