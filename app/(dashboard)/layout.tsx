"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { User, Bell } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-zinc-50 dark:bg-black text-black dark:text-white antialiased">
      {/* Collapsible Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Bar */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Seller Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-black dark:text-white">Admin Seller</p>
                <p className="text-[10px] text-zinc-500">store@shopnova.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
