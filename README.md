# Shingeki — Attack on Titan Interactive Fan Tribute

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-red?style=flat-square)
![Status](https://img.shields.io/badge/Status-Active%20Development-gold?style=flat-square)

> *A cinematic, scroll-driven fan tribute to Attack on Titan — built to demonstrate advanced animation engineering and UI composition.*

---

## About The Project

Shingeki is a single-page cinematic experience dedicated to Hajime Isayama's *Attack on Titan*. It is not a content aggregator or a React tutorial app — it is a deliberate exercise in **scroll-driven animation architecture**, cinematic visual design, and component-level GSAP orchestration.

Every section is a self-contained scroll narrative: video scrubbing synced to scroll position in the Hero, horizontally scrolling character cards in Character Profiles, a scrolljacked battle timeline with live rope-draw animation, a schematic SVG diagram with sequenced leader-line annotations, cinematic panel wipes in the Scene Gallery, and odometer counters in the Stats section.

The project was built with a deliberate focus on animation engineering — not just making things move, but making them move *correctly*, with precise timeline scrubbing, scroll-synced state, and graceful fallbacks for missing assets.

---

## Live Demo

| Link | Description |
|---|---|
| Frontend | [Live Demo](https://attack-on-titan-website-nine.vercel.app/) |
| Demo Video | [Watch Walkthrough ](#) |

---

## Project Type

**Scroll-Driven Cinematic SPA** — Frontend animation engineering showcase, fan tribute, and GSAP architecture study.

---

## Project Status

**Active Development** — Core sections are complete and functional. Asset pipeline (images, video) is left to the deployer. Mobile responsiveness is handled but not deeply tested across all breakpoints.

---

## Why I Built This

GSAP's `ScrollTrigger` is one of the most powerful tools in the frontend ecosystem, but most tutorials show only basic parallax or fade-ins. This project was an attempt to push further:

- Can a video be scrubbed frame-by-frame using scroll position?
- Can horizontal scroll be precisely tied to a vertical scroll timeline?
- Can SVG annotations be drawn in sequentially as the user scrolls, like a technical diagram being assembled?
- Can full-screen panel transitions feel cinematic without a single `<video>` transition?

Each section answers one of these questions through implementation.

---

## Features

### Core Sections

- **Hero** — Scroll-scrubbed video playback (`video.currentTime` set per scroll frame), with three distinct narrative chapters fading in and out across the scroll timeline
- **Character Profiles** — Horizontal scroll track (13 characters) driven by vertical scroll; cards animate in with `rotateY` + blur; hover-triggered stats panel with CSS transform slide-up
- **Survey Corps Oath** — Fullscreen word-scatter animation; individual letters launched from random polar coordinates and resolved to position; rotating Survey Corps emblem via `mix-blend-mode: screen`
- **Titan Size Comparison** — Proportional scale comparison of 6 titans built entirely with SVG-like CSS; measurement tick marks; fog dissipation on scroll
- **Battle Timeline** — Horizontal scrolling event nodes connected by an SVG rope with a `strokeDashoffset` draw-in animation; season filter pills with live re-render and re-initialised ScrollTrigger
- **ODM Gear Schematic** — Hand-drawn SVG schematic of ODM gear; 9 annotated parts; leader lines draw in sequentially; hover isolates parts with dimming; fixed tooltip follows cursor
- **Scene Gallery** — Five full-screen cinematic panels with clip-path wipe transitions; large typographic quote masks; Ken Burns image zoom; alternating text entrance/exit
- **Stats Counter** — Odometer-style number counters; glitch CSS animation on hover; counters reset on scroll-back; featured card spanning two columns
- **Final CTA** — Particle system (22 floating particles), mouse parallax on background image, infinite GSAP marquee ticker, entrance timeline

### Engineering Features

- All scroll animations use GSAP `ScrollTrigger` with `scrub` — no `requestAnimationFrame` polling
- `ScrollTrigger.getAll().forEach(t => t.kill())` cleanup in every `useEffect` return — no memory leaks
- Sub-components extracted from `.map()` calls throughout to satisfy React Hooks rules (`CharacterCard`, `StatItem`, `TimelineNode`, `SeasonButton`, etc.)
- CSS custom properties (`--void`, `--red`, `--gold`) shared across all 10 component style sheets via `:root` declarations
- `onError` handlers on every `<img>` for graceful degradation when assets are absent
- Defensive `video.readyState >= 1` check before setting up scroll timeline in Hero

### Visual Design Features

- Film grain overlay on every section (animated SVG `feTurbulence` filter)
- Cinematic typography stack: Cinzel Decorative (display), Cinzel (UI), IM Fell English (italic body)
- Consistent dark colour palette: `#06060a` void black, `#9b1a1a` blood red, `#c4a450` antique gold
- `backdrop-filter: blur` on navbar when scrolled; animated burger → close transition
- `-webkit-text-stroke` + `background-clip: text` for hollow outlined display text

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | React 19 | Concurrent features; component model fits section-based architecture |
| **Build Tool** | Vite 8 | Sub-second HMR; native ES module output; fastest dev feedback loop available |
| **Animation** | GSAP 3.15 + ScrollTrigger | Industry standard for timeline-based scroll animation; scrub API is uniquely suited to this use case |
| **Styling** | Vanilla CSS Modules (per-component) | No runtime overhead; `:root` CSS variables for design tokens; full control over animation state via class toggling |
| **Fonts** | Google Fonts (Cinzel Decorative, Cinzel, IM Fell English) | Thematic serif stack matching the period-weight aesthetic |
| **Linting** | ESLint 10 + react-hooks + react-refresh plugins | Enforces hooks rules that are genuinely load-bearing for this project |

---

## Architecture

This is a purely client-side single-page application. There is no backend, no API, no state management library. The architecture is entirely component-local.

```
App
├── Navbar            (fixed, scroll-aware via window.scroll listener)
├── Hero              (scroll-scrubbed video + 3-chapter narrative)
├── CharacterProfiles (horizontal scroll, 13 cards)
├── SurveyCoresOath   (word scatter animation, emblem rotation)
├── TitanSize         (proportional scale diagram, fog dissipation)
├── BattleTimeline    (horizontal scroll, SVG rope, season filter)
├── ODMGear           (SVG schematic, leader lines, hover tooltips)
├── SceneGallery      (5 full-screen panel wipes)
├── StatsCounter      (odometer counters, glitch hover)
└── FinalCTA          (particle system, parallax, marquee)
```

### Scroll Architecture

Every section (except StatsCounter and FinalCTA) uses the same structural pattern:

```
<section ref={sectionRef}>           ← tall element; defines scroll distance
  <div className="*-sticky">         ← position: sticky; top: 0; height: 100vh
    ...animated content...
  </div>
</section>
```

`section.style.height` is set dynamically in `useEffect` based on the desired scroll duration. GSAP `ScrollTrigger` pins the sticky div and drives the timeline via `scrub`.

### GSAP Timeline Lifecycle

```
useEffect(() => {
  const tl = gsap.timeline({ scrollTrigger: { scrub: 1.x, ... } })
  tl.fromTo(...)  // animation keyframes
  return () => ScrollTrigger.getAll().forEach(t => t.kill())  // cleanup
}, [dependency])
```

Re-renders that change scroll content (e.g., the season filter in BattleTimeline) kill all existing ScrollTriggers and reinitialise — this is correct but has a brief flash; future improvement would use targeted `stRef.current.kill()`.

---

## Folder Structure

```
/
├── public/
│   ├── video/
│   │   └── one.mp4              ← Hero scroll-scrubbed video (not included)
│   ├── images/
│   │   ├── chars/               ← 13 character portrait PNGs (not included)
│   │   ├── scenes/              ← 5 scene gallery images (not included)
│   │   ├── Human.png            ← Titan size comparison assets (not included)
│   │   ├── PureTitan.png
│   │   ├── ArmoredTitan.png
│   │   ├── FemaleTitan.png
│   │   ├── BeastTitan.png
│   │   ├── col.png
│   │   ├── survey-corps-emblem.png
│   │   └── cta-bg.jpg
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .css
│   │   ├── Hero.jsx / .css
│   │   ├── CharacterProfiles.jsx / .css
│   │   ├── SurveyCoresOath.jsx / .css
│   │   ├── Titansize.jsx / .css
│   │   ├── BattleTimeline.jsx / .css
│   │   ├── ODMGear.jsx / .css
│   │   ├── SceneGallery.jsx / .css
│   │   ├── StatsCounter.jsx / .css
│   │   └── FinalCTA.jsx / .css
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/Heramb1221/shingeki.git
cd shingeki

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```
---

## Environment Variables

This project has no environment variables. It is entirely client-side with no API keys or backend configuration.

---

## Usage

The site is a linear scroll narrative. Open it in a browser, and scroll. Each section is designed to be experienced in sequence:

1. **Hero** — Scroll to advance the video and reveal three narrative titles
2. **Character Profiles** — Continue scrolling to pan through 13 character cards; hover a card for stats
3. **Survey Corps Oath** — Scroll through the word-scatter oath animation
4. **Titan Size** — Watch each titan rise from below as you scroll
5. **Battle Timeline** — Scroll to pan the horizontal timeline; use season filter pills to narrow events
6. **ODM Gear** — Leader lines draw in as you scroll; hover parts to isolate and inspect them
7. **Scene Gallery** — Five full-screen panels wipe in sequence; read each quote
8. **Stats** — Counters fire on enter; hover cards for the glitch re-count
9. **Final CTA** — Particles, parallax, marquee

---


## Performance Considerations

**What was done well:**

- GSAP `scrub` uses `requestAnimationFrame` internally and batches DOM writes — no manual RAF loops
- `will-change: transform` applied to all scroll-animated elements to promote GPU compositing
- Images use `user-select: none` and `-webkit-user-drag: none` to prevent unintended browser drag interactions
- Film grain animation uses CSS `@keyframes` on a pseudo-element overlay — not a canvas or JS loop
- Sub-components are extracted and stable references (not inline arrow components) to avoid remounting on parent re-render

**Known performance considerations:**

- The film grain `feTurbulence` SVG filter is rendered in every section simultaneously. On lower-end devices, this may cause GPU memory pressure. A single shared grain overlay at the app level would be more efficient.
- `ScrollTrigger.getAll().forEach(t => t.kill())` in BattleTimeline kills *all* ScrollTriggers (including those from other sections) when the filter changes. This is a bug — it should target only the component's own triggers via a stored ref.
- The Hero video `currentTime` scrubbing can cause frame-decode jank on slower connections or devices without hardware-accelerated video decoding. A poster image fallback is not currently implemented.
- 10 separate Google Fonts `@import` declarations (one per component CSS file) will result in 10 duplicate network requests for the same font URLs. Consolidating to a single import in `index.css` would eliminate redundant fetches.

---


## Tradeoffs & Limitations

**ScrollTrigger global kill on filter change** — When the season filter in BattleTimeline changes, `ScrollTrigger.getAll().forEach(t => t.kill())` is called. This nukes every ScrollTrigger on the page, not just BattleTimeline's. The other sections' animations stop responding until the user re-scrolls past them. The fix is to store component-specific ScrollTriggers in a `useRef` and kill only those.

**No TypeScript** — The project uses plain JavaScript/JSX. Given the complexity of the GSAP ref patterns and the data schemas, TypeScript would provide meaningful safety. This was a deliberate choice to keep iteration speed high during the design phase — it is the most meaningful technical debt in the codebase.

**No image optimisation pipeline** — Assets are served directly from `/public`. There is no WebP conversion, responsive `srcset`, or lazy loading. For a production deployment this would need to be addressed.

**Hardcoded data** — All character data, event data, and stat data lives as `const` arrays inside their respective component files. Extracting to a `/src/data/` layer would make the project significantly easier to maintain and extend.

**Mobile experience** — Responsive CSS breakpoints are in place, but the scroll-scrubbed video and complex GSAP horizontal scroll sections degrade significantly on mobile. A reduced-motion media query strategy would improve accessibility and mobile performance substantially.

---

## Known Issues

- Season filter re-render in BattleTimeline kills all page ScrollTriggers (see Tradeoffs)
- On Safari, `backdrop-filter: blur` on the Navbar may flicker during scroll due to compositing layer promotion timing
- If the Hero video fails to load, the `loadedmetadata` event never fires and the scroll timeline is never set up — the section height remains 0 and the page collapses. A timeout fallback should be added
- The ODM tooltip uses `position: fixed` with cursor coordinates — it will overflow the viewport if the cursor is in the bottom-right corner on smaller screens

---

## Challenges Faced

**Scroll timeline precision** — GSAP's `scrub` value controls how much the animation lags behind scroll. Too low and it feels mechanical; too high and it feels sluggish. Finding the right per-section `scrub` value (ranging from 1.2 to 1.8 across sections) required significant manual tuning.

**Horizontal scroll + vertical scroll coordination** — Making a horizontal track that advances as the user scrolls vertically, while keeping the section pinned, requires careful calculation of `section.style.height`. The formula `scrollDist * 1.4 + window.innerHeight` was arrived at through iteration.

**SVG schematic by hand** — The ODM Gear schematic in `Odmgear.jsx` is a 300×340 viewBox SVG drawn entirely in JSX with hardcoded coordinates. There is no design tool export — every `rect`, `path`, `circle`, and `line` was placed by hand. This was the most time-intensive part of the project.

**Video scrubbing** — Setting `video.currentTime` on every scroll frame causes the browser to decode a new video frame on each call. This is intentional and is how all cinematic scroll-video experiences work, but it required ensuring `video.readyState >= 1` before attaching the ScrollTrigger to avoid undefined duration errors.

**React Hooks rules with `.map()`** — Several sections initially mapped over arrays and passed refs via closures. ESLint's `react-hooks` plugin (correctly) flagged these as hooks-in-loops violations. The fix — extracting `CharacterCard`, `TimelineNode`, `StatCard`, `ScenePanel`, etc. as named sub-components — improved both correctness and readability.

---

## What I Learned

- **GSAP ScrollTrigger `scrub` is not a toggle** — it's a physics parameter. The value you choose fundamentally changes the feel of the interaction and needs to be tuned per-section based on how fast the user is expected to scroll through it.
- **CSS `mix-blend-mode: screen`** combined with `filter: invert()` is a clean way to render assets with white backgrounds as if they were transparent, without requiring PNG alpha channels.
- **React Hooks rules exist for good reasons** — the hooks-in-map refactors I was forced to do (extracting sub-components) made the code genuinely more readable and debuggable, not just lint-compliant.
- **GSAP cleanup is non-negotiable** — failing to kill ScrollTriggers in useEffect cleanup causes phantom triggers that fire even after the component is gone. Every `useEffect` that creates a ScrollTrigger must return a cleanup function.
- **`will-change` is a hint, not a guarantee** — overusing it can actually hurt performance by forcing GPU promotion of too many layers simultaneously. Apply it surgically to elements that are actively being animated.
- **Designing with hardcoded SVG coordinates** builds a very concrete understanding of coordinate systems, viewBox scaling, and how transforms compose — knowledge that transfers directly to animation work.

---

## License

MIT License. This is a fan tribute project. All Attack on Titan characters, story, and related IP belong to Hajime Isayama and Kodansha. This repository contains only code — no copyrighted assets are distributed.

---

## Contact

**Heramb Chaudhari**

[![GitHub](https://img.shields.io/badge/GitHub-Heramb1221-black?style=for-the-badge&logo=github)](https://github.com/Heramb1221)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Heramb%20Chaudhari-blue?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/heramb-chaudhari)

[![Email](https://img.shields.io/badge/Email-hchaudhari1221%40gmail.com-red?style=for-the-badge&logo=gmail)](mailto:hchaudhari1221@gmail.com)

---

*"The only thing we're allowed to do is believe that we won't regret the choice we made." — Levi Ackerman*

---
