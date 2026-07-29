import React from "react";
import { LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
            Dashboard
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Welcome to your ShopNova seller portal.
          </p>
        </div>
      </div>

      {/* Blank State Container */}
      <div className="min-h-[400px] rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center p-8 text-center bg-white/50 dark:bg-zinc-950/50">
        <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-600 mb-3">
          <LayoutDashboard className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-black dark:text-white">
          Dashboard Overview
        </h3>
        <p className="text-sm text-zinc-500 max-w-sm mt-1">
          Currently set blank. Your main sales, analytics, and overview charts will appear here.
        </p>
      </div>
    </div>
  );
}
