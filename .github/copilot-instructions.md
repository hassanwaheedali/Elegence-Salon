# Elegance Salon - AI Coding Instructions

## Project Overview
A React-based salon/barbershop landing page built with Vite, React 19, React Router v7, and Tailwind CSS v4. The project emphasizes modern UI/UX with animated components and responsive design.

## Architecture & Structure

### Router Setup (React Router v7)
- Uses `createBrowserRouter` with `createRoutesFromElements` pattern in [src/main.jsx](../src/main.jsx)
- Layout wrapper pattern: [src/Layout.jsx](../src/Layout.jsx) wraps all routes with persistent `<Header/>` and `<Footer/>`
- Route definitions use `<Outlet />` for nested rendering
- Most page routes are commented out (About, Services, Contact) - only Home is active

### Component Organization
```
src/
├── Components/     # Reusable UI components (Header, Footer)
├── Pages/          # Route-level pages (Home)
├── assets/         # Images (Landing.jpg, About.png, BARBER.png)
├── Layout.jsx      # Root layout with Header/Footer/Outlet
├── main.jsx        # App entry with router setup
└── App.jsx         # Currently empty, not used in routing
```

## Styling Conventions

### Tailwind CSS v4 + @tailwindcss/vite Plugin
- Uses Tailwind v4 via Vite plugin (not traditional config file)
- Import pattern: `@import "tailwindcss";` in [src/index.css](../src/index.css)
- Utility-first approach with inline className strings

### Color Palette & Theming
- **Primary accent:** `yellow-500/yellow-600` (gold/premium theme)
- **Background:** Dark theme with `bg-[#121212]`, `bg-[#0d0d0d]`, black overlays
- **Text hierarchy:** `text-white` primary, `text-gray-300/400` secondary
- **Borders:** `border-yellow-500`, `border-white` for separators

### Component Patterns
- **Absolute positioning for hero sections:** Background images via inline styles, overlays with `absolute inset-0`
- **Responsive modifiers:** Mobile-first with `md:` and `lg:` breakpoints
- **Hover states:** Extensive use of `hover:` with color transitions
- **Animations:** `animate-pulse` for badges, `transition-all duration-300` for interactions

## Navigation & Links

### NavLink Pattern (Header & Footer)
All navigation uses React Router's `<NavLink>` with consistent active state styling:
```jsx
<NavLink
  to="/"
  className={({ isActive }) =>
    isActive ? 'text-yellow-500 font-bold' : 'text-white hover:text-yellow-500 transition-colors'
  }
>
```
- Active routes get `text-yellow-500 font-bold`
- Inactive routes are white with hover state

### Mobile Menu Implementation ([src/Components/Header.jsx](../src/Components/Header.jsx))
- State managed with `useState(isMobileMenuOpen)`
- Animated hamburger icon with CSS transforms
- Mobile menu visible on `md:hidden`, desktop nav on `hidden md:flex`

## Icon Usage
- **Font Awesome 7.1.0** imported globally in [src/index.css](../src/index.css)
- Used for social icons (`fab fa-facebook-f`, `fab fa-twitter`, etc.)
- Feature icons with `fas fa-award`, `fas fa-users`, `fas fa-star`

## Typography & Fonts
- Pacifico cursive font loaded for specific "Salon" heading via inline style: `style={{ fontFamily: "'Pacifico', cursive" }}`
- Uppercase text with `uppercase tracking-wider/widest` for nav and buttons
- Font weight hierarchy: `font-black` for headings, `font-bold` for CTAs, `font-medium` for nav

## Development Commands
```bash
bun dev       # Start dev server (Vite)
bun build     # Production build
bun lint      # ESLint check
bun preview   # Preview production build
```

## ESLint Configuration
- Flat config format (eslint.config.js)
- React Hooks plugin enforced
- Custom rule: `no-unused-vars` ignores uppercase/constant patterns (`varsIgnorePattern: '^[A-Z_]'`)
- React Refresh plugin for Vite HMR

## Key Patterns to Follow

### Adding New Pages
1. Create component in `src/Pages/`
2. Import in [src/main.jsx](../src/main.jsx)
3. Add `<Route>` inside `<Layout>` wrapper
4. Update navigation in both [Header.jsx](../src/Components/Header.jsx) and [Footer.jsx](../src/Components/Footer.jsx)

### Image Imports
- Store in `src/assets/`
- Import at top: `import Landing from '../assets/Landing.jpg'`
- Use in inline styles for backgrounds: `style={{ backgroundImage: \`url(${Landing})\` }}`
- Use directly in `<img src={barberImg} />` for foreground images

### Button Styles
- Primary CTA: `bg-transparent border-3 border-yellow-500 hover:bg-yellow-500 hover:text-white`
- Secondary: `border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500/10`
- Always include `transition-all duration-300` for smooth interactions

## Common Pitfalls
- **Gradient syntax:** Use `bg-linear-to-r` (Tailwind shorthand), not CSS gradient syntax
- **Z-index layering:** Header is `z-50`, overlays use `z-[1]` to `z-10`, content is `z-10`
- **Responsive spacing:** Test mobile with `px-6` → `md:px-14` pattern
- **SVG logos:** Inline SVG in Header/Footer - preserve viewBox and fill attributes when editing

## External Dependencies
- React 19.2.0 (latest)
- React Router DOM 7.12.0 (v7 API)
- Framer Motion 12.26.2 (installed but not yet used in code)
- Tailwind CSS 4.1.18 with Vite plugin
