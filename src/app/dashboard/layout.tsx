"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Book, MessageSquare, PlusCircle, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 glass-dark flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 overflow-hidden group-hover:border-blue-500/50 transition-colors">
              <img src="/assets/logo.png" alt="Lexora AI" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-xl tracking-tight">Lexora AI</span>
          </Link>

          <nav className="space-y-2">
            <Link href="/dashboard">
              <Button 
                variant={pathname === "/dashboard" ? "secondary" : "ghost"} 
                className={`w-full justify-start ${pathname === "/dashboard" ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <PlusCircle className="mr-2 w-4 h-4" />
                New Workspace
              </Button>
            </Link>
            <div className="pt-4 pb-2">
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider px-4">Knowledge Base</p>
            </div>
            <Link href="/dashboard/documents">
              <Button 
                variant={pathname === "/dashboard/documents" ? "secondary" : "ghost"} 
                className={`w-full justify-start ${pathname === "/dashboard/documents" ? "bg-white/10" : "hover:bg-white/5"}`}
              >
                <Book className="mr-2 w-4 h-4" />
                Documents
              </Button>
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start hover:bg-white/5 text-white/70">
            <Settings className="mr-2 w-4 h-4" />
            Settings
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative flex flex-col">
        {/* subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
