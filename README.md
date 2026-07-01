# InfluencerHQ (Wobb Frontend Assignment)

![InfluencerHQ Banner](https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop)

A production-quality React + TypeScript application for discovering, analyzing, and shortlisting top creators across Instagram, TikTok, and YouTube. Built as a comprehensive frontend engineering demonstration for Wobb.

## 🚀 Deployment

**Live Demo:** [https://influencerhq-wobb-demo.vercel.app](https://influencerhq-wobb-demo.vercel.app) *(Deploy via Vercel GitHub Integration)*

---

## ✨ Features

- **Influencer Search & Discovery**: Browse through detailed influencer profiles dynamically generated from mock JSON datasets.
- **Platform Filtering**: Filter creators specifically by Instagram, YouTube, or TikTok with animated, responsive controls.
- **Profile Analytics**: Deep-dive into detailed creator statistics (Followers, Engagement, Avg Likes, Avg Comments) presented in a beautiful SaaS-style UI.
- **Persistent Shortlist**: Save profiles to a persistent shortlist sidebar. Your saved creators remain available even after refreshing the page, powered by Zustand and LocalStorage.
- **Modern SaaS Dashboard Design**: Clean typography, subtle glassmorphic headers, smooth hover micro-interactions, and accessible focus states designed for B2B usability.
- **Performance Optimized**: Debounced search inputs, memoized derived state, and heavily optimized CSS.

---

## 🛠 Tech Stack & Engineering Choices

### Core Technologies
- **React 19 & Vite 8**: Chosen for an ultra-fast local development environment and highly optimized production builds.
- **TypeScript**: Strictly typed interfaces for all components and API responses to eliminate runtime exceptions and improve developer experience.
- **Tailwind CSS v4**: Utility-first CSS for rapid, scalable UI development without the overhead of massive CSS-in-JS runtimes.

### Key Libraries
- **Zustand**: Selected over React Context for global state management (the Shortlist). It prevents unnecessary re-renders, provides an incredibly simple API, and includes a built-in `persist` middleware to synchronize state to LocalStorage automatically.
- **Framer Motion**: Handles complex micro-interactions, such as the active platform indicator sliding, modal entry/exit, and smooth card hover lifts.
- **Lucide React**: A beautiful, consistent, and highly optimized SVG icon library.
- **clsx & tailwind-merge**: Used to create a `cn()` utility for safely merging dynamic Tailwind classes without specificity conflicts.

---

## 🏗 Architecture & Data Flow

### State Management Separation
A deliberate decision was made to strictly separate **URL State** from **Global State**:
1. **URL State (React Router `useSearchParams`)**: Search queries and active platform filters are stored purely in the URL. This ensures that search results are perfectly shareable, deep-linkable, and natively support the browser's back/forward navigation.
2. **Global State (Zustand)**: The Shortlist is stored in Zustand. This allows the sidebar and profile cards (across any page) to reactively sync to saved profiles without prop drilling.

### Folder Structure
```text
src/
├── assets/         # Static assets and mock JSON data
├── components/     # Reusable UI building blocks (Cards, Layouts, Filters)
├── hooks/          # Custom React hooks (e.g., useShortlist)
├── pages/          # Top-level route components (SearchPage, ProfileDetailPage)
├── store/          # Zustand global state definitions
├── types/          # TypeScript interface definitions
└── utils/          # Pure functions (data helpers, formatters, class mergers)
```

---

## ⚡ Performance Improvements

- **Debounced Search**: The search input utilizes a 300ms debounce. This prevents the URL from updating (and therefore the entire page from re-rendering and filtering arrays) on every single keystroke.
- **Component Memoization**: Array filtering functions inside `SearchPage` are wrapped in `useMemo` to prevent expensive re-evaluations during unrelated state changes.
- **Zustand Granular Subscriptions**: The custom `useShortlist` hook utilizes atomic Zustand selectors, ensuring that when one profile is saved, only that specific card re-renders, rather than re-rendering the entire feed.

---

## ♿ Accessibility (a11y)

- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<h2>`, and `<nav>` elements.
- **Keyboard Navigation**: Every interactive element (inputs, filter pills, save buttons) utilizes high-contrast `focus:ring` states for visibility when navigating via keyboard.
- **ARIA Attributes**: Icon-only buttons (like the sidebar close button or the Shortlist delete icons) include descriptive `aria-label` tags for screen readers.

---

## 🔮 Future Improvements

If this were moving into active production, the following enhancements would be prioritized:
1. **TanStack Query (React Query)**: Replacing the manual `useEffect` data loading with React Query to handle caching, background refetching, and complex loading/error states.
2. **E2E Testing**: Implementing Playwright or Cypress to automate the testing of the persistent Shortlist workflows.
3. **Pagination/Virtualization**: Implementing infinite scrolling (e.g., via `@tanstack/react-virtual`) if the JSON datasets scale beyond a few hundred records.

---

## 💻 Local Development

### Installation
Clone the repository and install dependencies (Note: `--legacy-peer-deps` may be required due to legacy drag-and-drop packages):
```bash
npm install --legacy-peer-deps
```

### Running the App
Start the Vite development server:
```bash
npm run dev
```

### Building for Production
Ensure all types and linting rules pass before building:
```bash
npm run lint
npm run build
```
