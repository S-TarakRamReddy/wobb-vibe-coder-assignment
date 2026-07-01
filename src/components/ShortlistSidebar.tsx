import { useStore } from "@/store/useStore";
import { VerifiedBadge } from "./VerifiedBadge";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Users, Bookmark } from "lucide-react";

interface ShortlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortlistSidebar({ isOpen, onClose }: ShortlistSidebarProps) {
  const { savedProfiles, removeProfile, selectedCount, clearProfiles } = useStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-label="Close sidebar overlay"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
          >
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" />
                Shortlist
                <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold ml-1">
                  {selectedCount()}
                </span>
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <AnimatePresence mode="popLayout">
                {savedProfiles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center h-full text-center text-slate-500 pb-20"
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Bookmark className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="font-semibold text-slate-700 mb-1">Your shortlist is empty</p>
                    <p className="text-sm max-w-[200px]">Save profiles you like to compare and track them here.</p>
                  </motion.div>
                ) : (
                  savedProfiles.map((profile) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: 20 }}
                      transition={{ duration: 0.2 }}
                      key={profile.username}
                      className="group flex flex-col gap-3 p-3 border border-slate-200 rounded-xl bg-white hover:border-indigo-200 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={profile.picture}
                          alt={profile.fullname}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-slate-900 truncate flex items-center gap-1">
                            @{profile.username}
                            <VerifiedBadge verified={profile.is_verified} />
                          </div>
                          <div className="text-xs text-slate-500 truncate">{profile.fullname}</div>
                        </div>
                        <button
                          onClick={() => removeProfile(profile.username)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 opacity-0 group-hover:opacity-100 sm:opacity-100"
                          aria-label={`Remove ${profile.username}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {savedProfiles.length > 0 && (
              <div className="p-5 border-t border-slate-100 bg-slate-50">
                <button
                  onClick={clearProfiles}
                  className="w-full flex justify-center items-center gap-2 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear shortlist
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

