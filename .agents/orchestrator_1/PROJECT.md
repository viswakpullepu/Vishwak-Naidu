# Project: Vercel Deployments Audit

## Architecture
Portfolio website containing project showcases with Vercel deployment links and GSAP/CSS animations.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | M1: Vercel Link Discovery & Verification | Search all Vercel deployment links and check HTTP status codes | None | DONE |
| 2 | M2: Broken Link Resolution | Fix broken URLs via inference/CLI or add red border CSS tags | M1 | IN_PROGRESS |
| 3 | M3: Animation Audit | Verify GSAP/CSS scroll reveals & hover states for smooth rendering/CLS | None | PLANNED |
| 4 | M4: Final Report & Verification | Generate `vercel_audit_report.md` and run build/tests | M1, M2, M3 | PLANNED |

## Interface Contracts
- `vercel_audit_report.md`: Root-level report markdown file detailing tested links, status codes, replacement URLs, red border status, and animation audit conclusions.
- CSS Red Border Tagging: CSS class or inline styling (e.g. `border: 2px solid red` / `border-red-500`) applied to broken Vercel links lacking working URLs.
