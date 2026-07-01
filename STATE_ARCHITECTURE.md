# State Architecture

## 1. State Ownership & Global vs. Local

### Local State
- **UI Interaction State**: Dropdown open/close, modal visibility, hover states, and temporary form inputs should remain strictly in local component state (`useState` or `useReducer`). 
- **Component-Specific Fetching State**: Loading indicators for specific profile pages (`loaded` state in `ProfileDetailPage`) should remain local to avoid polluting the global store with transient lifecycle states.

### Global State
- **User Shortlist ("Saved Profiles")**: This requires global availability because the user needs to view, add, and remove profiles from anywhere (e.g., search page, detail page, dedicated list page).
- **Global Theme/Preferences** (if added later): Dark mode toggle or similar settings.

### URL State
- **Search Query & Platform Filter**: Instead of storing search filters in Zustand, they will remain in the URL parameters (`useSearchParams`).
  - *Reasoning*: Following the principle of "single source of truth", URL state ensures that search links are shareable and browser history (back/forward navigation) works flawlessly without manual synchronization between Zustand and React Router.

## 2. Store Hierarchy & Folder Organization

We will use a modular approach ("slice pattern") within Zustand, even though the app is currently small, to demonstrate production readiness.
- `src/store/`
  - `index.ts`: The main entry point combining slices (if needed) and exporting the hook.
  - `shortlistSlice.ts`: Contains logic specific to the saved profiles.

*For this specific assignment, a single cohesive store (`useStore.ts`) is sufficient to prevent over-engineering, but it will be structured with clear separation of actions and state so it can be split into slices later.*

## 3. The Shortlist Store Design

### State
- `savedProfiles: UserProfileSummary[]`

### Actions
- `addProfile(profile: UserProfileSummary): void`
- `removeProfile(username: string): void`
- `clearProfiles(): void`

### Selectors
- We will define custom selector hooks or recommend using Zustand's selective state picking to prevent unnecessary re-renders. 
- Derived state:
  - `hasProfile(username: string): boolean`
  - `selectedCount(): number`

## 4. Persistence Strategy

- We will utilize Zustand's built-in `persist` middleware.
- **Storage**: `localStorage` (default).
- **Hydration**: Handled automatically by Zustand.
- **Error Handling**: Zustand's persist handles JSON parse errors gracefully, but we will ensure the state shape remains robust.

## 5. Scalability Considerations

- By keeping UI state local and routing state in the URL, the global Zustand store is strictly reserved for core business logic (the Shortlist).
- If the application scales to include authentication or caching network requests, Zustand will only handle Auth state, while data caching would ideally be delegated to a library like TanStack Query.
- Actions are kept small, immutable, and deterministic. No side-effects (like routing or fetching) will exist inside the Zustand store directly.
