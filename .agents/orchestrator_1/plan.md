# Orchestration Plan — Vercel Deployments Audit Project

## Overview
This project performs an end-to-end audit and resolution of Vercel deployment links and animations in the portfolio website.

## Milestones
- **M1: Vercel Link Discovery & Verification**
  - Search codebase for all Vercel deployment URLs (`.vercel.app`, Vercel project links).
  - Verify HTTP status code (200 OK vs 404/broken) for each link.
- **M2: Broken Link Resolution**
  - For any 404/broken links found in M1:
    1. Infer URL from associated GitHub repository name (e.g., `repo-name.vercel.app`).
    2. Check Vercel CLI via `vercel ls` for exact active deployment URL.
    3. If no working URL exists, apply CSS class/inline style for red border around the link element for manual review.
- **M3: Animation Audit**
  - Audit GSAP/CSS scroll reveals and hover states in the Vercel/Projects section.
  - Verify smooth animation execution without layout shifts (CLS).
- **M4: Final Report & Verification**
  - Generate comprehensive `vercel_audit_report.md` documenting all tested links, status codes, replacement URLs, red border markings, and animation check results.
  - Require worker/reviewer subagent to run build and tests to ensure no regressions.

## Execution Strategy
1. M1: Dispatch `teamwork_preview_explorer` to scan codebase for Vercel links and run HTTP checks on them.
2. M2: Dispatch `teamwork_preview_worker` to resolve broken links (inference, `vercel ls`, or red border CSS tagging).
3. M3: Dispatch `teamwork_preview_explorer` or `teamwork_preview_worker` to audit GSAP/CSS animations for smooth rendering and zero layout shift.
4. M4: Dispatch `teamwork_preview_worker` to generate `vercel_audit_report.md` and run project build/tests, followed by `teamwork_preview_reviewer` and `teamwork_preview_auditor` verification.
5. Send final completion signal to main agent (Sentinel).
