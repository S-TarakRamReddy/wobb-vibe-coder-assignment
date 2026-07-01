import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShortlistSidebar } from "./ShortlistSidebar";
import { useStore } from "@/store/useStore";
import { Bookmark, LayoutDashboard } from "lucide-react";
import { cn } from "@/utils/cn";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Layout({ children, title, className }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const selectedCount = useStore((state) => state.savedProfiles.length);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 hover:text-indigo-600 transition-colors">
              <LayoutDashboard className="w-6 h-6 text-indigo-600" />
              <span>InfluencerHQ</span>
            </Link>
            {title && (
              <>
                <span className="text-slate-300 mx-2">/</span>
                <h1 className="text-sm font-semibold text-slate-600">{title}</h1>
              </>
            )}
          </div>
          
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Open saved profiles"
          >
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">Saved</span>
            {selectedCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {selectedCount}
              </span>
            )}
          </button>
        </div>
      </header>
      
      <main className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", className)}>
        {children}
      </main>
      
      <ShortlistSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
