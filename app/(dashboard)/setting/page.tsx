"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Store, LogOut, CheckCircle2 } from "lucide-react";

export default function SettingPage() {
  const router = Router();
  const [userName, setUserName] = useState("Alex Harrison");
  const [shopName, setShopName] = useState("ShopNova Flagship Store");
  const [savedBadge, setSavedBadge] = useState(false);

  function Router() {
    return useRouter();
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedBadge(true);
    setTimeout(() => {
      setSavedBadge(false);
    }, 3000);
  };

  const handleLogout = () => {
    // Perform simple logout redirection
    router.push("/signin");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white">
            Setting
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your user profile, shop identity, and account session.
          </p>
        </div>
      </div>

      {savedBadge && (
        <div className="p-4 rounded-md bg-black text-white dark:bg-white dark:text-black flex items-center space-x-3 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div className="text-sm font-semibold">
            Settings updated successfully!
          </div>
        </div>
      )}

      {/* Main Settings Card */}
      <Card className="border-zinc-200 dark:border-zinc-800">
        <CardHeader>
          <CardTitle>Account & Shop Settings</CardTitle>
          <CardDescription>
            Update your profile details and store information.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* 1. User Name */}
            <div>
              <Label htmlFor="userName">User Name</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  id="userName"
                  type="text"
                  className="pl-9"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter user name"
                  required
                />
              </div>
            </div>

            {/* 2. Shop Name */}
            <div>
              <Label htmlFor="shopName">Shop Name</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
                  <Store className="w-4 h-4" />
                </div>
                <Input
                  id="shopName"
                  type="text"
                  className="pl-9"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="Enter shop name"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary">
                Save Settings
              </Button>
            </div>
          </form>

          <hr className="border-zinc-200 dark:border-zinc-800 my-6" />

          {/* 3. Logout Section */}
          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-black dark:text-white">
                Account Session
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                Sign out of your seller dashboard session.
              </p>
            </div>
            <Button
              type="button"
              variant="danger"
              onClick={handleLogout}
              className="space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
