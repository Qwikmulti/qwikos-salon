import Link from "next/link";
import { Scissors, Globe } from "lucide-react";

const sections = [
  {
    title: "Services",
    links: [
      { label: "Hair Cuts",         href: "/services#hair_cut"     },
      { label: "Braiding",          href: "/services#braiding"     },
      { label: "Colour",            href: "/services#hair_color"   },
      { label: "Treatments",        href: "/services#treatment"    },
      { label: "Beard Grooming",    href: "/services#beard"        },
      { label: "Natural Hair",      href: "/services#natural_hair" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us",    href: "/about"    },
      { label: "Our Stylists",href: "/stylists" },
      { label: "Blog",        href: "/blog"     },
      { label: "Contact",     href: "/contact"  },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Book Appointment", href: "/book"      },
      { label: "My Bookings",      href: "/bookings"  },
      { label: "Sign In",          href: "/login"     },
      { label: "Register",         href: "/register"  },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-obsidian border-t border-white/[0.05] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold">
                <Scissors className="h-4 w-4 text-obsidian" />
              </div>
              <span className="font-heading text-xl text-white">
                Salon<span className="text-gold-gradient">OS</span>
              </span>
            </Link>
            <p className="font-body text-sm text-mist leading-relaxed max-w-xs mb-4">
              London's premier luxury unisex salon in Notting Hill & Chelsea. Expert stylists for every hair type, identity, and style.
            </p>
            <p className="font-body text-sm text-mist mb-1">
              14 Portobello Road, Notting Hill, London W11 2DH
            </p>
            <p className="font-body text-sm text-mist mb-4">
              <a href="tel:+442079460958" className="hover:text-gold transition-colors">+44 20 7946 0958</a>
            </p>
            <div className="flex items-center gap-3">
              {[
                { label:"Instagram", handle:"@salonos.uk", href:"#" },
                { label:"Twitter",   handle:"@salonos_uk",href:"#" },
              ].map(({ label, handle, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg bg-smoke border border-ash/60 text-mist hover:text-gold hover:border-gold/40 transition-colors">
                  <Globe className="h-3.5 w-3.5" />
                  <span className="font-body text-xs">{handle}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {sections.map(({ title, links }) => (
            <div key={title}>
              <h4 className="font-body text-xs font-semibold tracking-[0.12em] uppercase text-gold mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link href={href}
                      className="font-body text-sm text-mist hover:text-pearl transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="font-body text-xs text-ash">
              © {new Date().getFullYear()} SalonOS Ltd. All rights reserved.
            </p>
            <span className="hidden sm:block text-ash">·</span>
            <p className="font-body text-xs text-ash">Registered in England & Wales</p>
          </div>
          <div className="flex items-center gap-6">
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(label => (
              <Link key={label} href="#"
                className="font-body text-xs text-ash hover:text-mist transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
