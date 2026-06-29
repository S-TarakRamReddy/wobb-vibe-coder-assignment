import { useSearchParams } from "react-router-dom";
import type { Platform } from "@/types";
import { Layout } from "@/components/Layout";
import { PlatformFilter } from "@/components/PlatformFilter";
import { ProfileList } from "@/components/ProfileList";
import { extractProfiles, filterProfiles, PLATFORMS } from "@/utils/dataHelpers";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const urlPlatform = searchParams.get("platform");
  const platform = PLATFORMS.includes(urlPlatform as Platform) 
    ? (urlPlatform as Platform) 
    : "instagram";
    
  const searchQuery = searchParams.get("q") || "";

  const allProfiles = extractProfiles(platform);
  const filtered = filterProfiles(allProfiles, searchQuery);

  const handleProfileClick = () => {
    // Empty as ProfileList requires onProfileClick prop, but tracking is unnecessary
  };

  return (
    <Layout title="Find Influencers">
      <p className="text-gray-500 mb-4 text-sm">
        Browse top creators across social platforms
      </p>

      <PlatformFilter
        selected={platform}
        onChange={(p) => {
          setSearchParams((prev) => {
            prev.set("platform", p);
            prev.delete("q");
            return prev;
          });
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchParams((prev) => {
            if (q) prev.set("q", q);
            else prev.delete("q");
            return prev;
          });
        }}
      />

      <p className="text-xs text-gray-400 mb-2">
        Showing {filtered.length} of {allProfiles.length} on {platform}
      </p>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
