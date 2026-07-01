import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { formatEngagementRate } from "@/utils/formatters";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { useStore } from "@/store/useStore";
import { ArrowLeft, Check, Bookmark, ExternalLink, Activity, Users, Eye, MessageCircle, Heart, FileText } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
}

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const platform = searchParams.get("platform") || "unknown";
  const q = searchParams.get("q") || "";
  const backLink = `/?platform=${platform}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
  
  const savedProfiles = useStore((state) => state.savedProfiles);
  const addProfile = useStore((state) => state.addProfile);
  const removeProfile = useStore((state) => state.removeProfile);

  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!username) return;
    loadProfileByUsername(username).then((data) => {
      setProfileData(data);
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <p className="text-lg">Invalid profile</p>
          <Link to={backLink} className="mt-4 text-indigo-600 hover:underline">Return to search</Link>
        </div>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <p className="text-red-600 mb-4 text-lg">Could not load profile details for {username}</p>
          <Link to={backLink} className="flex items-center gap-2 text-indigo-600 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;
  const isSaved = savedProfiles.some((p) => p.username === user.username);

  const handleToggleSave = () => {
    if (isSaved) removeProfile(user.username);
    else addProfile(user);
  };

  const statCards = [
    { label: "Followers", value: formatFollowersDetail(user.followers), icon: Users },
    { label: "Engagement", value: user.engagement_rate !== undefined ? formatEngagementRate(user.engagement_rate) : "N/A", icon: Activity },
    ...(user.posts_count !== undefined ? [{ label: "Posts", value: user.posts_count, icon: FileText }] : []),
    ...(user.avg_likes !== undefined ? [{ label: "Avg Likes", value: formatFollowersDetail(user.avg_likes), icon: Heart }] : []),
    ...(user.avg_comments !== undefined ? [{ label: "Avg Comments", value: user.avg_comments, icon: MessageCircle }] : []),
    ...(user.avg_views !== undefined && user.avg_views > 0 ? [{ label: "Avg Views", value: formatFollowersDetail(user.avg_views), icon: Eye }] : []),
  ];

  return (
    <Layout title={user.fullname}>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <Link to={backLink} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to search
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="px-6 sm:px-10 pb-10">
            {/* Avatar & Main Info */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 mb-8">
              <div className="flex items-end gap-5">
                <img
                  src={user.picture}
                  alt={user.fullname}
                  className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-white object-cover"
                />
                <div className="mb-2">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {user.fullname}
                    <VerifiedBadge verified={user.is_verified} />
                  </h2>
                  <p className="text-slate-500 font-medium">@{user.username} • <span className="capitalize">{platform}</span></p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-2">
                {user.url && (
                  <a
                    href={user.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    View Profile <ExternalLink className="w-4 h-4 text-slate-400" />
                  </a>
                )}
                <button
                  onClick={handleToggleSave}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 w-40 justify-center group",
                    isSaved 
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 focus:ring-indigo-500" 
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm focus:ring-indigo-600"
                  )}
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4 group-hover:hidden" />
                      <span className="group-hover:hidden">Saved</span>
                      <span className="hidden group-hover:inline">Remove</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Save
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Description */}
            {user.description && (
              <div className="mb-10 text-slate-700 whitespace-pre-wrap leading-relaxed max-w-3xl">
                {user.description}
              </div>
            )}

            {/* Statistics Grid */}
            <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {statCards.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
}
