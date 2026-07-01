import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "./VerifiedBadge";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";
import { Bookmark, Check, Users } from "lucide-react";
import { cn } from "@/utils/cn";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
  onProfileClick?: (username: string) => void;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K";
  return String(count);
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
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="bg-white border border-slate-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all group flex flex-col h-full"
      data-search={searchQuery}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={profile.picture} 
              alt={profile.fullname} 
              className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-50 group-hover:ring-indigo-50 transition-all" 
            />
            {platform === 'instagram' && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full border-2 border-white" title="Instagram" />}
            {platform === 'tiktok' && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-full border-2 border-white flex items-center justify-center" title="TikTok"><span className="text-[8px] text-white font-bold">♪</span></div>}
            {platform === 'youtube' && <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-red-600 rounded-full border-2 border-white flex items-center justify-center" title="YouTube"><div className="w-0 h-0 border-t-2 border-t-transparent border-l-[3px] border-l-white border-b-2 border-b-transparent ml-0.5"></div></div>}
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-1 text-lg leading-tight">
              {profile.fullname}
              <VerifiedBadge verified={profile.is_verified} />
            </div>
            <div className="text-sm text-slate-500 font-medium">@{profile.username}</div>
          </div>
        </div>
        
        <button
          onClick={handleToggleSave}
          aria-label={isSaved ? "Remove from shortlist" : "Add to shortlist"}
          className={cn(
            "p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
            isSaved 
              ? "bg-indigo-100 text-indigo-700 hover:bg-red-100 hover:text-red-700 focus:ring-indigo-500 group/btn"
              : "bg-slate-100 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 focus:ring-slate-500"
          )}
        >
          {isSaved ? (
            <Check className="w-5 h-5 group-hover/btn:hidden" />
          ) : (
            <Bookmark className="w-5 h-5" />
          )}
          {isSaved && <Bookmark className="w-5 h-5 hidden group-hover/btn:block" />}
        </button>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
          <Users className="w-4 h-4 text-slate-400" />
          {formatFollowersLocal(profile.followers)} followers
        </div>
        <div className="text-indigo-600 font-semibold group-hover:underline">
          View Profile →
        </div>
      </div>
    </motion.div>
  );
}
