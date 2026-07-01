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
    <Layout className="bg-slate-50 min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 mb-8 text-center max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Discover Top Creators
        </h1>
        <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
          Analyze and shortlist the best performing influencers across Instagram, TikTok, and YouTube for your next campaign.
        </p>

        <div className="max-w-2xl mx-auto">
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
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">
          {searchQuery ? "Search Results" : "Trending Creators"}
        </h2>
        <p className="text-sm text-slate-500 font-medium">
          Showing {filtered.length} of {allProfiles.length} on <span className="capitalize">{platform}</span>
        </p>
      </div>

      <ProfileList
        profiles={filtered}
        platform={platform}
        searchQuery={searchQuery}
        onProfileClick={handleProfileClick}
      />
    </Layout>
  );
}
