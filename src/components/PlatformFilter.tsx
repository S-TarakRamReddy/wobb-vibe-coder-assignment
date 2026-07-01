import type { Platform } from "@/types";
import { PLATFORMS, getPlatformLabel } from "@/utils/dataHelpers";
import { Search } from "lucide-react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

interface PlatformFilterProps {
  selected: Platform;
  onChange: (platform: Platform) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function PlatformFilter({
  selected,
  onChange,
  searchQuery,
  onSearchChange,
}: PlatformFilterProps) {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Input */}
      <div className="relative group max-w-xl mx-auto w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by username or name..."
          className="block w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm transition-all text-base"
        />
      </div>

      {/* Platform Chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {PLATFORMS.map((p) => {
          const isActive = selected === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={cn(
                "relative px-5 py-2 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                isActive
                  ? "text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activePlatform"
                  className="absolute inset-0 bg-indigo-600 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{getPlatformLabel(p)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
