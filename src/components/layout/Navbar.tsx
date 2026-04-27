"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Menu, X, Scissors, User, LogOut, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const links = [
  { label: "Home",      href: "/"          },
  { label: "Services",  href: "/services"  },
  { label: "Stylists",  href: "/stylists"  },
  { label: "About",     href: "/about"     },
  { label: "Blog",      href: "/blog"      },
  { label: "Contact",   href: "/contact"   },
];

export function Navbar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user,     setUser]     = useState<any>(null);
  const [loading,  setLoading]  = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      subscription.unsubscribe();
    };
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-charcoal/90 backdrop-blur-xl border-b border-white/[0.06] shadow-md"
        : "bg-transparent",
    )}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold group-hover:shadow-glow transition-shadow duration-300">
            <Scissors className="h-4 w-4 text-obsidian" />
          </div>
          <span className="font-heading text-xl text-white">
            Salon<span className="text-gold-gradient">OS</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "px-3.5 py-2 rounded-lg font-body text-sm transition-all duration-150 drop-shadow-sm",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "text-gold-light bg-gold/8 border border-gold/15"
                  : "text-silver hover:text-pearl hover:bg-smoke",
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-24 flex items-center justify-center">
              <Loader2 className="h-4 w-4 animate-spin text-silver" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Account
                </Link>
              </Button>
              <Button variant="outline-gold" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/book">Book Now</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-silver hover:text-pearl hover:bg-smoke transition-colors"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-charcoal/97 backdrop-blur-xl border-t border-white/[0.06] px-6 py-4 space-y-1 animate-fade-in">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={cn(
                "block px-4 py-3 rounded-xl font-body text-sm transition-colors",
                pathname === href || (href !== "/" && pathname.startsWith(href))
                  ? "text-gold-light bg-gold/8"
                  : "text-silver hover:text-pearl hover:bg-smoke",
              )}
            >
              {label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-white/[0.06] mt-3">
            {user ? (
              <>
                <Button variant="secondary" size="sm" className="flex-1" asChild onClick={() => setOpen(false)}>
                  <Link href="/dashboard">Account</Link>
                </Button>
                <Button variant="outline-gold" size="sm" className="flex-1" onClick={() => { handleSignOut(); setOpen(false); }}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" size="sm" className="flex-1" asChild onClick={() => setOpen(false)}>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" className="flex-1" asChild onClick={() => setOpen(false)}>
                  <Link href="/book">Book Now</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
