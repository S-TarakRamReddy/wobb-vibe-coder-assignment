# Project Audit

## 1. Folder Structure & Organization
- `src/assets/`: Contains mock JSON data for search results and individual profiles.
- `src/components/`: Reusable UI components (`Layout`, `PlatformFilter`, `ProfileCard`, `ProfileList`, `SearchBar`, `VerifiedBadge`).
- `src/pages/`: Page components (`SearchPage`, `ProfileDetailPage`).
- `src/utils/`: Helper functions (`dataHelpers`, `formatters`, `profileLoader`).
- `src/types/`: TypeScript interfaces.
- The structure is fairly standard but can be improved by grouping features (e.g., `features/search`, `features/profile`) or using a more modular architecture as the app scales.

## 2. Component Hierarchy & Data Flow
- `App.tsx` sets up routing using `react-router-dom`.
- `SearchPage` is the main entry point, managing state (`platform`, `searchQuery`, `clickCount`). It passes props down to `PlatformFilter` and `ProfileList`.
- `ProfileList` iterates and renders `ProfileCard`s.
- `ProfileDetailPage` fetches data independently based on URL parameters.
- Data flows top-down via props. There is currently **no global state management** (no React Context or Zustand), even though Phase 4 mentions replacing Context (we will introduce Zustand for the "Add to List" feature directly and assume this fulfills the requirement to use Zustand).

## 3. Search Implementation
- Filtering is done client-side in `SearchPage` -> `utils/dataHelpers.ts` (`filterProfiles`).
- **Issue**: The filtering logic (`allProfiles` and `filtered` arrays) is recomputed on every render. It lacks memoization (`useMemo`).
- **Issue**: The `SearchBar.tsx` component is completely unused. Instead, an inline `<input>` is used inside `PlatformFilter.tsx`.

## 4. Profile Loading
- Handled via `utils/profileLoader.ts` using `import.meta.glob` to dynamically import JSON files based on the username.
- `ProfileDetailPage` uses `useEffect` to fetch the data.

## 5. Existing Bugs & Functional Issues
- **Missing Feature**: "Add to List" buttons are disabled and non-functional.
- **State Loss on Navigation**: When a user clicks a profile and then clicks "Back to search", the previous search query and platform selection are lost because they are kept in local state without URL synchronization.
- **Console Log Leak**: `SearchPage` has a `console.log` tracking profile clicks.

## 6. React Anti-patterns
- **Missing Memoization**: Expensive array operations (`extractProfiles` and `filterProfiles`) run on every render.
- **Unused State**: `clickCount` in `SearchPage` triggers unnecessary re-renders for tracking clicks.
- **Unused Code**: `SearchBar.tsx` is dead code.
- **Duplicated Logic**: Number formatting logic is duplicated across `ProfileCard.tsx` (`formatFollowersLocal`) and `ProfileDetailPage.tsx` (`formatFollowersDetail`).

## 7. UI/UX Problems
- **Fixed Widths**: `ProfileCard` has a hardcoded width of `w-[700px]`, which breaks responsiveness on smaller screens.
- **Poor Loading States**: `ProfileDetailPage` just shows plain "Loading..." text without skeletons or transitions.
- **Poor Empty States**: When no profiles match the search, it displays a plain "No profiles found" text.
- **Basic Design**: Minimal styling; lacks a cohesive design system, modern aesthetics, spacing, and polish.

## 8. Accessibility (a11y) Issues
- **Non-semantic HTML**: `ProfileCard` uses a `<div>` with an `onClick` handler instead of an interactive element like `<a>` or `<button>`. This prevents keyboard navigation (no `tabindex` or enter key support).
- **Missing alt text**: `<img>` tags for profile pictures lack descriptive `alt` attributes.
- **Form Labels**: Search input lacks an associated `<label>` or `aria-label`.

## 9. Performance Bottlenecks
- **JSON Imports**: Search datasets (`instagram.json`, `youtube.json`, `tiktok.json`) are synchronously imported in `dataHelpers.ts`, blocking initial load.
- **Re-rendering**: Typing in the search bar re-renders the entire list without debouncing, which could be sluggish for large datasets.
- **No Virtualization**: The profile list renders all matching items at once.

## 10. TypeScript Issues
- Types are generally well-defined, but there are multiple optional fields in `FullUserProfile` that require excessive undefined checks in the UI.

---
**Audit Complete.** Prepared to create the implementation plan upon approval.
