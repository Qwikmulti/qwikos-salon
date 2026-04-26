"use client";
import { useState } from "react";
import { PageHeader }  from "@/components/ui/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input }       from "@/components/ui/input";
import { Textarea }    from "@/components/ui/textarea";
import { Button }      from "@/components/ui/button";
import { Switch }      from "@/components/ui/switch";
import { Separator }   from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast }       from "sonner";
import { Save, Globe, Clock, Bell, Shield, Palette } from "lucide-react";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"] as const;

const DEFAULT_HOURS: Record<string, { open:string; close:string; closed:boolean }> = {
  Monday:    { open:"09:00", close:"18:00", closed:false },
  Tuesday:   { open:"09:00", close:"18:00", closed:false },
  Wednesday: { open:"09:00", close:"18:00", closed:false },
  Thursday:  { open:"09:00", close:"18:00", closed:false },
  Friday:    { open:"09:00", close:"20:00", closed:false },
  Saturday:  { open:"09:00", close:"18:00", closed:false },
  Sunday:    { open:"10:00", close:"16:00", closed:false },
};

export default function AdminSettingsPage() {
  const [saving,  setSaving]  = useState<string | null>(null);
  const [hours,   setHours]   = useState(DEFAULT_HOURS);

  const [salon, setSalon] = useState({
    name: "SalonOS", tagline: "Where Style Meets Artistry.",
    address: "14 Portobello Road, Notting Hill, London",
    phone: "+44 20 7946 0958", email: "hello@salonos.co.uk",
    instagram: "salonos.co.uk", twitter: "salonos_ng", facebook: "SalonOSLondon",
  });

  const [booking, setBooking] = useState({
    leadTime: "60", window: "30", requireConfirmation: true,
    allowCancellation: true, cancellationHours: "2", sendReminders: true, reminderHours: "24",
  });

  const setSalonF = (k: keyof typeof salon) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSalon(s => ({ ...s, [k]: e.target.value }));
  const setBookingF = (k: keyof typeof booking) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setBooking(b => ({ ...b, [k]: e.target.value }));

  const updateHours = (day: string, field: "open" | "close" | "closed", value: string | boolean) =>
    setHours(h => ({ ...h, [day]: { ...h[day], [field]: value } }));

  const save = async (section: string) => {
    setSaving(section);
    await new Promise(r => setTimeout(r, 800));
    setSaving(null);
    toast.success(`${section} settings saved!`);
  };

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <PageHeader eyebrow="Configuration" title="Salon Settings" />

      <Tabs defaultValue="general">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="general"><Globe className="h-3.5 w-3.5" /> General</TabsTrigger>
          <TabsTrigger value="hours"><Clock className="h-3.5 w-3.5" /> Hours</TabsTrigger>
          <TabsTrigger value="booking"><Bell className="h-3.5 w-3.5" /> Booking</TabsTrigger>
          <TabsTrigger value="appearance"><Palette className="h-3.5 w-3.5" /> Appearance</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-3.5 w-3.5" /> Security</TabsTrigger>
        </TabsList>

        {/* ── GENERAL ── */}
        <TabsContent value="general">
          <Card variant="elevated" className="space-y-5">
            <h3 className="font-heading text-lg text-white">Salon Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Salon Name"    value={salon.name}    onChange={setSalonF("name")} />
              <Input label="Tagline"       value={salon.tagline} onChange={setSalonF("tagline")} />
            </div>
            <Input label="Address"         value={salon.address} onChange={setSalonF("address")} />
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone"         value={salon.phone}   onChange={setSalonF("phone")} type="tel" />
              <Input label="Email"         value={salon.email}   onChange={setSalonF("email")} type="email" />
            </div>
            <Separator />
            <h3 className="font-heading text-base text-white">Social Media</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input label="Instagram" value={salon.instagram} onChange={setSalonF("instagram")} icon={<span className="text-mist text-xs">@</span>} />
              <Input label="Twitter"   value={salon.twitter}   onChange={setSalonF("twitter")}   icon={<span className="text-mist text-xs">@</span>} />
              <Input label="Facebook"  value={salon.facebook}  onChange={setSalonF("facebook")} />
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" loading={saving === "General"} onClick={() => save("General")}>
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ── HOURS ── */}
        <TabsContent value="hours">
          <Card variant="elevated" className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <h3 className="font-heading text-lg text-white">Opening Hours</h3>
              <p className="font-body text-xs text-mist mt-1">These are the salon's public-facing hours. Individual stylists can set their own schedule.</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {DAYS.map(day => {
                const h = hours[day];
                return (
                  <div key={day} className={`flex items-center gap-4 px-6 py-3.5 ${h.closed ? "opacity-50" : ""}`}>
                    <div className="w-28 shrink-0 flex items-center gap-3">
                      <Switch checked={!h.closed} onCheckedChange={v => updateHours(day, "closed", !v)} />
                      <span className="font-body text-sm text-pearl">{day.slice(0,3)}</span>
                    </div>
                    {!h.closed ? (
                      <div className="flex items-center gap-3 flex-1">
                        <input type="time" value={h.open} onChange={e => updateHours(day,"open",e.target.value)}
                          className="bg-smoke border border-ash/60 rounded-lg px-3 py-1.5 font-mono text-sm text-pearl outline-none focus:border-gold w-28" />
                        <span className="text-mist text-xs">to</span>
                        <input type="time" value={h.close} onChange={e => updateHours(day,"close",e.target.value)}
                          className="bg-smoke border border-ash/60 rounded-lg px-3 py-1.5 font-mono text-sm text-pearl outline-none focus:border-gold w-28" />
                      </div>
                    ) : (
                      <span className="font-body text-sm text-ash italic">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="px-6 py-4 border-t border-white/[0.06] flex justify-end">
              <Button size="sm" loading={saving === "Hours"} onClick={() => save("Hours")}>
                <Save className="h-4 w-4" /> Save Hours
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ── BOOKING ── */}
        <TabsContent value="booking">
          <Card variant="elevated" className="space-y-6">
            <div>
              <h3 className="font-heading text-base text-white mb-4">Booking Rules</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Min. lead time (minutes)" type="number" value={booking.leadTime} onChange={setBookingF("leadTime")}
                  hint="How far in advance clients must book" />
                <Input label="Booking window (days)" type="number" value={booking.window} onChange={setBookingF("window")}
                  hint="How far ahead clients can schedule" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-heading text-base text-white">Policies</h3>
              <Switch label="Require manual confirmation" description="New bookings stay PENDING until a stylist or admin confirms"
                checked={booking.requireConfirmation} onCheckedChange={v => setBooking(b => ({...b, requireConfirmation: v}))} />
              <Switch label="Allow client cancellations" description="Clients can cancel within the allowed window"
                checked={booking.allowCancellation} onCheckedChange={v => setBooking(b => ({...b, allowCancellation: v}))} />
              {booking.allowCancellation && (
                <Input label="Cancellation window (hours)" type="number" className="max-w-xs"
                  value={booking.cancellationHours} onChange={setBookingF("cancellationHours")}
                  hint="Minimum notice required to cancel" />
              )}
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="font-heading text-base text-white">Notifications</h3>
              <Switch label="Send appointment reminders" description="Email clients before their appointment"
                checked={booking.sendReminders} onCheckedChange={v => setBooking(b => ({...b, sendReminders: v}))} />
              {booking.sendReminders && (
                <Input label="Reminder timing (hours before)" type="number" className="max-w-xs"
                  value={booking.reminderHours} onChange={setBookingF("reminderHours")} />
              )}
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" loading={saving === "Booking"} onClick={() => save("Booking")}>
                <Save className="h-4 w-4" /> Save Settings
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ── APPEARANCE ── */}
        <TabsContent value="appearance">
          <Card variant="elevated" className="space-y-5">
            <h3 className="font-heading text-lg text-white">Brand & Theme</h3>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label:"Primary Accent Color", value:"#C9973B", hint:"Gold — used for CTAs and highlights" },
                { label:"Secondary Color",       value:"#7A5C2E", hint:"Deep gold — used for gradients" },
              ].map(({ label, value, hint }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <label className="font-body text-xs uppercase tracking-widest text-silver">{label}</label>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg border border-ash/60 shrink-0" style={{ background: value }} />
                    <input type="color" defaultValue={value}
                      className="bg-graphite border border-ash rounded-lg px-3 py-2 font-mono text-sm text-pearl outline-none focus:border-gold flex-1 h-10" />
                  </div>
                  <p className="font-body text-xs text-mist">{hint}</p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-heading text-base text-white">Typography</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label:"Display Font",  value:"Cormorant Garamond", preview:"The Art of Beauty" },
                  { label:"Heading Font",  value:"DM Serif Display",   preview:"Our Services" },
                  { label:"Body Font",     value:"Jost",               preview:"Book your appointment today" },
                ].map(({ label, value, preview }) => (
                  <div key={label} className="bg-smoke border border-ash/40 rounded-xl p-4">
                    <p className="font-body text-2xs uppercase tracking-widest text-mist mb-2">{label}</p>
                    <p className="font-body text-sm text-pearl mb-1">{value}</p>
                    <p className="text-silver text-lg" style={{ fontFamily: value }}>{preview}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button size="sm" loading={saving === "Appearance"} onClick={() => save("Appearance")}>
                <Save className="h-4 w-4" /> Save Appearance
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* ── SECURITY ── */}
        <TabsContent value="security">
          <div className="space-y-4">
            <Card variant="elevated" className="space-y-5">
              <h3 className="font-heading text-lg text-white">Access & Authentication</h3>
              <Switch label="Require email verification" description="New accounts must verify their email before booking"
                checked={true} onCheckedChange={() => {}} />
              <Switch label="Google OAuth" description="Allow sign-in with Google accounts"
                checked={true} onCheckedChange={() => {}} />
              <Switch label="Two-factor authentication" description="Require 2FA for admin accounts"
                checked={false} onCheckedChange={() => {}} />
            </Card>
            <Card variant="elevated" className="space-y-4">
              <h3 className="font-heading text-base text-white">Danger Zone</h3>
              <p className="font-body text-sm text-mist">These actions are irreversible. Proceed with caution.</p>
              <div className="flex flex-wrap gap-3">
                <Button variant="danger" size="sm">Export All Data</Button>
                <Button variant="danger" size="sm">Reset Booking History</Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
