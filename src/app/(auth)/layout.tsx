import Link from "next/link";
import { Scissors } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-obsidian flex">
      {/* ── Left panel — decorative ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-charcoal">
        {/* Layered background */}
        <div className="absolute inset-0 bg-card-gradient" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/[0.06] blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gold/[0.04] blur-[80px]" />
        {/* Vertical gold line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.025] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.9%22%20numOctaves%3D%224%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22%2F%3E%3C%2Fsvg%3E')]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gold-gradient flex items-center justify-center shadow-gold">
              <Scissors className="h-4.5 w-4.5 text-obsidian" />
            </div>
            <span className="font-heading text-xl text-white">SalonOS</span>
          </Link>

          {/* Quote */}
          <div>
            <div className="h-px w-12 bg-gold mb-8" />
            <blockquote className="font-display text-4xl font-light text-white leading-snug mb-6">
              "Where every visit<br />
              is an <span className="italic text-gold-gradient">experience</span>."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gold-gradient flex items-center justify-center font-display text-obsidian font-medium">
                A
              </div>
              <div>
                <p className="font-body text-sm text-pearl">Amara Diallo</p>
                <p className="font-body text-xs text-mist">Lead Colorist, SalonOS</p>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-8">
            {[["3.2k+","Clients"],["12+","Stylists"],["4.9★","Rating"]].map(([v,l]) => (
              <div key={l}>
                <p className="font-display text-2xl text-white">{v}</p>
                <p className="font-body text-xs text-mist">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden absolute top-6 left-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
              <Scissors className="h-4 w-4 text-obsidian" />
            </div>
            <span className="font-heading text-lg text-white">SalonOS</span>
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
