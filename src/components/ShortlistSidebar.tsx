import { useStore } from "@/store/useStore";
import { VerifiedBadge } from "./VerifiedBadge";

interface ShortlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShortlistSidebar({ isOpen, onClose }: ShortlistSidebarProps) {
  const { savedProfiles, removeProfile, selectedCount, clearProfiles } = useStore();

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 z-40" 
        onClick={onClose} 
        aria-label="Close sidebar overlay"
      />
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-bold">Saved Profiles ({selectedCount()})</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100 p-1 rounded"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {savedProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <div className="text-4xl mb-2">📥</div>
              <p className="font-medium">No profiles saved yet.</p>
              <p className="text-sm">Browse and add creators to your shortlist.</p>
            </div>
          ) : (
            savedProfiles.map((profile) => (
              <div key={profile.username} className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <img src={profile.picture} alt={profile.fullname} className="w-10 h-10 rounded-full" />
                  <div className="flex-1 overflow-hidden">
                    <div className="font-bold text-sm truncate flex items-center gap-1">
                      @{profile.username}
                      <VerifiedBadge verified={profile.is_verified} />
                    </div>
                    <div className="text-xs text-gray-600 truncate">{profile.fullname}</div>
                  </div>
                </div>
                <button
                  onClick={() => removeProfile(profile.username)}
                  className="w-full text-xs text-red-600 border border-red-200 hover:bg-red-50 py-1.5 rounded transition-colors"
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
        
        {savedProfiles.length > 0 && (
          <div className="p-4 border-t">
            <button 
              onClick={clearProfiles}
              className="w-full text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </>
  );
}
