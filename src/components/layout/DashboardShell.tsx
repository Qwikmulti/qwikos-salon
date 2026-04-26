"use client";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AdminSidebar }   from "./AdminSidebar";
import { StylistSidebar } from "./StylistSidebar";

interface DashboardShellProps {
  role:       "admin" | "stylist";
  userName?:  string;
  avatarUrl?: string;
  children:   React.ReactNode;
}

export function DashboardShell({ role, userName, avatarUrl, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-charcoal overflow-hidden">
      {role === "admin" ? (
        <AdminSidebar
          adminName={userName}
          avatarUrl={avatarUrl}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      ) : (
        <StylistSidebar
          stylistName={userName}
          avatarUrl={avatarUrl}
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto scrollbar-gold">
        <div className="min-h-full p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
