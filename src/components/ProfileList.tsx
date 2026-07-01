import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
  onProfileClick: (username: string) => void;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileListProps) {
  return (
    <div className="w-full">
      {profiles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <div className="text-4xl mb-4 opacity-50">🔍</div>
          <p className="text-lg font-medium text-slate-700">No creators found</p>
          <p>Try adjusting your search or switching platforms.</p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.user_id}
            profile={profile}
            platform={platform}
            searchQuery={searchQuery}
            onProfileClick={onProfileClick}
          />
        ))}
      </div>
    </div>
  );
}
