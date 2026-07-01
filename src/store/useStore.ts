import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { UserProfileSummary } from '@/types';

interface ShortlistState {
  // State
  savedProfiles: UserProfileSummary[];

  // Actions
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (username: string) => void;
  clearProfiles: () => void;

  // Selectors/Derived logic exposed as simple methods for ease of access
  hasProfile: (username: string) => boolean;
  selectedCount: () => number;
}

export const useStore = create<ShortlistState>()(
  persist(
    (set, get) => ({
      savedProfiles: [],

      addProfile: (profile: UserProfileSummary) =>
        set((state) => {
          // Prevent duplicates
          if (state.savedProfiles.some((p) => p.username === profile.username)) {
            return state;
          }
          return { savedProfiles: [...state.savedProfiles, profile] };
        }),

      removeProfile: (username: string) =>
        set((state) => ({
          savedProfiles: state.savedProfiles.filter((p) => p.username !== username),
        })),

      clearProfiles: () => set({ savedProfiles: [] }),

      hasProfile: (username: string) =>
        get().savedProfiles.some((p) => p.username === username),

      selectedCount: () => get().savedProfiles.length,
    }),
    {
      name: 'wobb-shortlist-storage', // unique name
      storage: createJSONStorage(() => localStorage),
      // Only persist savedProfiles; derived logic doesn't need persistence, though methods aren't persisted anyway.
      partialize: (state) => ({ savedProfiles: state.savedProfiles }),
    }
  )
);
