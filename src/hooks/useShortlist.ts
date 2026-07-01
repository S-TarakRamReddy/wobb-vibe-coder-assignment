import { useStore } from "@/store/useStore";
import type { UserProfileSummary } from "@/types";

/**
 * Custom hook to encapsulate the Zustand logic for a single profile.
 * Reactively subscribes to the saved status of a specific username.
 */
export function useShortlist(profile: UserProfileSummary | null | undefined) {
  const username = profile?.username;

  // Reactively subscribe to whether this specific profile is saved
  const isSaved = useStore((state) => 
    username ? state.savedProfiles.some((p) => p.username === username) : false
  );

  const addProfile = useStore((state) => state.addProfile);
  const removeProfile = useStore((state) => state.removeProfile);

  const toggleSave = () => {
    if (!profile || !username) return;
    if (isSaved) {
      removeProfile(username);
    } else {
      addProfile(profile);
    }
  };

  return { isSaved, toggleSave };
}
