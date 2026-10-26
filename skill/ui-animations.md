# Design System, Interactivity & Responsiveness
The UI must feel tactile, modern, and work flawlessly on both desktop and mobile devices. Implement the following behaviors using Tailwind CSS and **GSAP** (`gsap`, `@gsap/react`, ScrollTrigger, Flip, ScrollToPlugin) on the public site. Admin screens still use Framer Motion.

# GSAP Conventions
- Always import from `@/lib/gsap` (registers plugins once, exports `gsap`, `useGSAP`, `ScrollTrigger`, `Flip`, `scrollToTarget`, and the `MOTION_OK` / `MOTION_REDUCED` / `DESKTOP` media queries).
- Animate inside `useGSAP(..., { scope })` so tweens and ScrollTriggers are reverted on unmount.
- Wrap animations in `gsap.matchMedia()`: `MOTION_OK` for full motion, `MOTION_REDUCED` as a fallback that only reveals content.
- Elements that start hidden carry `data-anim` (or `data-reveal`); `globals.css` hides them only when JS is enabled, and a GSAP tween (or the reduced-motion fallback) must reveal them. Use `fromTo` with `autoAlpha` for these.
- Shared building blocks live in `src/components/site`: `Reveal` (scroll-triggered stagger), `SectionHeading` (masked-word title), `SplitWords`, `Magnetic` (pointer-follow buttons), `SiteEffects` (ambient background, cursor glow, scroll progress, spotlight pointer tracking).

# Responsive Layouts (Mobile & Desktop)
- Mobile-First: All sections must stack cleanly on mobile devices using flex column layouts, transitioning to side-by-side or multi-column grids on desktop (`md:` and `lg:` Tailwind breakpoints).
- Navigation Menu: On desktop, display a floating glass pill with a sliding active indicator. On mobile, hide the inline links and open a full-screen circular-reveal menu (GSAP timeline) from the hamburger.
- Touch Targets: Ensure all buttons, links, and filter tabs are at least 44x44px to be easily tappable on mobile screens.

# Global Navigation
- Sticky Header: The header remains fixed. When scrolled past the top (Y > 50), the pill gets a glass-morphism effect.
- Theme Toggle: Smooth fade transition between Dark and Light mode using `next-themes`.
- Scrollspy: Navigation links highlight (and the indicator slides to) the section intersecting the viewport. Anchor clicks scroll with GSAP ScrollToPlugin.
- Scroll progress: a thin gradient bar at the top of the viewport scrubs with page scroll.

# Hero Section
- Staggered Entrance: a GSAP timeline reveals the availability badge, greeting, name (masked word slide-up), role, bio and buttons in sequence, then the portrait and floating chips.
- Ambient motion: rotating gradient ring around the portrait, floating chips, desktop mouse-parallax layers, scroll-out fade.
- Responsive Typography: Hero text scales down for mobile to prevent overflow.

# Projects Gallery
- Responsive Grid: 1 column on mobile, 2 on tablets, 3 on desktops.
- Filtering: category tabs use GSAP **Flip** to smoothly reorganize the grid (cards enter/leave with scale + fade).
- Card Hover State (Desktop, hover-capable pointer only): GSAP zooms the image, tilts the card in 3D and slides an overlay with links up from the bottom.
- Card Active State (Mobile/touch): Case study, GitHub and Live Demo links are always visible under the text.

# Scroll Behaviors
- Scroll Reveals: Sections reveal with ScrollTrigger (`once: true`). About text lights up word-by-word with scrub. Skills has a looping marquee.
- Scroll-to-Top: A floating button with a progress ring fades in after 400px of scroll and scrolls to the top with GSAP.
