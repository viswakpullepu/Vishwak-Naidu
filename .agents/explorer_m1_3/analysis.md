# Vercel Deployment Link Discovery & Verification Analysis

## Executive Summary
This report presents the exhaustive pattern matching, structural code analysis, and link discovery results for Vercel deployment links across the `Vishwak-Naidu` portfolio repository. 

Key Findings:
1. **Dynamic Link Resolution Architecture**: The portfolio website (`index.html`, `script.js`) does **not** hardcode static Vercel deployment links (`https://*.vercel.app`). Instead, `script.js` dynamically fetches the user's public repositories from the GitHub REST API (`https://api.github.com/users/viswakpullepu/repos`) and filters for items where `repo.homepage` contains `vercel.app`.
2. **Repository Inventory**: 20 repositories are registered in the portfolio's `repoDataMap` (`script.js:1041-1061`).
3. **Network & HTTP Status Constraint**: Under CODE_ONLY network constraints, external outbound HTTP requests (e.g. `curl`, `wget`, or HTTP status pinging) are prohibited. As a result, live HTTP verification for the 20 inferred candidate URLs is categorized as Network Restricted / Pending M2 Resolution.

---

## 1. Pattern Matching & Discovery Results

### 1.1 Codebase Search Scope
A repository-wide pattern match was conducted across all HTML, JS, CSS, JSON, and MD files for patterns including `vercel.app`, `vercel.com`, `deploy`, `vercel`, `https://`, and `http://`.

| File Path | Match Type | Content / Context | Line Number |
|-----------|------------|-------------------|-------------|
| `index.html` | Section Navigation | `<a href="#vercel">Live Apps</a>` | 71, 88 |
| `index.html` | Section Container | `<section id="vercel" class="reveal-on-scroll">` | 593-611 |
| `script.js` | Logic Filter | `repos.filter(repo => repo.homepage && repo.homepage.includes("vercel.app"))` | 1110 |
| `script.js` | DOM Injection | `card.href = repo.homepage;` | 1119 |
| `script.js` | UI Rendering | `${repo.homepage.replace('https://', '')}` | 1141 |
| `script.js` | Empty State | `"No active Vercel deployments found."` | 1148 |

### 1.2 Identified Project Repositories (`repoDataMap`)
The following 20 repositories are configured in `script.js` (lines 1041–1061):

| # | Repository Name | Category / Type | Description Summary | Inferred Vercel Deployment URL (`<repo>.vercel.app`) |
|---|-----------------|-----------------|---------------------|-------------------------------------------------------|
| 1 | `activity-generator` | Digital Tool | Custom activity & workflow tracker | `https://activity-generator.vercel.app` |
| 2 | `anon-chat` | Web App | Real-time anonymous messaging platform | `https://anon-chat.vercel.app` |
| 3 | `Canarytoken` | Cybersecurity Tool | Trap & tracking system for unauthorized access | `https://canarytoken.vercel.app` |
| 4 | `cvresportsoff` | Web Service | Export & management utility for CV/esports | `https://cvresportsoff.vercel.app` |
| 5 | `demo-restaurant-backend` | Backend API | Server architecture & DB management for restaurant app | `https://demo-restaurant-backend.vercel.app` |
| 6 | `demo-restaurant-frontend` | Web App | Customer-facing restaurant ordering interface | `https://demo-restaurant-frontend.vercel.app` |
| 7 | `interior-design` | Website | Landing page for interior design services | `https://interior-design.vercel.app` |
| 8 | `kotha-s-atelier` | Web App | Digital presentation app for an atelier | `https://kotha-s-atelier.vercel.app` |
| 9 | `LORVEN` | Digital Agency | Corporate portfolio & service showcase | `https://lorven.vercel.app` |
| 10 | `ngl---clone` | Web App | Anonymous Q&A frontend platform | `https://ngl-clone.vercel.app` |
| 11 | `password-strength-checker` | Security Utility | Cryptographic tool for password entropy | `https://password-strength-checker.vercel.app` |
| 12 | `ppt-reviewer-agent` | AI Tool | FastAPI presentation analyzer & reviewer | `https://ppt-reviewer-agent.vercel.app` |
| 13 | `professional-resume` | Digital Profile | Code-based professional resume repository | `https://professional-resume.vercel.app` |
| 14 | `resume-builder-app` | Web App | Full-stack resume maker with AI suggestions | `https://resume-builder-app.vercel.app` |
| 15 | `resume-maker` | Digital Tool | Client-side PDF resume generator | `https://resume-maker.vercel.app` |
| 16 | `REVISO` | Landing Page | Pre-registration portal with modern UI | `https://reviso.vercel.app` |
| 17 | `Vishwak-Naidu` | Portfolio Website | Primary portfolio website | `https://vishwak-naidu.vercel.app` |
| 18 | `viswak-portfolio` | Website | Alternative portfolio website | `https://viswak-portfolio.vercel.app` |
| 19 | `viswakpullepu` | Profile Readme | Foundational GitHub profile README | `https://viswakpullepu.vercel.app` |
| 20 | `vn-music-assistant` | Web App | Audio playback & frequency analysis utility | `https://vn-music-assistant.vercel.app` |

---

## 2. Link Categorization & Status

| Category | Status Code | Count | Description / Notes |
|----------|-------------|-------|---------------------|
| **Live (Verified)** | 200 OK | 0 | Prohibited from external HTTP pinging under CODE_ONLY network mode. |
| **Broken** | 404 / Error | 0 | Prohibited from external HTTP pinging under CODE_ONLY network mode. |
| **Unreachable / Sandboxed** | N/A | 20 (Inferred) | Outbound network requests disabled in CODE_ONLY execution environment. |

---

## 3. Findings & Recommendations for Downstream Milestones (M2 / M4)

1. **Static Fallback Data Needed for Offline/Resilient Display**:
   - Currently, if the GitHub REST API (`api.github.com`) rate limits or fails, or if `repo.homepage` is empty, the `#vercel-deployments` container displays an error box or empty state.
   - Recommend defining a static fallback deployment list or fallback metadata array in `script.js` so that verified Vercel links render reliably even without live GitHub API responses.

2. **Broken Link Tagging (M2 Requirement)**:
   - For any project repository whose deployment link returns non-200 or is unassigned in GitHub `homepage`, M2 should ensure the UI gracefully tags the element (e.g. applying `.vercel-card-broken` with red border styling) as required by project specification.

3. **Animation Refresh**:
   - Notice line 1153 of `script.js`: `ScrollTrigger.refresh()` is called after dynamically appending cards. M3 should verify that dynamically injected cards do not cause Cumulative Layout Shift (CLS).
