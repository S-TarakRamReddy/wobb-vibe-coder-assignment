import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useStore } from "@/store/useStore";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K followers";
  return count + " followers";
}

export function ProfileCard({
  profile,
  platform,
  searchQuery,
  onProfileClick,
}: ProfileCardProps) {
  const navigate = useNavigate();
  
  const isSaved = useStore((state) => 
    state.savedProfiles.some((p) => p.username === profile.username)
  );
  const addProfile = useStore((state) => state.addProfile);
  const removeProfile = useStore((state) => state.removeProfile);

  const handleClick = () => {
    if (onProfileClick) onProfileClick(profile.username);
    navigate(`/profile/${profile.username}?platform=${platform}&q=${encodeURIComponent(searchQuery)}`);
  };

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSaved) {
      removeProfile(profile.username);
    } else {
      addProfile(profile);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center gap-3 p-3 border border-gray-300 mb-2 cursor-pointer hover:bg-gray-50 w-[700px] transition-colors rounded-lg"
      data-search={searchQuery}
    >
      <img src={profile.picture} alt={profile.fullname} className="w-12 h-12 rounded-full" />
      <div className="text-left flex-1">
        <div className="font-bold flex items-center gap-1">
          @{profile.username}
          <VerifiedBadge verified={profile.is_verified} />
        </div>
        <div className="text-sm text-gray-600">{profile.fullname}</div>
        <div className="text-sm">{formatFollowersLocal(profile.followers)}</div>
      </div>
      <div onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleToggleSave}
          className={`px-4 py-1.5 text-sm font-medium rounded transition-colors w-28 ${
            isSaved 
              ? "bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700 group" 
              : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700"
          }`}
        >
          {isSaved ? (
            <>
              <span className="group-hover:hidden">Added ✓</span>
              <span className="hidden group-hover:inline">Remove</span>
            </>
          ) : (
            "Add to List"
          )}
        </button>
      </div>
    </div>
  );
}
