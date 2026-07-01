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

  // 1. Use the real detailed JSON file if it exists
  if (loader) {
    const result = await loader();
    const data =
      (result as { default?: ProfileDetailResponse }).default ?? result;
    return data as ProfileDetailResponse;
  }

  // 2. Fallback: construct a mock profile from the search list data for
  //    any username that has no dedicated profile JSON file.
  //    Guard against undefined usernames (YouTube uses `handle` instead).
  const lowerUsername = username.toLowerCase();
  for (const platform of PLATFORMS) {
    const profiles = extractProfiles(platform);
    const found = profiles.find((p) => {
      const uname = (p.username ?? p.handle ?? "").toLowerCase();
      return uname === lowerUsername;
    });
    if (found) {
      const followers = found.followers ?? 0;
      return {
        cached: true,
        data: {
          success: true,
          user_profile: {
            ...found,
            // Normalise username — YouTube profiles use `handle`, not `username`
            username: found.username ?? found.handle ?? username,
            type: platform,
            description: undefined,
            posts_count: undefined,
            avg_likes: Math.floor(followers * 0.03),
            avg_comments: Math.floor(followers * 0.001),
          },
        },
      };
    }
  }

  return null;
}
