# Design System, Interactivity & Responsiveness
The UI must feel tactile, modern, and work flawlessly on both desktop and mobile devices. Implement the following behaviors using Tailwind CSS and Framer Motion.

# Responsive Layouts (Mobile & Desktop)
- Mobile-First: All sections must stack cleanly on mobile devices using flex column layouts, transitioning to side-by-side or multi-column grids on desktop (`md:` and `lg:` Tailwind breakpoints).
- Navigation Menu: On desktop, display standard inline navigation links. On mobile, hide the inline links and implement a sliding or fading full-screen hamburger menu.
- Touch Targets: Ensure all buttons, links, and filter tabs are at least 44x44px to be easily tappable on mobile screens.

# Global Navigation
- Sticky Header: The top navigation bar must remain sticky. When scrolled past the top (Y > 50), apply a glass-morphism effect (`backdrop-blur-md`, semi-transparent background).
- Theme Toggle: Implement a smooth fade transition between Dark and Light mode using `next-themes`.
- Scrollspy: Navigation links must highlight their active state based on which section is currently intersecting the viewport.

# Hero Section
- Staggered Entrance: Elements must not appear at once. Use a Framer Motion staggered container to fade and slide up the greeting, title, description, and buttons in sequence on initial load.
- Responsive Typography: Hero text should scale down appropriately for mobile screens to prevent overflow.

# Projects Gallery
- Responsive Grid: Display 1 column on mobile, 2 on tablets, and 3 on desktops.
- Filtering: Project cards must use an animated layout transition (Framer Motion `layout` prop) when the user clicks category filter tabs, smoothly reorganizing the grid.
- Card Hover State (Desktop): Hovering a project card must trigger a subtle scale-up (`scale-105`) of the image, while sliding an overlay up from the bottom containing links.
- Card Active State (Mobile): Since there is no hover on mobile, ensure the GitHub and Live Demo links are always visible under the image or accessible via a single tap.

# Scroll Behaviors
- Scroll Reveals: The Skills and Contact sections must slide up and fade in only when they scroll into the viewport (`whileInView` in Framer Motion). Disable heavy scroll animations on mobile if they impact performance.
- Scroll-to-Top: A floating arrow button in the bottom right corner must fade in after scrolling past the Hero section and smoothly scroll to the top when clicked.