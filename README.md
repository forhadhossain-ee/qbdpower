# QBD Power Website — Premium Rebuild

A polished, mobile-first, multi-page site for **QBD Power Trading Contracting & Cleaning Services**.
Same brand palette and typography as before — rebuilt with sharper visual craft: refined color
blending, a full hover/motion system, an icon set, animated counters, and a video-ready hero.

## How to preview
1. Unzip this folder.
2. Open it in VS Code.
3. Install the **Live Server** extension (or just double-click `index.html`).
4. Click every nav link — desktop and with your browser's device toolbar in mobile width.

## File structure
```
index.html                 → Home
pages/about.html            → About
pages/services.html         → Services
pages/projects.html         → Projects
pages/team.html              → Team
pages/testimonials.html      → Testimonials
pages/contact.html           → Contact
css/style.css                → all shared styling
js/script.js                  → nav, hero, counters, carousel, reveal, form
assets/img/...                → images & video (see below)
```

## 🔌 Drop-in assets — this is the important part
You do **not** need to touch any code to add real photos, your logo, or a hero video.
Every image tag already points at the *real* filename first, and only falls back to the
bundled placeholder graphic if that file isn't there yet. Add a file with the **exact name
and folder** below and it appears on the live page automatically — refresh and it's live.

| What | Drop it here | Notes |
|---|---|---|
| Logo | `assets/img/logo.png` | Shown in header + footer. Transparent PNG recommended, ~400px tall. |
| Hero video (slide 1) | `assets/img/hero/qbd-construction-hero.mp4` | Muted, looping, autoplay. Keep it under ~15MB, landscape, no audio needed since it's muted. If this file is missing, the slide just shows the hero image instead — nothing breaks. |
| Hero images (slides 1–3) | `assets/img/hero/hero-01.jpg`, `hero-02.jpg`, `hero-03.jpg` | Also used as the video poster/fallback. Suggested: (1) an active construction/build site, (2) a handshake or site-walk with a contractor, (3) your crew or completed building. |
| MD portrait | `assets/img/general/about-placeholder.jpg` | Used on the homepage "Who We Are" panel. |
| Project photos | `assets/img/projects/project-01.jpg` … `project-07.jpg` | Matches the 7 projects in order (City Avenue Mall, Al Rawdah, Al Maha Villa, Skala Villa, Milos Tower, Al Mansour Villa, Wadi Al Sail). |
| Team photos | `assets/img/team/member-01.jpg` … `member-04.jpg` | Matches the 4 team cards in order. |

Until real files are added, the site shows tasteful branded placeholder graphics (same
crimson/forest/gold palette) so nothing ever looks broken in the meantime.

## What changed vs. the previous version
- **Color & blending** — gradient brand washes (crimson → deep crimson → forest) on CTAs,
  header nav, hero overlays and buttons instead of flat single-tone fills; gold used as a
  true accent (icons, numerals, hover states) rather than repeated everywhere.
- **Hover & motion** — every card, button, image and link now has an intentional hover
  state (lift, glow, icon shift, underline sweep). Counters animate into view on scroll.
- **Icon system** — a small hand-built line-icon set (bolt, droplet, gear, users, shield,
  pin, mail, etc.) replaces bare numbers across capabilities, services, values and contact.
- **Logo & type scale** — header logo sized down, and the whole heading scale (hero, section
  titles, page titles) trimmed down a step so the page reads calmer and more "MD-ready."
  down to a mobile keyboard-safe layout with 44px+ tap targets.
- **Mobile-first pass** — every section re-checked at 560 / 860 / 1080px: hero, trust strip,
  cards, forms and footer all re-flow cleanly, not just "shrink."
- **Hero** — now supports a real background video with automatic fallback, and slide 1/2/3
  are sequenced as *construction → trust → mission* per the brief.

## Before publishing
- Swap in real photography/video per the table above.
- Confirm the Team and Testimonials page content with the Managing Director (marked as
  draft in both files).
- Contact details (email, phone, address) — confirm current, public-facing values with QBD
  before go-live; this build keeps the values already established in the project source.
