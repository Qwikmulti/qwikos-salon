"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { SimpleTooltip } from "@/components/ui/tooltip";
import {
  LayoutDashboard, Users, CalendarDays, Scissors,
  BookOpen, Settings, LogOut, ChevronRight, UserCheck,
  TrendingUp,
} from "lucide-react";

const navGroups = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",  href: "/admin/dashboard",  icon: LayoutDashboard },
      { label: "Analytics",  href: "/admin/analytics",  icon: TrendingUp },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Bookings",   href: "/admin/bookings",   icon: CalendarDays,  badge: "12" },
      { label: "Stylists",   href: "/admin/stylists",   icon: UserCheck },
      { label: "Customers",  href: "/admin/customers",  icon: Users },
      { label: "Services",   href: "/admin/services",   icon: Scissors },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Blog",       href: "/admin/blog",       icon: BookOpen },
      { label: "Settings",   href: "/admin/settings",   icon: Settings },
    ],
  },
];

interface AdminSidebarProps {
  adminName?:  string;
  avatarUrl?:  string;
  collapsed?:  boolean;
  onToggle?:   () => void;
}

export function AdminSidebar({ adminName = "Admin", avatarUrl, collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex flex-col h-screen sticky top-0 bg-obsidian border-r border-white/[0.06]",
      "transition-all duration-300",
      collapsed ? "w-[68px]" : "w-64"
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center h-16 border-b border-white/[0.06] px-4 shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold">
              <Scissors className="h-3.5 w-3.5 text-obsidian" />
            </div>
            <div>
              <span className="font-heading text-sm text-white block leading-tight">SalonOS</span>
              <span className="font-body text-2xs text-gold uppercase tracking-widest leading-tight">Admin</span>
            </div>
          </Link>
        )}
        {collapsed && (
          <div className="h-7 w-7 rounded-md bg-gold-gradient flex items-center justify-center">
            <Scissors className="h-3.5 w-3.5 text-obsidian" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="h-7 w-7 rounded-md flex items-center justify-center text-ash hover:text-mist hover:bg-smoke transition-colors"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform", collapsed ? "" : "rotate-180")} />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-gold">
        {navGroups.map(group => (
          <div key={group.label} className="mb-5 px-3">
            {!collapsed && (
              <p className="font-body text-2xs font-semibold uppercase tracking-[0.15em] text-ash mb-2 px-3">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon, badge }) => {
                const active = pathname.startsWith(href);
                const item = (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group",
                      active
                        ? "bg-gold/10 border border-gold/20 text-gold-light"
                        : "text-silver hover:text-pearl hover:bg-graphite border border-transparent",
                      collapsed && "justify-center px-2.5"
                    )}
                  >
                    <Icon className={cn("h-4 w-4 shrink-0", active ? "text-gold" : "text-ash group-hover:text-silver")} />
                    {!collapsed && (
                      <>
                        <span className="font-body text-sm font-medium flex-1">{label}</span>
                        {badge && (
                          <span className="font-mono text-2xs px-1.5 py-0.5 rounded-md bg-gold/10 border border-gold/20 text-gold-light">
                            {badge}
                          </span>
                        )}
                        {active && !badge && (
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        )}
                      </>
                    )}
                  </Link>
                );
                return collapsed
                  ? <SimpleTooltip key={href} content={label} side="right">{item}</SimpleTooltip>
                  : item;
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.06] p-3 shrink-0">
        <div className={cn(
          "flex items-center gap-3 p-2.5 rounded-xl hover:bg-graphite transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}>
          <Avatar name={adminName} src={avatarUrl} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-medium text-pearl truncate">{adminName}</p>
              <p className="font-body text-2xs text-gold uppercase tracking-widest">Administrator</p>
            </div>
          )}
          {!collapsed && (
            <button className="text-ash hover:text-danger-text transition-colors p-1 rounded-md hover:bg-danger-bg">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
