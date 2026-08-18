"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackagePlus,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Store,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Create Product",
    href: "/create-product",
    icon: PackagePlus,
  },
  {
    name: "Setting",
    href: "/setting",
    icon: Settings,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Header with Burger Toggle */}
      <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold">
            <Store className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-black dark:text-white">
            ShopNova
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Desktop & Mobile Drawer Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 ease-in-out",
          // Desktop styles
          "hidden lg:flex lg:relative",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          // Mobile responsive drawer styles
          mobileOpen ? "!flex fixed inset-y-0 left-0 w-64 shadow-2xl" : ""
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-bold shrink-0">
              <Store className="w-5 h-5" />
            </div>
            {(!isCollapsed || mobileOpen) && (
              <span className="font-bold text-lg tracking-tight whitespace-nowrap text-black dark:text-white">
                ShopNova
              </span>
            )}
          </div>

          {/* Desktop Collapse Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-3 rounded-md transition-all duration-200 group relative font-medium text-sm",
                  isActive
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xs"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white",
                  isCollapsed && !mobileOpen ? "justify-center" : "space-x-3"
                )}
                title={isCollapsed && !mobileOpen ? item.name : undefined}
              >
                <Icon className={cn("w-5 h-5 shrink-0", isActive ? "" : "text-zinc-500 group-hover:text-black dark:text-zinc-400 dark:group-hover:text-white")} />
                {(!isCollapsed || mobileOpen) && (
                  <span className="truncate">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer info when expanded */}
        {(!isCollapsed || mobileOpen) && (
          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="p-3 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs font-semibold text-black dark:text-white truncate">Seller Portal</p>
              <p className="text-[11px] text-zinc-500 truncate">v1.0 • Classic B&W</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
