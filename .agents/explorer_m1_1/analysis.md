# Detailed Analysis: Vercel Link Discovery & Verification (Milestone 1)

**Agent:** Explorer 1 (`explorer_m1_1`)  
**Project:** Vishwak-Naidu Portfolio Website  
**Date:** 2026-08-05  

---

## 1. Executive Summary

A comprehensive scan of all source files (`index.html`, `script.js`, `style.css`), configuration files (`package.json`, `playwright.config.js`), documentation files (`*.md`), and test scripts (`tests/*.spec.js`) was performed to locate and document all Vercel deployment URLs and mechanisms within the repository.

### Summary of Key Discoveries:
1. **Dynamic Link Generation Model:** There are **zero hardcoded static Vercel URLs** (`*.vercel.app`) in the portfolio HTML or CSS files. Instead, `script.js` dynamically fetches public repositories from GitHub (`https://api.github.com/users/viswakpullepu/repos`) and filters for repositories where `repo.homepage` contains `"vercel.app"`.
2. **Vercel DOM Container:** The DOM container `<div id="vercel-deployments" class="vercel-grid">` (`index.html`, line 608) acts as the mount point for dynamic Vercel cards.
3. **Repository Catalog & Inferred URLs:** 20 repositories are registered in `script.js` (`repoDataMap`, lines 1041–1062). Inferred Vercel URLs based on GitHub repository naming conventions have been compiled.
4. **Environment Constraint (HTTP Verification):** Due to strict `CODE_ONLY` network mode restrictions, outbound HTTP requests targeting live Vercel servers are blocked in this environment.

---

## 2. Codebase Scan Findings & Evidence

### 2.1. DOM Structure (`index.html`)
- **Line 71 & 88:** Desktop & mobile navigation items linking to `#vercel`:
  ```html
  <li><a href="#vercel">Live Apps</a></li>
  ```
- **Lines 593–611:** Section `#vercel` container:
  ```html
  <section id="vercel" class="reveal-on-scroll">
    <div class="section-header" style="text-align: center; margin-bottom: 60px;">
      ...
      <h2 class="section-title">Vercel Deployments</h2>
    </div>
    <div id="vercel-loading" ...>Locating Deployments...</div>
    <div id="vercel-deployments" class="vercel-grid" style="display: none;"></div>
  </section>
  ```

### 2.2. Dynamic Link Processing (`script.js`)
- **Lines 1105–1150:** Dynamic Vercel deployment card rendering:
  ```javascript
  const vercelLoading = document.getElementById("vercel-loading");
  const vercelContainer = document.getElementById("vercel-deployments");

  if (vercelLoading && vercelContainer) {
    // Filter repos that have a homepage containing 'vercel.app'
    const vercelRepos = repos.filter(repo => repo.homepage && repo.homepage.includes("vercel.app"));
    
    if (vercelRepos.length > 0) {
      vercelLoading.style.display = "none";
      vercelContainer.style.display = "";
      
      vercelRepos.forEach(repo => {
        const card = document.createElement("a");
        card.href = repo.homepage;
        card.target = "_blank";
        card.className = "vercel-card";
        ...
        card.innerHTML = `... <span ...>${repo.homepage.replace('https://', '')}</span> ...`;
        vercelContainer.appendChild(card);
      });
    } else {
      vercelLoading.innerHTML = "<p>No active Vercel deployments found.</p>";
    }
  }
  ```

### 2.3. Project Configurations
- **`package.json`**: Contains no Vercel build/deploy scripts or dependencies.
- **Root Directory**: No `.vercel/` folder or `vercel.json` configuration file exists.

---

## 3. Discovered & Inferred Vercel Link Inventory

The table below catalogs all 20 repositories mapped in `script.js` (`repoDataMap`, lines 1041-1062) alongside their file location, inferred Vercel URL, and status.

| # | Repository Name | File Reference | Inferred Vercel URL | HTTP Status Code | Live/Broken Status | Notes |
|---|-----------------|----------------|---------------------|------------------|--------------------|-------|
| 1 | `activity-generator` | `script.js:1042` | `https://activity-generator.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 2 | `anon-chat` | `script.js:1043` | `https://anon-chat.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 3 | `Canarytoken` | `script.js:1044` | `https://canarytoken.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 4 | `cvresportsoff` | `script.js:1045` | `https://cvresportsoff.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 5 | `demo-restaurant-backend` | `script.js:1046` | `https://demo-restaurant-backend.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 6 | `demo-restaurant-frontend` | `script.js:1047` | `https://demo-restaurant-frontend.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 7 | `interior-design` | `script.js:1048` | `https://interior-design.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 8 | `kotha-s-atelier` | `script.js:1049` | `https://kotha-s-atelier.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 9 | `LORVEN` | `script.js:1050` | `https://lorven.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 10 | `ngl---clone` | `script.js:1051` | `https://ngl-clone.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 11 | `password-strength-checker` | `script.js:1052` | `https://password-strength-checker.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 12 | `ppt-reviewer-agent` | `script.js:1053` | `https://ppt-reviewer-agent.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 13 | `professional-resume` | `script.js:1054` | `https://professional-resume.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 14 | `resume-builder-app` | `script.js:1055` | `https://resume-builder-app.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 15 | `resume-maker` | `script.js:1056` | `https://resume-maker.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 16 | `REVISO` | `script.js:1057` | `https://reviso.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 17 | `Vishwak-Naidu` | `script.js:1058` | `https://vishwak-naidu.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Primary portfolio repo |
| 18 | `viswak-portfolio` | `script.js:1059` | `https://viswak-portfolio.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |
| 19 | `viswakpullepu` | `script.js:1060` | `https://viswakpullepu.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Profile README repo |
| 20 | `vn-music-assistant` | `script.js:1061` | `https://vn-music-assistant.vercel.app` | N/A (CODE_ONLY) | Unverified (Network Restricted) | Candidate for GitHub `homepage` |

---

## 4. Architectural Observations & Risk Identification

1. **API Rate Limiting Dependency:** Because Vercel cards are only populated after querying `api.github.com/users/viswakpullepu/repos`, unauthenticated client-side API rate limits (60 requests/hour/IP) cause the Vercel section to fall back to the error message `<p>Could not load live projects at this time.</p>` (`script.js:1164`) when rate-limited.
2. **Missing Hardcoded Fallbacks:** Unlike `repoDataMap` which provides fallback descriptions/images for GitHub repos, the Vercel deployments section (`script.js:1105–1150`) has zero hardcoded fallback items when the API fetch fails or returns 0 repos with `.vercel.app` homepages.
3. **HTTP Status Code Verification Requirement:** In production or testing environments with network permissions enabled, executing `curl -I <url>` or `fetch(<url>)` for each inferred URL will establish exact 200 OK vs 404 Not Found status.

