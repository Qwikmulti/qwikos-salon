"use client";
import { useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Input }    from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button }   from "@/components/ui/button";
import { toast }    from "sonner";
import { IMAGES }   from "@/lib/utils/images";
import { MapPin, Phone, Mail, Clock, Globe, Send, ArrowRight } from "lucide-react";

const contactInfo = [
  { icon: MapPin, label: "Address",  value: "14 Portobello Road, Notting Hill, London" },
  { icon: Phone,  label: "Phone",    value: "+44 20 7946 0958" },
  { icon: Mail,   label: "Email",    value: "hello@salonos.co.uk" },
  { icon: Clock,  label: "Hours",    value: "Mon–Fri 9am–6pm · Sat 9am–6pm · Sun 10am–4pm" },
];

const socials = [
  { icon: Globe, label: "Instagram", handle: "@salonos.co.uk",   href: "#" },
  { icon: Globe, label: "Twitter",   handle: "@salonos_ng",   href: "#" },
  { icon: Globe, label: "Facebook",  handle: "SalonOS London", href: "#" },
];

const faqs = [
  { q: "Do I need to pay a deposit?",    a: "No deposit required. Payment is collected at the salon after your appointment." },
  { q: "How do I cancel or reschedule?", a: "You can cancel or reschedule online up to 2 hours before your appointment at no charge." },
  { q: "Do you accept walk-ins?",        a: "We primarily operate by appointment to ensure every client gets the best experience. Walk-ins are welcome if we have availability." },
  { q: "Do you cater for kids?",         a: "Yes — we offer kids' hair services for children under 12 with patient, experienced stylists." },
];

// Metadata exported separately since this is a client component
// SEO is handled in the parent layout — see layout.tsx
export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Message sent!", { description: "We'll get back to you within 24 hours." });
    setForm({ name:"", email:"", phone:"", subject:"", message:"" });
  };

  return (
    <>
      {/* Hero — full bleed */}
      <section className="relative h-[52vh] min-h-[380px] flex items-end overflow-hidden bg-obsidian">
        <Image src={IMAGES.about.tools} alt="SalonOS contact" fill priority
          className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/65 to-obsidian/25" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-10 bg-gold" />
            <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">Get In Touch</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.0]">
            Let's <em className="not-italic text-gold-gradient">Talk.</em>
          </h1>
          <p className="font-body text-base text-silver/80 mt-4 max-w-md">
            Questions, bookings, partnerships, or just want to say hi — we're here.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-charcoal py-20">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">

          {/* Left — info */}
          <div>
            {/* Quick contact cards */}
            <h2 className="font-heading text-2xl text-white mb-7">Find Us</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {contactInfo.map(({ icon: Icon, label, value }) => (
                <div key={label}
                  className="flex items-start gap-4 bg-graphite border border-white/[0.06] rounded-2xl p-5 hover:border-gold/20 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-2xs uppercase tracking-widest text-mist mb-1">{label}</p>
                    <p className="font-body text-sm text-pearl leading-snug">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative h-56 rounded-2xl overflow-hidden border border-white/[0.06] mb-8 group">
              <Image src={IMAGES.about.interior1} alt="Salon location" fill
                className="object-cover opacity-30 group-hover:opacity-40 transition-opacity" sizes="600px" />
              <div className="absolute inset-0 bg-obsidian/60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <p className="font-body text-sm text-silver text-center px-6">14 Portobello Road, Notting Hill, London</p>
                <a href="https://maps.google.com/?q=Notting Hill+Phase+1+London" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 font-body text-xs text-gold hover:text-gold-light transition-colors underline underline-offset-2">
                  Open in Google Maps <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Socials */}
            <div className="flex flex-wrap gap-3">
              {socials.map(({ icon: Icon, label, handle, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-graphite border border-ash/40 hover:border-gold/30 hover:bg-smoke transition-all group">
                  <Icon className="h-4 w-4 text-mist group-hover:text-gold transition-colors" />
                  <div>
                    <p className="font-body text-2xs text-ash uppercase tracking-widest">{label}</p>
                    <p className="font-body text-xs text-silver">{handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form */}
          <div>
            <h2 className="font-heading text-2xl text-white mb-7">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Full Name" placeholder="Adaeze Okonkwo" value={form.name}
                  onChange={set("name")} required />
                <Input label="Email Address" type="email" placeholder="adaeze@email.com"
                  value={form.email} onChange={set("email")} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Phone (optional)" type="tel" placeholder="+44 801 234 5678"
                  value={form.phone} onChange={set("phone")} />
                <Input label="Subject" placeholder="Booking enquiry…"
                  value={form.subject} onChange={set("subject")} />
              </div>
              <Textarea label="Message" placeholder="Tell us how we can help…"
                rows={6} value={form.message} onChange={set("message")} required />
              <Button type="submit" size="lg" loading={loading} className="w-full">
                <Send className="h-4 w-4" /> Send Message
              </Button>
              <p className="font-body text-xs text-mist text-center">
                We typically respond within 24 hours on business days.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-obsidian py-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-5">
              <span className="h-px w-10 bg-gold" />
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold font-semibold">FAQ</span>
              <span className="h-px w-10 bg-gold" />
            </div>
            <h2 className="font-display text-4xl font-light text-white">Common Questions</h2>
          </div>
          <div className="space-y-4">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-graphite border border-white/[0.06] rounded-2xl p-6 hover:border-gold/20 transition-colors">
                <h3 className="font-heading text-base text-white mb-2">{q}</h3>
                <p className="font-body text-sm text-mist leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
