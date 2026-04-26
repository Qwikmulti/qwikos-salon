"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/ui/avatar";
import { SimpleTooltip } from "@/components/ui/tooltip";
import {
  LayoutDashboard, CalendarDays, Clock, Scissors,
  User, LogOut, ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Dashboard",    href: "/stylist/dashboard",    icon: LayoutDashboard },
  { label: "Bookings",     href: "/stylist/bookings",     icon: CalendarDays },
  { label: "Availability", href: "/stylist/availability", icon: Clock },
  { label: "My Services",  href: "/stylist/services",     icon: Scissors },
  { label: "Profile",      href: "/stylist/profile",      icon: User },
];

interface StylistSidebarProps {
  stylistName?:   string;
  avatarUrl?:     string;
  collapsed?:     boolean;
  onToggle?:      () => void;
}

export function StylistSidebar({ stylistName = "Stylist", avatarUrl, collapsed, onToggle }: StylistSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={cn(
      "flex flex-col h-screen sticky top-0 bg-charcoal border-r border-white/[0.06]",
      "transition-all duration-300",
      collapsed ? "w-[68px]" : "w-60"
    )}>
      {/* Logo + toggle */}
      <div className={cn(
        "flex items-center h-16 border-b border-white/[0.06] px-4 shrink-0",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold shrink-0">
              <Scissors className="h-3.5 w-3.5 text-obsidian" />
            </div>
            <span className="font-heading text-base text-white">SalonOS</span>
          </Link>
        )}
        {collapsed && (
          <div className="h-7 w-7 rounded-md bg-gold-gradient flex items-center justify-center shadow-gold">
            <Scissors className="h-3.5 w-3.5 text-obsidian" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-mist hover:text-pearl hover:bg-smoke transition-colors"
          >
            <ChevronRight className={cn("h-4 w-4 transition-transform duration-300", collapsed ? "" : "rotate-180")} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname.startsWith(href);
          const item = (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 group",
                active
                  ? "bg-gold/10 border border-gold/20 text-gold-light"
                  : "text-silver hover:text-pearl hover:bg-smoke border border-transparent",
                collapsed && "justify-center px-2.5"
              )}
            >
              <Icon className={cn("h-4.5 w-4.5 shrink-0", active ? "text-gold" : "text-mist group-hover:text-silver")} />
              {!collapsed && (
                <span className="font-body text-sm font-medium">{label}</span>
              )}
              {active && !collapsed && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gold" />
              )}
            </Link>
          );

          return collapsed
            ? <SimpleTooltip key={href} content={label} side="right">{item}</SimpleTooltip>
            : item;
        })}
      </nav>

      {/* User footer */}
      <div className={cn(
        "border-t border-white/[0.06] p-3 shrink-0",
      )}>
        <div className={cn(
          "flex items-center gap-3 rounded-xl p-2.5 hover:bg-smoke transition-colors cursor-pointer",
          collapsed && "justify-center"
        )}>
          <Avatar name={stylistName} src={avatarUrl} size="sm" status="online" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-body text-xs font-medium text-pearl truncate">{stylistName}</p>
              <p className="font-body text-2xs text-mist">Stylist</p>
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
