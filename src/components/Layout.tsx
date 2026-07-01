import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ShortlistSidebar } from "./ShortlistSidebar";
import { useStore } from "@/store/useStore";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export function Layout({ children, title }: LayoutProps) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const selectedCount = useStore((state) => state.savedProfiles.length);

  return (
    <div className="p-4 min-h-screen">
      <header className="mb-6 border-b pb-4 flex justify-between items-start">
        <div>
          <Link to="/" className="text-xl font-semibold text-gray-900">
            Influencer Search
          </Link>
          {title && <h1 className="text-2xl mt-2">{title}</h1>}
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded hover:bg-indigo-100 transition-colors flex items-center gap-2"
        >
          <span>Saved</span>
          <span className="bg-indigo-200 text-indigo-800 text-xs px-2 py-0.5 rounded-full">
            {selectedCount}
          </span>
        </button>
      </header>
      <main>{children}</main>
      <ShortlistSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  );
}
