"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast }  from "sonner";
import { Scissors, User, ChevronRight, Sparkles } from "lucide-react";

const roles = [
  {
    key: "CUSTOMER",
    icon: User,
    title: "I'm a Client",
    desc: "I want to browse stylists, book appointments, and manage my visits.",
    perks: ["Browse all stylists & services", "Book in under 2 minutes", "Track your appointment history"],
    cta:  "Continue as Client",
  },
  {
    key: "STYLIST",
    icon: Scissors,
    title: "I'm a Stylist",
    desc: "I want to manage my schedule, set availability, and serve my clients.",
    perks: ["Manage your weekly schedule", "Accept & track bookings", "Build your client portfolio"],
    cta:  "Continue as Stylist",
  },
] as const;

export default function OnboardingPage() {
  const router   = useRouter();
  const supabase = createClient();
  const [selected, setSelected] = useState<"CUSTOMER" | "STYLIST" | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleContinue = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upsert profile with chosen role
      await fetch("/api/profile", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ role: selected }),
      });

      toast.success("All set!", { description: "Welcome to SalonOS." });
      router.push(selected === "STYLIST" ? "/stylist/dashboard" : "/customer/dashboard");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gold/10 border border-gold/25 mb-5">
          <Sparkles className="h-6 w-6 text-gold" />
        </div>
        <h1 className="font-display text-4xl font-light text-white mb-2">
          Welcome to <span className="italic text-gold-gradient">SalonOS</span>
        </h1>
        <p className="font-body text-sm text-mist max-w-sm mx-auto">
          Tell us how you'll be using SalonOS so we can personalise your experience.
        </p>
      </div>

      {/* Role cards */}
      <div className="space-y-4 mb-8">
        {roles.map(role => {
          const Icon    = role.icon;
          const isActive = selected === role.key;
          return (
            <motion.button
              key={role.key}
              type="button"
              onClick={() => setSelected(role.key)}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
                isActive
                  ? "bg-gold/8 border-gold/40 shadow-gold"
                  : "bg-graphite border-white/[0.07] hover:border-ash hover:bg-smoke"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "bg-gold/15 border border-gold/30" : "bg-smoke border border-ash/50"
                }`}>
                  <Icon className={`h-5 w-5 ${isActive ? "text-gold" : "text-mist"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-heading text-lg ${isActive ? "text-white" : "text-pearl"}`}>{role.title}</h3>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isActive ? "border-gold bg-gold" : "border-ash"
                    }`}>
                      {isActive && <div className="h-2 w-2 rounded-full bg-obsidian" />}
                    </div>
                  </div>
                  <p className="font-body text-xs text-mist mb-3">{role.desc}</p>
                  <ul className="space-y-1">
                    {role.perks.map(perk => (
                      <li key={perk} className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-gold" : "bg-ash"}`} />
                        <span className={`font-body text-xs ${isActive ? "text-silver" : "text-ash"}`}>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <Button size="lg" loading={loading} onClick={handleContinue} className="w-full">
              {roles.find(r => r.key === selected)?.cta}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {!selected && (
        <p className="text-center font-body text-xs text-ash">Select a role to continue</p>
      )}
    </div>
  );
}
