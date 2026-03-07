# Elegance Barber Shop

A premium, full-stack-frontend barbershop web application built with React 19 and Vite 7. Elegance delivers a cinematic landing page experience combined with a complete multi-role management system — all running entirely client-side with zero backend dependency.

---

## Table of Contents

- [Overview](#overview)
- [Live Demo Credentials](#live-demo-credentials)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Architecture](#project-architecture)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
- [Role-Based Access](#role-based-access)
- [Data Persistence](#data-persistence)
- [Key Components](#key-components)
- [Configuration](#configuration)

---

## Overview

Elegance is a barbershop landing page and booking management platform designed for small-to-medium salon businesses. The application solves three distinct user problems simultaneously:

- **Clients** discover services, browse artisan profiles, and self-book appointments online.
- **Staff members** manage their own schedule, track assigned appointments, and update their profile.
- **Administrators** oversee the entire operation — revenue, appointments, staff roster, and site configuration — from a dedicated dashboard.

All data is managed entirely in the browser via `localStorage`, making the application fully deployable as a static site with no server infrastructure required.

---

## Live Demo Credentials

| Role   | Email                                  | Password   |
| ------ | -------------------------------------- | ---------- |
| Admin  | `admin@admin.com`                      | `admin`    |
| Staff  | `john@elegancesalon.com`               | `staff123` |
| Client | Register a new account via `/register` | —          |

---

## Tech Stack

| Category          | Technology                                     |
| ----------------- | ---------------------------------------------- |
| **Build Tool**    | Vite 7 with HMR                                |
| **Runtime**       | Bun (preferred) / Node.js                      |
| **UI Framework**  | React 19.2                                     |
| **Routing**       | React Router DOM v7.12 (`createBrowserRouter`) |
| **Styling**       | Tailwind CSS 4 (`@tailwindcss/vite` plugin)    |
| **Animation**     | GSAP 3.14 + `@gsap/react`, Framer Motion 12.26 |
| **Smooth Scroll** | `@studio-freight/react-lenis`                  |
| **3D / WebGL**    | Three.js 0.183                                 |
| **Icons**         | Lucide React 0.563, FontAwesome Free 7         |
| **Linting**       | ESLint 9 with `eslint-plugin-react-hooks`      |

---

## Features

### Public-Facing (Landing Page)

- **WebGL Particle System Hero** — Three.js ambient particle field rendered on a `<canvas>` behind the hero section, creating a live atmospheric effect.
- **GSAP Scroll Animations** — `ScrollTrigger`-powered entrance animations throughout the page using `power3.out` / `power4.out` easing curves.
- **Magnetic Button Interactions** — Custom `useMagnetic` hook applies cursor-tracking force to CTA buttons.
- **Hardware-Accelerated Smooth Scroll** — Global Lenis integration (`lerp: 0.1`) for smooth, native-feeling page scroll.
- **Service Showcase** — Six service categories with pricing, imagery, and icon callouts.
- **Pricing Tables** — Grouped pricing cards for Hair Services, Skin, Wax & Threading, and Hair Styling.
- **Artisan Profiles** — Dedicated profile pages (`/artisan/:id`) per staff member, showing specialties, schedule, rating, experience, and linked customer reviews.
- **Gallery** — Filterable work gallery with WebP-optimised images.
- **Brand Carousel** — Infinite-scroll partner logo strip using a CSS keyframe animation.
- **Customer Reviews** — Testimonial section backed by static review data.
- **Contact / Booking Form** — Full appointment booking form with multi-service selection, date/time picker, and real-time staff availability validation.

### Appointment Booking Engine

- Clients select one or more services; the system automatically assigns an available stylist per service based on working schedule and existing bookings.
- Appointments are stored as a single record containing an `items[]` array, each pairing a `{ service }` with an assigned `{ stylist }`.
- Clients can reschedule or cancel bookings from their account panel.
- Administrators can edit, update status, and view full appointment details from the admin panel.

### Admin Panel (`/admin/*`)

- **Dashboard** — Live stats: total revenue, total appointments, active staff count, and inventory summary. Today's working staff roster. Recent appointments table with inline edit/view actions.
- **Appointments** — Paginated, searchable, filterable, and sortable appointment list. Inline status management with a `StatusBadge` component and contextual action menus.
- **Staffs** — Full CRUD: add, edit, and remove staff members. Each staff record defines specialties, weekly schedule, commission rate, and role.
- **Configuration** — Admin profile management and password change.

### Staff Panel (`/staff/*`)

- **Dashboard** — Personal stats: assigned appointments, earnings based on commission rate, today's schedule.
- **Appointments** — Personal appointment list with viewport-aware dropdown menus (menus flip above trigger when near the bottom of the viewport using `createPortal`).
- **Profile** — Editable profile fields and password change.

### User Account Panel (`/account`)

- URL-driven tabbed interface (`?tab=profile`, `?tab=booking`, `?tab=feedback`) via `useSearchParams`.
- **Profile Tab** — View and update personal details.
- **Booking Tab** — View all past and upcoming appointments with reschedule and cancel actions.
- **Feedback Tab** — Submit reviews.

---

## Project Architecture

### Context Layer

All application state is managed through four React Contexts consumed throughout the component tree:

```
AuthContext        — Authentication state, user registration/login/logout, role management
AppointmentContext — Booking CRUD, staff auto-assignment, user-filtered appointment views
StaffContext       — Staff roster CRUD, availability checks, schedule validation
MessageContext     — Global toast notification system (5 s display, 300 ms fade-out)
```

### Routing Structure

```
/                        → Home (public)
/contact                 → Contact & Booking Form (public)
/login                   → Login (public)
/register                → Registration (public)
/artisan/:id             → Artisan Profile (public)
/account                 → User Account Panel (protected: client)
/admin/dashboard         → Admin Dashboard (protected: admin)
/admin/appointments      → Appointment Management (protected: admin)
/admin/staffs            → Staff Management (protected: admin)
/admin/configuration     → Admin Profile (protected: admin)
/staff/dashboard         → Staff Dashboard (protected: staff)
/staff/appointments      → Staff Appointments (protected: staff)
/staff/profile           → Staff Profile (protected: staff)
```

All pages are **lazy-loaded** via `React.lazy()` wrapped in `<Suspense>` with a `<LoadingSpinner>` fallback.

### Layout Hierarchy

```
main.jsx
 ├── AuthProvider → AppointmentProvider → StaffProvider → MessageProvider
 │    ├── <Layout />          (public routes: Header per page + Footer)
 │    │    └── ReactLenis root (global smooth scroll)
 │    ├── <AdminLayout />     (admin routes: AdminSidebar + Message toast)
 │    └── <StaffLayout />     (staff routes: StaffSidebar + Message toast)
```

---

## Directory Structure

```
Elegance/
├── index.html
├── vite.config.js          # Vite + Tailwind plugin, React alias deduplication
├── package.json
├── eslint.config.js
└── src/
    ├── main.jsx             # Router definition, provider nesting, lazy imports
    ├── index.css            # Tailwind 4 @import, custom keyframes (infinite-scroll, shine-sweep)
    ├── Layout.jsx           # Public layout: ReactLenis root + <Outlet> + <Footer>
    ├── AdminLayout.jsx      # Admin layout: AdminSidebar + <Outlet> + toast
    ├── StaffLayout.jsx      # Staff layout: StaffSidebar + <Outlet> + toast
    │
    ├── assets/              # All media (WebP format)
    │   ├── services/        # Service category images
    │   ├── reviews/         # Customer avatar images
    │   └── gallery/         # Gallery images + fallback
    │
    ├── Components/
    │   ├── Header.jsx                    # Responsive nav, scroll-aware bg, mobile hamburger
    │   ├── Footer.jsx
    │   ├── HeroCanvas.jsx                # Three.js WebGL particle system
    │   ├── AppointmentForm.jsx           # Multi-service booking form with custom dropdowns
    │   ├── AppointmentFormContact.jsx    # Contact page variant of booking form
    │   ├── ServiceCard.jsx / PriceCard.jsx / CustomerReview.jsx / GalleryItem.jsx
    │   ├── BrandCarousel.jsx             # CSS infinite-scroll brand strip
    │   ├── ConfirmModal.jsx              # Portal-based confirmation dialog
    │   ├── ProtectedRoute.jsx            # Role-aware route guard
    │   ├── LoadingSpinner.jsx
    │   ├── LoginInput.jsx / RegisterInput.jsx
    │   ├── AdminPanel Components/
    │   │   ├── AdminSidebar.jsx          # Collapsible sidebar with mobile overlay
    │   │   ├── StatsCard.jsx             # Metric card with cursor-tracking shine effect
    │   │   ├── AppointmentMenu.jsx       # Action dropdown for appointments
    │   │   ├── EditAppointmentModal.jsx / ViewAppointmentModal.jsx
    │   │   ├── AddStaffModal.jsx / EditStaffModal.jsx / StaffDetailsModal.jsx
    │   │   ├── StatusBadge.jsx / SortableHeader.jsx / InventoryItem.jsx
    │   │   └── NavItem.jsx
    │   ├── StaffPanel Components/
    │   │   ├── StaffSidebar.jsx
    │   │   ├── StaffAppointmentMenu.jsx  # Viewport-aware dropdown (createPortal + flip logic)
    │   │   ├── StaffAppointmentsModal.jsx / StaffMenu.jsx / StaffRow.jsx
    │   └── UserPanel Components/
    │       ├── AppointmentCards.jsx      # User appointment card with ConfirmModal integration
    │       ├── Booking.jsx / Profile.jsx / Feedback.jsx
    │
    ├── Context/
    │   ├── AuthContext.jsx
    │   ├── AppointmentContext.jsx
    │   ├── StaffContext.jsx
    │   └── MessageContext.jsx
    │
    ├── data/
    │   ├── services.js       # Grouped service + pricing data
    │   ├── reviews.js        # Customer testimonials
    │   ├── brands.js         # Partner logo paths
    │   └── sample-images.js  # Gallery image paths
    │
    ├── hooks/
    │   └── useMagnetic.jsx   # Cursor-tracking magnetic button effect
    │
    └── Pages/
        ├── Home.jsx          # Full landing page (GSAP animated, 800+ lines)
        ├── ArtisanProfile.jsx
        ├── Contact.jsx
        ├── Login.jsx / Register.jsx
        ├── Admin/
        │   ├── Dashboard.jsx / Appointments.jsx / Staffs.jsx / Configuration.jsx
        ├── Staff/
        │   ├── StaffDashboard.jsx / StaffAppointments.jsx / StaffProfile.jsx
        └── User Panel/
            └── Account.jsx
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (preferred) **or** Node.js ≥ 18
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/hassanwaheedali/EleganceSalon
cd "Elegence React Version"

# 2. Navigate to the project directory
cd Elegance

# 3. Install dependencies
bun install
# or: npm install

# 4. Start the development server
bun run dev
# or: npm run dev
```

The application will be available at `http://localhost:5173`.

### Build for Production

```bash
bun run build
# or: npm run build
```

The production-optimized output is written to `Elegance/dist/`.

### Preview Production Build

```bash
bun run preview
```

### Lint

```bash
bun run lint
```

### Troubleshooting

If you encounter `TypeError: Cannot read properties of null (reading 'useRef')` or similar React hook errors after installing dependencies, this is typically caused by duplicate React instances. Resolve by clearing and reinstalling:

```bash
rm -rf node_modules bun.lock* && bun install
```

The `vite.config.js` already includes `resolve.alias` entries to force a single React resolution.

---

## Role-Based Access

Access control is enforced by `ProtectedRoute`, which reads `currentUser.role` / `currentUser.accountRole` from `AuthContext`. Unauthenticated or insufficiently-privileged requests are redirected to `/login`.

| Role     | Accessible Routes                                                                  |
| -------- | ---------------------------------------------------------------------------------- |
| `client` | `/account`                                                                         |
| `staff`  | `/staff/dashboard`, `/staff/appointments`, `/staff/profile`                        |
| `admin`  | `/admin/dashboard`, `/admin/appointments`, `/admin/staffs`, `/admin/configuration` |

Staff accounts are managed exclusively by the admin. When a staff record is created in `StaffContext`, it is simultaneously added to `AuthContext`'s runtime user list so the staff member can log in immediately.

---

## Data Persistence

There is no backend. All state is persisted to `localStorage` under the following keys:

| Key             | Contents                                                  |
| --------------- | --------------------------------------------------------- |
| `allUsers`      | Registered client and admin accounts                      |
| `EleganceStaff` | Staff roster (also used by `AuthContext` for staff login) |
| `Appointments`  | All appointment records                                   |
| `currentUser`   | Active session (also checked in `sessionStorage`)         |

Clearing `localStorage` resets the application to its default seed state (default admin user + four seeded staff members).

---

## Key Components

### `HeroCanvas.jsx`

A self-contained Three.js scene that renders 5,000 amber-tinted particles with additive blending (`THREE.AdditiveBlending`) on a transparent `<canvas>`. The mesh rotates slowly on both axes using a `THREE.Timer` and pauses via an `IntersectionObserver` when scrolled out of view to conserve GPU resources.

### `AppointmentForm.jsx`

Multi-step booking form with a custom `useRef`-driven dropdown (click-outside to close). On submit it calls `bookAppointment()` from `AppointmentContext`, which iterates over each selected service, queries `getAvailableStaff()` for a free stylist at the requested date/time, and builds an `items[]` assignment array before persisting the record.

### `StatsCard.jsx`

Admin dashboard metric card implementing a 125° tilt cursor-following spotlight/shine effect via `onMouseMove`. The highlight position is tracked with `useRef` and applied as a CSS `background` gradient for a premium glass-like appearance.

### `StaffAppointmentMenu.jsx`

Dropdown action menu rendered into `document.body` via `createPortal`. After mounting, a `useEffect` measures the menu's bounding rect, checks how much space remains below the trigger, and flips the menu above the trigger if it would overflow the viewport — updating the animation origin class accordingly.

### `ConfirmModal.jsx`

Global confirmation dialog rendered via `createPortal` to escape all parent `overflow`/`z-index` constraints. Accepts `message`, `onConfirm`, and `onCancel` props. Used in place of `window.confirm` throughout the application.

---

## Configuration

The project requires no environment variables. All configurable behaviour lives in source files:

| File                           | Purpose                                                              |
| ------------------------------ | -------------------------------------------------------------------- |
| `vite.config.js`               | Vite plugins, React alias deduplication, `optimizeDeps` pre-bundling |
| `src/index.css`                | Tailwind 4 `@import`, custom `@keyframes`, global resets             |
| `src/data/services.js`         | Service catalogue and pricing                                        |
| `src/Context/StaffContext.jsx` | Default seed staff data (name, schedule, specialties, commission)    |
| `src/Context/AuthContext.jsx`  | Default admin credentials seed (`admin@admin.com` / `admin`)         |

To change the default admin password or seed staff, edit the respective context files directly. Since all data lives in `localStorage`, changes to seed data only take effect after clearing browser storage.

---

## About

**Elegance Barber Shop** is a portfolio project created by **Hassan Waheed Ali** to demonstrate expertise in modern frontend development, UI/UX design, and complex state management architectures. This project showcases production-grade React development practices, advanced animation techniques, and a comprehensive understanding of building scalable, maintainable client-side applications.

### Connect

- **GitHub**: [@hassanwaheedali](https://github.com/hassanwaheedali)

---

## License

This project is open source and available as a portfolio demonstration. Please provide attribution if you use significant portions of this codebase.

**MIT License** — See LICENSE file for details _(or feel free to adapt as needed)_.
