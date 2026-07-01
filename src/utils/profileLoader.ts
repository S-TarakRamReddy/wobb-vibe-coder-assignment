import type { ProfileDetailResponse } from "@/types";
import { PLATFORMS, extractProfiles } from "./dataHelpers";

const profileModules = import.meta.glob<ProfileDetailResponse>(
  "../assets/data/profiles/*.json"
);

export async function loadProfileByUsername(
  username: string
): Promise<ProfileDetailResponse | null> {
  const path = `../assets/data/profiles/${username}.json`;
  const loader = profileModules[path];

  if (loader) {
    const result = await loader();
    const data =
      (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
  }

  // Fallback: construct mock data from the search lists if file is missing
  for (const platform of PLATFORMS) {
    const profiles = extractProfiles(platform);
    const found = profiles.find((p) => p.username.toLowerCase() === username.toLowerCase());
    if (found) {
      return {
        cached: true,
        data: {
          success: true,
          user_profile: {
            ...found,
            type: platform,
            description: "Mock description automatically generated because detailed JSON data was missing from the assignment starter repository.",
            posts_count: Math.floor(Math.random() * 500) + 50,
            avg_likes: Math.floor(found.followers * 0.05),
            avg_comments: Math.floor(found.followers * 0.001),
          }
        }
      };
    }
  }

  return null;
}
